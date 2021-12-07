<?php

require_once('websockets.php');

$sketches = [];
$groups = [];

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
		echo "Client " . $this->id . " $msg\n";
	}

}

function addNewSketch() {
	global $sketches;

	do {
		$id = rand(10000, 99999);
	} while( in_array($id, $sketches) );

	array_push($sketches, $id);

	return $id;
}

function unsetSketch($sketch) {
	global $sketches;

	$index = array_search($sketch, $sketches);

	if( $index !== false ) {
		unset($sketches[$index]);
	}
}

class LogixServer extends WebSocketServer {

	private $last = 0;

	function __construct($addr, $port, $bufferLength) {
		parent::__construct($addr, $port, $bufferLength);

		echo "This software is licensed under GNU GPL 2.0, Copyright (c) magistermaks\n";
		echo "Powered by PHP WebSockets library by Adam Alexander\n\n";
		echo "Logix WebSocket server started!\n";
		echo "Listening on: $addr:$port (using socket: " . $this->master . ")\n\n";

		$this->last = date_timestamp_get(date_create());
	}

	protected function tick() {
		global $sketches, $groups;
		$now = date_timestamp_get(date_create());

		if( $now - $this->last > 10 ) {
			$this->last = $now;
			$c = count($sketches);

			if( $c == 0 ) {
				safeExit("The server is empty, shuting down...");
			}
		}
	}

	protected function process($user, $message) {
		global $sketches, $groups;

		@list($command, $args) = explode(' ', $message, 2);

		if( $command === "MAKE" ) {
			
			if( $user->sketch != 0 ) {
				$this->send($user, "ERROR user already in group");
				return;
			}

			if( count($sketches) > 1000 ) {
				$this->send($user, "ERROR too many groupes in use");
				return;
			}

			$sketch = addNewSketch();
			$groups[$sketch] = new Group($user);

			$user->sketch = $sketch;
			$user->group = $groups[$sketch];
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

			if( !in_array($sketch, $sketches) ) {
				$this->send($user, "ERROR no such group");
				return;
			}

			$group = $groups[$sketch];
			$group->add($user);

			$user->sketch = $sketch;
			$user->group = $group;
			$user->host = false;

			$this->send($user, "READY");
			$this->send($group->host, "JOIN " . $user->id);

			$user->write("joind group $sketch");
			return;

		} elseif($command == "SEND") {

			if( $user->group == null ) {
				$this->send($user, "ERROR unable to transmit outside of group");
			}

			$this->send($user->group->host, "TEXT ". $args);
			return;

		} elseif($command == "BROADCAST") {

			if( $user->group == null ) {
				$this->send($user, "ERROR unable to transmit outside of group");
			}

			foreach( $user->group->clients as &$client ) {
				if($client != $user) $this->send($client, "TEXT $args");
			}
	
			if( !$user->host ) {
				$this->send($user->group->host, "TEXT $args");
			}

			return;

		} elseif($command == "CLOSE") {

			$this->disassociate($user);
			return;

		}

		$this->send($user, "ERROR invalid command");
	}
  
	protected function connected($user) {
		$user->write("connected");
	}
  
	protected function closed($user) {
		$user->write("disconnected");
		$this->disassociate($user);
	}

	private function disassociate($user) {
		global $sketches, $groups;
	
		$sketch = $user->sketch;

		if( $user->sketch != 0 ) {

			if( $user->host ) {

				foreach( $user->group->clients as &$client ) {
					$this->disassociate($client);
				}

				unsetSketch($sketch);
				unset($groups[$sketch]);
				$user->reset();

			}else{
				$user->group->remove($user);
				$this->send($user->group->host, "LEFT " . $user->id);
				$user->reset();
			}

			$user->write("left group $sketch");

		}

		$this->send($user, "CLOSE");
		$this->last = date_timestamp_get(date_create());
	}

}

$server = new LogixServer("0.0.0.0", "9000", 2048);

try {
	$server->run();
} catch (Exception $e) {
	echo $e->getMessage() + "\n";
}

