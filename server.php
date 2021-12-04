<?php

require_once('libs/websockets.php');

$sketches = [];
$groups = [];

class User extends WebSocketUser {

	public $sketch = 0;
	public $host = false;

	function __construct($id, $socket) {
		parent::__construct($id, $socket);
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
		echo "Listening on: $addr:$port (using socket: " . $this->master . ")\n";
	}

	protected function process($user, $message) {
		global $sketches, $groups;

		@list($command, $args) = explode(' ', $message, 2);

		if( $command === "MAKE" ) {
			
			if( $user->sketch != 0 ) {
				$this->send($user, "ERROR User already in group!");
				return;
			}else{
				if( count($sketches) > 1000 ) {
					$this->send($user, "ERROR Too many groupes in use!");
					return;
				}
			}

			$sketch = getNewSketch();
			$groups[$sketch] = ["host" => $user, "clients" => []];

			$user->sketch = $sketch;
			$user->host = true;

			$this->send($user, "MAKE $sketch");

			echo "Client " . $user->id . " added new group $sketch\n";
			return;

		} elseif($command == "JOIN") {

			if( $user->sketch != 0 ) {
				$this->send($user, "ERROR User already in group!");
				return;
			}

			$sketch = (int) $args;

			if( !in_array($sketch, $sketches) ) {
				$this->send($user, "ERROR No such group!");
				return;
			}

			array_push($groups[$sketch]["clients"], $user);
			$user->sketch = $sketch;
			$user->host = false;

			$this->send($groups[$sketch]["host"], "JOIN");

			echo "Client " . $user->id . " joind group $sketch\n";
			return;

		} elseif($command == "SEND") {

			$host = $groups[$user->sketch]["host"];
			$this->send($host, "TEXT ". $args);

			return;

		} elseif($command == "BROADCAST") {

			$group = $groups[$user->sketch];

			$clients = $group["clients"];

			foreach($clients as &$client) {
				if( $client != $user ) $this->send($client, "TEXT ". $args);
			}
	
			if( !$user->host ) {
				$host = $group["host"];
				$this->send($host, "TEXT ". $args);
			}

			return;

		} elseif($command == "CLOSE") {

			$this->disassociate($user);
			return;

		}

		$this->send($user, "ERROR Invalid command!");
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
	
				$clients = $groups[$user->sketch]["clients"];

				foreach($clients as &$client) {
					$this->disassociate($client);
				}

				unset($sketches[$user->sketch]);
				unset($groups[$user->sketch]);

				$user->sketch = 0;
				$user->host = false;
			}else{
				unset($sketches[$user->sketch]);
			
				if (($key = array_search($user, $groups[$user->sketch]["clients"])) !== false) {
					unset($groups[$user->sketch]["clients"][$key]);
				}

				$host = $groups[$user->sketch]["host"];
				$this->send($host, "LEFT $key");

				$user->sketch = 0;
			}

			echo "Client " . $user->id . " left group $group\n";
		}

		$this->send($user, "CLOSE");

	}

}

$server = new LogixServer("0.0.0.0", "9000", 2048);

try {
	$server->run();
}
catch (Exception $e) {
	echo $e->getMessage() + "\n";
}

