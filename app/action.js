
var dbg_show_trafic = true;

class Action {

	static #throttled = {};
	static #registry = {};
	static host = true;

	static #register(name, synced, throttle, local, remote) {
		Action.#registry[name] = {
			synced: synced, local: local, remote: remote, throttle: throttle, last: 0
		}
	}

	static init() {

		function gateOf(obj) {
			return gates.find(gate => gate.getId() == obj.uid);
		}

		// add new gate
		Action.#register("add", true, false, (obj, res) => {
			Gate.create(obj.type, obj.x, obj.y, res.uid);
		}, (obj) => {
			return {uid: Gate.create(obj.type, obj.x, obj.y).getId(), state: true};
		});
	
		// remove gate
		Action.#register("rem", false, false, (obj, res) => {
			gateOf(obj).remove();
		}, (obj) => {
			gateOf(obj).remove();
			return {state: true};
		});

		// move gate
		Action.#register("mov", false, true, (obj, res) => {
			if(res != null) { // don't actualy run on client if not asked by host
				const gate = gateOf(obj);
				gate.x = obj.x; gate.y = obj.y;
			}
		}, (obj) => {
			const gate = gateOf(obj);
			gate.x = obj.x; gate.y = obj.y;
			return {state: true};
		});

		// disconnect wire
		Action.#register("dwire", false, false, (obj, res) => {
			gateOf(obj).disconnect(obj.index);
		}, (obj) => {
			gateOf(obj).disconnect(obj.index);
			return {state: true};
		});

		// connect wire
		Action.#register("cwire", false, false, (obj, res) => {
			gateOf(obj).connect(obj.output, gates.find(gate => gate.getId() == obj.target), obj.index);
		}, (obj) => {
			gateOf(obj).connect(obj.output, gates.find(gate => gate.getId() == obj.target), obj.index);
			return {state: true};
		});

		// used by InputGate
		Action.#register("switch", false, false, (obj, res) => {
			gateOf(obj).setState(obj.state);
		}, (obj) => {
			gateOf(obj).setState(obj.state);
			return {state: true};
		});


		// throttle worker
		setInterval(() => {
			for( let key in Action.#throttled ) {
				const obj = Action.#throttled[key];
				Action.submit(obj.action, obj.handle, obj.local, true);
			}
		}, 200);

	}

	static execute(type, args) {

		if(dbg_show_trafic) console.log(`Executing action of type: "${type}" with args: ${JSON.stringify(args)}`)

		const object = {type: type, args: args};
		const handle = Action.#registry[type];

		if( handle.synced ) {
			Action.submit(object, handle, (res, state) => {
				if(!state) console.error("Communication with host desynced!");
				Action.#apply(handle, object, res);
			});
		}else{
			Action.#apply(handle, object, null);
			Action.submit(object, handle, (res, state) => {
				if(!state) console.error("Communication with host desynced!");
			});
		}
	}

	static submit(action, handle, local, force = false) {

		if( handle.throttle && !force ) {
			Action.#throttled[action.type] = {action: action, handle: handle, local: local};
			return;
		}

		setTimeout(() => { 
			const res = handle.remote(action.args);
			local(res, res.state);
		}, 0);
	}

	static #apply(handle, action, res) {
		if(!Action.host) handle.local(action.args, res);
	}

}

