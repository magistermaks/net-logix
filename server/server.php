<?php

require_once('websockets.php');

class Group {

	public $host;
	public $clients = [];

	function __construct($host) {
		$this->host = $host;
	}

	public function add($user) {
		array_push($this->clients, $user);
	}

	public function remove($user) {
		$index = array_search($user, $this->clients);

		if( $index !== false ) {
			unset($this->clients[$index]);
		}
	}

}

class User extends WebSocketUser {

	public $sketch = 0;
	public $group = null;
	public $host = false;

	function __construct($id, $socket) {
		parent::__construct($id, $socket);
	}

	public function reset() {
		$this->sketch = 0;
		$this->group = null;
		$this->host = false;
	}

	public function write($msg) {
		echo "[" . date_format(date_create(), "Y/m/d H:i:s") . "] Client " . $this->id . " $msg\n";
	}

}

class LogixServer extends WebSocketServer {

	private $start;
	private $allowQuery;
	private $sketches = [];
	private $groups = [];

	function __construct($addr, $port, $bufferLength, $allowQuery) {
		parent::__construct($addr, $port, $bufferLength);

		echo "This software is licensed under GNU GPL 2.0, Copyright (c) magistermaks\n";
		echo "Powered by PHP WebSockets library by Adam Alexander\n";
		echo "Logix WebSocket server started, listening on: $addr:$port\n\n";

		$this->allowQuery = $allowQuery;
		$this->start = date_timestamp_get(date_create());
	}

	private function addSketch() {
		do {
			$id = rand(10000, 99999);
		} while( in_array($id, $this->sketches) );

		array_push($this->sketches, $id);

		return $id;
	}

	private function deleteSketch($id) {
		$index = array_search($id, $this->sketches);

		if( $index !== false ) {
			unset($this->sketches[$index]);
		}
	}

	protected function process($user, $message) {
		@list($command, $args) = explode(' ', $message, 2);

		if( $command === "MAKE" ) {
			
			if( $user->sketch != 0 ) {
				$this->send($user, "ERROR user already in group");
				return;
			}

			if( count($this->sketches) > 1000 ) {
				$this->send($user, "ERROR too many groupes in use");
				return;
			}

			$sketch = $this->addSketch();
			$this->groups[$sketch] = new Group($user);

			$user->sketch = $sketch;
			$user->group = $this->groups[$sketch];
			$user->host = true;

			$this->send($user, "MAKE $sketch");
			$this->send($user, "READY");
	
			$user->write("created group $sketch");
			return;

		} elseif($command == "JOIN") {

			if( $user->sketch != 0 ) {
				$this->send($user, "ERROR user already in group");
				return;
			}

			$sketch = (int) $args;

			if( !in_array($sketch, $this->sketches) ) {
				$this->send($user, "ERROR no such group");
				return;
			}

			$group = $this->groups[$sketch];
			$group->add($user);

			$user->sketch = $sketch;
			$user->group = $group;
			$user->host = false;

			$this->send($user, "READY");

			$this->send($group->host, "JOIN " . $user->id);
			foreach( $group->clients as &$client ) {
				if($client != $user) $this->send($client, "JOIN " . $user->id);
			}

			$user->write("joind group $sketch");
			return;

		} elseif($command == "SEND") {

			if( $user->group == null ) {
				$this->send($user, "ERROR unable to transmit outside of group");
				return;
			}

			$this->send($user->group->host, "TEXT ". $args);
			return;

		} elseif($command == "BROADCAST") {

			if( $user->group == null ) {
				$this->send($user, "ERROR unable to transmit outside of group");
				return;
			}

			foreach( $user->group->clients as &$client ) {
				if($client != $user) $this->send($client, "TEXT $args");
			}
	
			if( !$user->host ) {
				$this->send($user->group->host, "TEXT $args");
			}

			return;

		} elseif($command == "TRANSMIT") {

			if( $user->group == null ) {
				$this->send($user, "ERROR unable to transmit outside of group");
				return;
			}

			if( !$user->host ) {
				$this->send($user, "ERROR only host can invoke this command");
				return;
			}

			@list($uid, $message) = explode(' ', $args, 2);

			foreach( $user->group->clients as &$client ) {
				if($client->id === $uid) $this->send($client, "TEXT $message");
			}
			return;

		} elseif($command == "CLOSE") {

			$this->disassociate($user);
			return;

		} elseif($command == "QUERY") {

			if( $this->allowQuery ) {

				$userCount = count($this->users);
				$sketchCount = count($this->sketches);
				$uptime = date_timestamp_get(date_create()) - $this->start;
	
				$this->send($user, "STATUS $uptime,$userCount,$sketchCount");
			}else{
				$this->send($user, "STATUS unavaible");
			}
			return;

		}

		$user->write("send invalid command '$command'");
		$this->send($user, "ERROR invalid command");
	}
  
	protected function connected($user) {
		$user->write("connected");
		$this->send($user, "HELLO " . $user->id);
	}
  
	protected function closed($user) {
		$user->write("disconnected");
		$this->disassociate($user);
	}

	private function disassociate($user) {
		$sketch = $user->sketch;

		if( $user->sketch != 0 ) {

			if( $user->host ) {

				foreach( $user->group->clients as &$client ) {
					$this->disassociate($client);
				}

				$this->deleteSketch($sketch);
				unset($this->groups[$sketch]);
				$user->reset();

			}else{
				$user->group->remove($user);
				
				$this->send($user->group->host, "LEFT " . $user->id);
				foreach( $user->group->clients as &$client ) {
					if($client != $user) $this->send($client, "LEFT " . $user->id);
				}

				$user->reset();
			}

			$user->write("left group $sketch");

		}

		$this->send($user, "CLOSE");
		$this->last = date_timestamp_get(date_create());
	}

}

$config = parse_ini_file("../logix.ini");

if( $config['online'] ) {

	$server = new LogixServer("0.0.0.0", $config['port'], 2048, $config['allow_query']);

	try {
		$server->run();
	} catch( Exception $e ) {
		echo $e->getMessage() + "\n";
	}

}else{
	echo "Online mode disabled in logix.ini, start aborted...\n";
	die(); 
}

