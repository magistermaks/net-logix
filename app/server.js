
class LocalServer {

	constructor() {
	}

	event(object, handle) {
		handle.event(object.args);
	}

	ready() {
		return true;
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
		this.#send((handle.direct ? "SEND " : "BROADCAST ") + LZString.compressToUTF16(JSON.stringify(object)));
	}

	#process(msg) {
		console.log("Server: " + msg);

		const index = msg.indexOf(" ");
		const command = index == -1 ? msg : msg.substring(0, index);
		const args = index == -1 ? "" : msg.substring(index + 1);

		if( command == "ERROR" ) {
			alert( "Network error: " + args[0].toUpperCase() + args.slice(1) + "!" );
		}
	
		if( command == "MAKE" ) return;
		if( command == "CLOSE" ) this.#state = ServerState.Connected;

		if( command == "READY" ) this.#state = ServerState.Ready

		if( command == "JOIN" ) {
			// user joined group, send to host
		}

		if( command == "LEFT" ) {
			// user left group, send to host
		}

		if( command == "TEXT" ) {
			const object = JSON.parse(LZString.decompressFromUTF16(args));
			Event.execute(object.id, object.args, true);
		}
		
	}

	ready() {
		return this.#state == ServerState.Ready;
	}

	close() {
		this.#send("CLOSE");
	}

}

