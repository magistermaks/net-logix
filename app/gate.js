
var gates = []
var nextGateId = 0;

class Gate extends Box {
  
	#updated;
	#modified;
	#complexity;

	inputs;
	outputs;

	#id;
 
	constructor( x, y, title, inputs, outputs, complexity = 0 ) {
		super(x, y, title);
		
		this.inputs = Array(inputs);
		this.outputs = Array(outputs);

		for( var i = 0; i < outputs; i ++ ) {
			this.outputs[i] = new OutputWirePoint(this, i);
		}
		
		this.left = inputs;
		this.right = outputs;
		
		this.#updated = 0;
		this.#modified = false;
		this.#complexity = complexity;
		this.#id = nextGateId ++;

		gates.push(this);
	}

	static create(gid, x, y, uid = -1) {
		let gate = new (Registry.get(gid))(x, y);
		if( uid != -1 ) gate.#id = uid;
		return gate;
	}

	static get(uid) {
		return gates.find(gate => gate.#id == uid);
	}

	getId() {
		return this.#id;
	}
		
	connect( output, target, input ) {
		target.disconnect(input);        

		target.inputs[input] = new InputWirePoint(this, output);
		this.outputs[output].add(target, input);
		target.notify();
	}
	
	disconnect( input ) {
		if( this.inputs[input] != null ) {
			let point = this.inputs[input];

			point.gate.outputs[point.index].remove(this, input);
			this.inputs[input] = null;
			this.notify();
		}
	}
	
	getInput(index) {
		return this.inputs[index];
	}
	
	getInputState(index) {
		return this.inputs[index] == null ? false : this.inputs[index].get();
	}
	
	getOutput(index) {
		return this.outputs[index];
	}
	
	getOutputState(index) {
		return this.getOutput(index).state;
	}

	setOutputState(index, value) {
		const out = this.outputs[index];

		if( out.state != value ) {
			out.state = value;
			this.#modified = true;
		}
	}

	notify() {
		this.#updated = tick;
		this.update();

		if( this.#modified ) {
			this.#modified = false;

			this.outputs.forEach(out => {
				if(out != null) UpdateQueue.add(out);
			});
		}
	}
	
	drawWires() {
		this.outputs.forEach(out => {
			out?.draw();
		});
	}

	remove() {
		for( var i = 0; i < this.inputs.length; i ++ ) {
			this.disconnect(i);
		}

		for( var output of this.outputs ) {
			output.removeAll();
		}

		Selected.remove(this);
		Scheduler.remove(this);
		gates.splice( gates.indexOf(this), 1 );
	}

	top() {
		const index = gates.indexOf(this);

		if( index != gates.length - 1 ) {
			gates.splice(index, 1);
			gates.push(this);
		}
	}

	showUpdates() {
		if( this.#updated >= tick ) {
			fill(0, 200, 0, 100);
			stroke(0, 200, 0, 0);
			rect(scx + this.x, scy + this.y, Box.w, Box.h);
		}
	}

	tick() {

	}
	
	update() {
		
	}
	
	click(mx, my, double) {
		super.click(mx, my, double);

		if( mx < scx + this.x + Box.wiggle ) {
			for( var i = 0; i < this.left; i ++ ) {
				let py = this.getLeftPoint(i).y;
				
				if( my < py + Box.wiggle && my > py - Box.wiggle ) {
					WireEditor.left(this, i);
				}
			}
		}
		
		if( mx > scx + this.x + Box.w - Box.wiggle ) {
			for( var i = 0; i < this.right; i ++ ) {
				let py = this.getRightPoint(i).y;
				
				if( my < py + Box.wiggle && my > py - Box.wiggle ) {
					WireEditor.right(this, i);
				}
			}
		}
	}

	static deserialize(type, x, y, meta) {
		return new (Number.isInteger(type) ? Registry.get(type) : Registry.getByName(type + "Gate"))(x, y, meta);
	}

	serialize() {
		return null;
	}

	getComplexity() {
		return this.#complexity;
	}
  
}

class IconGate extends Gate {
  
	constructor(x, y, title, inputs, outputs, complexity) {
		super(x, y, title, inputs, outputs, complexity);
	}
	
	getImage() {
		return null;
	}
	
	content(x, y) {
		image(this.getImage(), x + Box.w / 2, y + (Box.h - Box.top) / 2, Box.h / 2, Box.h / 2);
	}

}

class MoveQueue {
	
	static #updates = new Set();

	static init() {
		MoveQueue.add = gate => MoveQueue.#updates.add(gate);

		setInterval(() => {
			let updates = [];

			MoveQueue.#updates.forEach(gate => updates.push({
				uid: gate.getId(), x: round(gate.x), y: round(gate.y)
			}));

			if( updates.length > 0 ) {
				Event.Mov.trigger(updates);
			}

			MoveQueue.#updates.clear();
		}, 250);
	}

}

class UpdateQueue {
	
	static #updates = new Set();

	static add(gate) {
		UpdateQueue.#updates.add(gate);
	}

	static init() {
		gates.forEach(gate => UpdateQueue.add(gate));
	}

	static execute() {
		const queue = UpdateQueue.#updates;
		UpdateQueue.#updates = new Set();

		queue.forEach(gate => gate.notify());
	}

	static size() { 
		return UpdateQueue.#updates.size; 
	}

}

class Scheduler {

	static #ticking = [];

	static add(gate) {
		Scheduler.#ticking.push(gate);
	}

	static remove(gate) {
		if( Scheduler.#ticking.includes(gate) ) {
			Scheduler.#ticking.splice(Scheduler.#ticking.indexOf(gate), 1);
		}
	}

	static tick() {
		Scheduler.#ticking.forEach(gate => {
			gate.tick();
		});
	}

}

