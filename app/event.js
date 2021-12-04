
var dbg_show_events = false;

class Event {

	static #throttled = {};
	static #registry = {};
	static server = new LocalServer();

	static #register(name, direct, local, event) {
		Event.#registry[name] = {
			direct: direct, local: local, event: event
		}
	}

	static init() {

		// add new gate on host
		Event.#register("add", true, false, (obj) => {
			obj.uid = Gate.create(obj.type, obj.x, obj.y).getId();
			Event.execute("put", obj);
		});

		// add new gate on client
		Event.#register("put", false, false, (obj) => {
			if( Gate.get(obj.uid) == null ) Gate.create(obj.type, obj.x, obj.y, obj.uid);
		});
	
		// remove gate
		Event.#register("rem", false, true, (obj) => {
			Gate.get(obj.uid).remove();
		});

		// move gate
		Event.#register("mov", false, false, (obj) => {
			for(let entry of obj) Gate.get(entry.uid).move(entry.x, entry.y);
		});

		// disconnect wire
		Event.#register("dwire", false, true, (obj) => {
			Gate.get(obj.uid).disconnect(obj.index);
		});

		// connect wire
		Event.#register("cwire", false, true, (obj) => {
			Gate.get(obj.uid).connect(obj.output, Gate.get(obj.target), obj.index);
		});

		// used by InputGate
		Event.#register("switch", false, true, (obj) => {
			Gate.get(obj.uid).setState(obj.state);
		});

	}

	static execute(type, args, external = false) {

		if( !Event.server.ready() ) {
			console.warn("Unable to process event! Event server not inititialized!"); 
			return;
		}

		if(dbg_show_events) console.log(`Executing event of type: "${type}" with args: ${JSON.stringify(args)}`)

		const object = {type: type, args: args};
		const handle = Event.#registry[type];

		try{
			if(handle.local || external) handle.event(object.args);
			if(!external) Event.server.event(object, handle);
		}catch(error) {
			console.error(`Error occured while processing event: ${JSON.stringify(object)}`);
		}
	}

}

