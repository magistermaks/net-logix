
class Event {

	static #throttled = {};
	static #registry = [];
	static server = new LocalServer();

	direct;
	local;
	event;
	id;

	constructor(direct, local, event) {
		this.direct = direct;
		this.local = local;
		this.event = event;
		this.id = Event.#registry.length;

		Event.#registry.push(this);
	}

	// add gate server side
	static Add = new Event(true, false, (obj) => {
		obj.uid = Gate.create(obj.type, obj.x, obj.y).getId();
		Event.Put.trigger(obj);
	});

	// add get client side
	static Put = new Event(false, false, (obj) => {
		if(Gate.get(obj.uid) == null) Gate.create(obj.type, obj.x, obj.y, obj.uid);
	});
	
	// remove gate
	static Rem = new Event(false, true, (obj) => {
		Gate.get(obj.uid)?.remove();
	});

	// move gate
	static Mov = new Event(false, false, (obj) => {
		for(let entry of obj) MoveQueue.apply(Gate.get(entry.uid), entry.x, entry.y);
	});
	
	// disconnect wire
	static Dwire = new Event(false, true, (obj) => {
		Gate.get(obj.uid).disconnect(obj.index);
	});

	// connect wire
	static Cwire = new Event(false, true, (obj) => {
		Gate.get(obj.uid).connect(obj.output, Gate.get(obj.target), obj.index);
	});

	// used by InputGate
	static Switch = new Event(false, true, (obj) => {
		Gate.get(obj.uid).setState(obj.state);
	});

	// sync gate array, this can never be invoked by client
	static Sync = new Event(true, false, (obj) => {
		Manager.reset();
		Manager.deserialize(obj, false);
		screenOffsetUpdate();
	});

	// broadcast cursor position
	static Mouse = new Event(false, false, (obj) => {
		Pointers.update(obj.u, obj.x, obj.y);
	});

	// add an array of gates server side
	static Merge = new Event(true, false, (obj) => {
		let inserted = Manager.deserializeArray(obj.a);
		Event.MergeClient.trigger( {a: Manager.serializeArray(inserted)} );
		Event.Select.trigger( {a: inserted.map(gate => gate.getId())}, obj.u );
	});

	// add an array of normalized gates client side
	static MergeClient = new Event(false, false, (obj) => {
		if(mode == CLIENT) Manager.deserializeArray(obj.a, false);
	});

	// force the client to select a group of gates
	static Select = new Event(true, false, (obj) => {
		Selected.removeAll();
		obj.a.forEach(id => Selected.add(Gate.get(id)));
	});

	trigger(args, userid = null, external = false) {
		if( !Event.server.ready() ) {
			console.warn("Unable to process event! Event server not inititialized!"); 
			return;
		}

		if(dbg_show_events) console.log(`Executing event (id: "${this.id}") with args: ${JSON.stringify(args)}`)

		const object = {id: this.id, args: args};

		try{
			if(this.local || external) this.event(object.args);
			if(!external) Event.server.event(object.id, object.args, this, userid);
		}catch(error) {
			console.error(error);
			console.error(`Error "${error.message}" occured while processing event: ${JSON.stringify(object)}`);
		}
	}

	static execute(id, args, userid = null, external = false) {
		Event.#registry[id].trigger(args, userid, external);
	}

	static encode(id, args) {
		return LZString.compressToUTF16(`${id};${JSON.stringify(args)}`);
	}

	static decode(string) {
		const prt = LZString.decompressFromUTF16(string).split(/;(.+)/);
		return {id: Number.parseInt(prt[0]), args: JSON.parse(prt[1])};
	}

}

