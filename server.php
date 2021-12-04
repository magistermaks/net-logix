<?php

require_once('libs/websockets.php');

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

}

function getNewSketch() {
	global $sketches;

	do {
		$id = rand(10000, 99999);
	} while( in_array($id, $sketches) );

	array_push($sketches, $id);

	return $id;
}

class LogixServer extends WebSocketServer {

	function __construct($addr, $port, $bufferLength) {
		parent::__construct($addr, $port, $bufferLength);

		echo "This software is licensed under GNU GPL 2.0, Copyright (c) magistermaks\n";
		echo "Powered by PHP WebSockets library by Adam Alexander\n\n";
		echo "Logix WebSocket server started!\n";
		echo "Listening on: $addr:$port (using socket: " . $this->master . ")\n\n";
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

			$sketch = getNewSketch();
			$groups[$sketch] = new Group($user);

			$user->sketch = $sketch;
			$user->group = $groups[$sketch];
			$user->host = true;

			$this->send($user, "MAKE $sketch");

			echo "Client " . $user->id . " added new group $sketch\n";
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

			$this->send($user, "JOIN");
			$this->send($group->host, "JOIN " . $user->id);

			echo "Client " . $user->id . " joind group $sketch\n";
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
		echo "Client " . $user->id . " connected\n";
	}
  
	protected function closed($user) {
		echo "Client " . $user->id . " disconnected\n";
		$this->disassociate($user);
	}

	private function disassociate($user) {
		global $sketches, $groups;
	
		$group = $user->sketch;

		if( $user->sketch != 0 ) {

			if( $user->host ) {

				foreach( $user->group->clients as &$client ) {
					$this->disassociate($client);
				}

				unset($sketches[$user->sketch]);
				unset($groups[$user->sketch]);
				$user->reset();

			}else{
				$user->group->remove($user);
				$this->send($user->group->host, "LEFT " . $user->id);
				$user->reset();
			}

			echo "Client " . $user->id . " left group $group\n";
		}

		$this->send($user, "CLOSE");
	}

}

$server = new LogixServer("0.0.0.0", "9000", 2048);

try {
	$server->run();
} catch (Exception $e) {
	echo $e->getMessage() + "\n";
}

