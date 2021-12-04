
class LocalServer {

	constructor() {
	}

	event(object, handle) {
		handle.event(object.args);
	}

}

class ServerState {

	connected;

	static Disconnected = new ServerState("disconnected", false);
	static Connected = new ServerState("connected", true);
	static Ready = new ServerState("ready", true);

	constructor(name, connected) {
		this.name = name;
		this.connected = connected;
	}

	connect() {
		if(this == ServerState.Disconnected) return ServerState.Connected;
	}

}

class RemoteServer {

	#socket;
	#state = ServerState.Disconnected;

	constructor(address) {
		this.#socket = new WebSocket(address);

		// manage server state
		this.#socket.onopen = () => this.#state = this.#state.connect();
		this.#socket.onclose = () => this.#state = ServerState.Disconnected;
		this.#socket.onerror = (error) => console.error(error);
		
		this.#socket.onmessage = (msg) => this.#process(msg.data);
	}

	join(group) {
		if(this.#state == ServerState.Ready) {
			this.#send("CLOSE");
		}

		this.#send("JOIN " + group);
	}

	host() {
		if(this.#state == ServerState.Ready) {
			this.#send("CLOSE");
		}

		this.#send("MAKE");
	}

	#send(msg) {
		if(this.#state.connected) this.#socket.send(msg);
	}

	event(object, handle) {
		this.#send((handle.direct ? "SEND " : "BROADCAST ") + JSON.stringify(object));
	}

	#process(msg) {
		console.log("Server: " + msg);

		const index = msg.indexOf(" ");
		const command = msg.substr(0, index);
		const args = msg.substr(index + 1);

		if( command == "OK" ) return;
		if( command == "ERROR" ) return;
		if( command == "MAKE" ) return;

		if( command == "TEXT" ) {
			const object = JSON.parse(args);
			Event.execute(object.type, object.args, true);
		}
		
	}

}

