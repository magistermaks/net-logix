
class LocalServer {

	constructor() {
	}

	event(id, args, handle, userid) {
		if(userid == null) handle.event(args);
	}

	ready() {
		return true;
	}

	close() {

	}
}

class RemoteServer {

	#socket;
	#ready = false;
	#creation_callback;
	#close_callback;

	userid = null;

	constructor(address, group, creation_callback, close_callback) {
		this.#socket = new WebSocket(address);

		// join a group as soon as the connection is open
		this.#socket.onopen = () => {
			this.#send( group == null ? "MAKE" : ("JOIN " + group) );
		}

		this.#socket.onclose = () => close_callback();
		this.#socket.onerror = (error) => console.error(error);
		this.#socket.onmessage = (msg) => this.#process(msg.data);
		this.#creation_callback = creation_callback;
		this.#close_callback = close_callback;
	}

	#send(msg) {
		if (this.open()) {
			this.#socket.send(msg);

			if (dbg_show_traffic) {
				console.log(`Send: ${msg}`);
			}
		}
	}

	event(id, args, handle, userid) {
		if (userid == null) {
			this.#send((handle.direct ? "SEND " : "BROADCAST ") + Event.encode(id, args));
		} else {
			this.#send(`TRANSMIT ${userid} ${Event.encode(id, args)}`);
		}
	}

	#process(msg) {

		if (dbg_show_traffic) {
			console.log(`Server: ${msg}`);
		}

		// split message to command and args
		const index = msg.indexOf(" ");
		const command = index == -1 ? msg : msg.substring(0, index);
		const args = index == -1 ? "" : msg.substring(index + 1);

		// server issued the ERROR command, something is wrong
		if (command == "ERROR") {
			popup.open(
				"Network Error!",
				"Server reported an error: " + args[0].toUpperCase() + args.slice(1) + "!",
				popup.button("Ok", () => GUI.exit())
			);
		}

		// share group creation succeeded
		if (command == "MAKE") {
			this.#creation_callback(args);
		}

		// server kicked us from the sketch group :(
		if (command == "CLOSE") {
			this.#ready = false;
			this.#close_callback(args);
		}

		// we joined a group, now we can transmit
		if (command == "READY") {
			this.#ready = true;
		}

		// user joined the group
		if (command == "JOIN") {
			if (mode == HOST) {
				Event.Sync.trigger(Manager.serialize(), args);
			}

			GUI.notifications.push("User joined!");
		}

		// user left group
		if (command == "LEFT") {
			GUI.notifications.push("User left!");
			Pointers.remove(args);
		}

		// guten tag!
		if (command == "HELLO") {
			this.userid = args;
		}

		// a response to QUERY command
		if (command == "STATUS") {
			if (args == "unavaible") {
				console.warn("[SERVER] This server disabled QUERY requests!");
			} else {
				const stats = args.split(",");
				const stamp = Number.parseInt(stats[0]);
				const secs = stamp % 60;
				const mins = floor(stamp / 60);
				const hors = floor(mins / 60);

				console.log(`[SERVER] uptime: ${hors}h ${mins % 60}m ${secs}s, online: ${stats[1]}, groups: ${stats[2]}`);
			}
		}

		// incoming message
		if (command == "TEXT") {
			const object = Event.decode(args);
			Event.execute(object.id, object.args, null, true);
		}

	}

	// check if the server is ready to process events
	ready() {
		return this.open() && this.#ready;
	}

	// check if the connection is established
	open() {
		return this.#socket.readyState == 1;
	}

	// close the connection
	close() {
		this.#socket.onclose = null;
		this.#socket.close();
	}

	query() {
		this.#send("QUERY");
	}

}

class ServerManager {

	// switch to local server
	static local() {
		mode = LOCAL;
		Event.server.close();

		Event.server = new LocalServer();
	}

	// pass null to start hosting
	static remote(code) {
		if (code != null) mode = CLIENT;
		Event.server.close();

		Event.server = new RemoteServer(
			cfg_server,
			code,
			(id) => { // creation callback

				// this is called only for host (when code was null)
				popup.open(
					"Sketch Sharing",
					`Sketch access code: <b>${id}</b>, share it so that others can join!`,
					popup.button("Ok", () => popup.close())
				);

				group = id;
				mode = HOST;
				GUI.notifications.push("Began sketch sharing!");
			},
			() => { // close callback, not called if the conection is closed with Event.server.close()

				popup.open(
					"Network Error!",
					"Connection with server lost!",
					popup.button("Ok", (mode == CLIENT) ? () => GUI.exit() : () => popup.close())
				);

				if (mode == HOST) {
					ServerManager.local();
					GUI.notifications.push("Ended sketch sharing!");
				}
			}
		);
	}

}

