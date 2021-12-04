
var dbg_show_trafic = true;

class Event {

	static #throttled = {};
	static #registry = {};
	static server = null;

	static #register(name, direct, local, event) {
		Event.#registry[name] = {
			direct: direct, local: local, event: event
		}
	}

	static init() {

		function gateOf(obj) {
			return gates.find(gate => gate.getId() == obj.uid);
		}

		// add new gate on host
		Event.#register("add", true, false, (obj) => {
			obj.uid = Gate.create(obj.type, obj.x, obj.y).getId();
			Event.execute("put", obj);
		});

		// add new gate on client
		Event.#register("put", false, false, (obj) => {
			if( gateOf(obj) == null ) Gate.create(obj.type, obj.x, obj.y, obj.uid);
		});
	
		// remove gate
		Event.#register("rem", false, true, (obj) => {
			gateOf(obj).remove();
		});

		// move gate
		Event.#register("mov", false, false, (obj) => {
			const gate = gateOf(obj);
			gate.x = obj.x; gate.y = obj.y;
		});

		// disconnect wire
		Event.#register("dwire", false, true, (obj) => {
			gateOf(obj).disconnect(obj.index);
		});

		// connect wire
		Event.#register("cwire", false, true, (obj) => {
			gateOf(obj).connect(obj.output, gates.find(gate => gate.getId() == obj.target), obj.index);
		});

		// used by InputGate
		Event.#register("switch", false, true, (obj) => {
			gateOf(obj).setState(obj.state);
		});

	}

	static execute(type, args, external = false) {

		if( Event.server == null ) {
			console.warn("Unable to process event! Event server not inititialized!"); 
			return;
		}

		if(dbg_show_trafic) console.log(`Executing event of type: "${type}" with args: ${JSON.stringify(args)}`)

		const object = {type: type, args: args};
		const handle = Event.#registry[type];

		if(handle.local || external) Event.#apply(handle, object);
		if(!external) Event.submit(object, handle);
	}

	static submit(event, handle) {
		Event.server.event(event, handle);
	}

	static #apply(handle, event) {
		handle.event(event.args);
	}

}

