
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
	#callback;

	userid = null;

	constructor(address, callbackOpen, callbackReady, callbackClosed) {
		this.#socket = new WebSocket(address);

		// manage server state
		this.#socket.onopen = () => {this.#state = this.#state.connect(); callbackOpen();}
		this.#socket.onclose = () => {this.#state = ServerState.Disconnected; callbackClosed();};
		this.#socket.onerror = (error) => console.error(error);
		this.#socket.onmessage = (msg) => this.#process(msg.data);

		this.#callback = callbackReady;
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

		if(dbg_show_traffic) {
			console.log(`Server: ${msg}`);
		}

		// split message to command and args
		const index = msg.indexOf(" ");
		const command = index == -1 ? msg : msg.substring(0, index);
		const args = index == -1 ? "" : msg.substring(index + 1);

		// server issued the ERROR command, something is wrong
		if( command == "ERROR" ) {
			popup.open(
				"Network Error!",
				"Server reported an error: " + args[0].toUpperCase() + args.slice(1) + "!",
				popup.button("Ok", () => GUI.exit())
			);
		}
	
		// share group creation succeeded
		if( command == "MAKE" ) {
			this.#callback(args);
		}

		// server kicked us from the sketch group :(
		if( command == "CLOSE" ) {
			this.#state = ServerState.Connected;
		}

		// we joined a group, now we can transmit
		if( command == "READY" ) {
			this.#state = ServerState.Ready;
		}

		// user joined the group
		if( command == "JOIN" ) {

			if( mode == HOST ) {
				// send sync event, kinda ugly but i will live with this
				let data = LZString.compressToUTF16(`{"id":${Event.Sync.id},"args":${JSON.stringify(Manager.serialize())}}`);
				this.#send(`TRANSMIT ${args} ${data}`);
			}

			GUI.notifications.push("User joined!");
		}

		// user left group
		if( command == "LEFT" ) {
			GUI.notifications.push("User left!");
			Pointers.remove(args);
		}

		// guten tag!
		if( command == "HELLO" ) {
			this.userid = args;
		}

		// incoming message
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

	disconnect() {
		this.#socket.close();
	}

}

