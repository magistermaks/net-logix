
class SingleStateGate extends IconGate {

	#icon;
	
	constructor(x, y, title, inputs, outputs, complexity, icon) {
		super(x, y, title, inputs, outputs, complexity);

		this.#icon = icon;
	}
	
	getImage() {
		return this.#icon;
	}

}

class TwoStateGate extends IconGate {

	#on;
	#off;
	
	constructor(x, y, title, inputs, outputs, complexity, on, off) {
		super(x, y, title, inputs, outputs, complexity);

		this.#on = on;
		this.#off = off;
	}
	
	getImage() {
		return this.getOutputState(0) ? this.#on : this.#off
	}

}

class InputGate extends TwoStateGate {
 
	state;
  
	constructor(x, y, meta) {
		super(x, y, "Input", 0, 1, 0, Resource.get("on"), Resource.get("off"));
		this.state = Boolean(Number(meta ?? 0));
	}

	click(mx, my, double) {
		super.click(mx, my, double);
		
		if( mx > scx + this.x + Box.wiggle 
			&& mx < scx + this.x + Box.w - Box.wiggle 
			&& my > scy + this.y + Box.top + Box.wiggle 
			&& my < scy + this.y + Box.h - Box.wiggle ) {

			this.state = !this.state;
			this.notify();
		}
	}

	update() {
		this.setOutputState(0, this.state);
	}

	serialize() {
		return this.state ? 1 : 0;
	}
  
}

class ClockGate extends SingleStateGate {
 
	state = false;
	static period = 10;
  
	constructor(x, y, meta) {
		super(x, y, "Oscillator", 0, 1, 0, Resource.get("clock"));
		Scheduler.add(this);
	}

	tick() {
		super.tick();

		if( tick % ClockGate.period == 0 ) {
			this.state = !this.state;
			this.notify();
		}
	}

	update() {
		this.setOutputState(0, this.state);
	}
  
}

class AndGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "And", 2, 1, 3, Resource.get("and"));
	}
	
	update() {
		this.setOutputState(0, this.getInputState(0) && this.getInputState(1));
	}
  
}

class XorGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Xor", 2, 1, 6, Resource.get("xor"));
	}
	
	update() {
		this.setOutputState(0, this.getInputState(0) != this.getInputState(1));
	}
  
}

class OrGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Or", 2, 1, 0, Resource.get("or"));
	}
	
	update() {
		this.setOutputState(0, this.getInputState(0) || this.getInputState(1));
	}
  
}

class NorGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Nor", 2, 1, 1, Resource.get("nor"));
	}
	
	update() {
		this.setOutputState(0, !(this.getInputState(0) || this.getInputState(1)));
	}
  
}

class NotGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Not", 1, 1, 1, Resource.get("not"));
	}
	
	update() {
		this.setOutputState(0, !this.getInputState(0));
	}
  
}

class OutputGate extends TwoStateGate {
	
	state = false;
  
	constructor(x, y) {
	   super(x, y, "Output", 1, 0, 0, Resource.get("on"), Resource.get("off"));
	}
  
	getOutputState(index) {
		return this.state;
	}

	notify() {
		super.notify();
		this.state = this.getInputState(0);
	}
  
}

class Registry {

	static #ids = new Map();
	static #names = new Map();
	static #id = 0;

	static add(clazz, title, icon) {
		Registry.#ids.set(Registry.#id, clazz);
		Registry.#names.set(clazz.name, clazz);

		clazz.id = Registry.#id;
		clazz.title = title;
		clazz.icon = icon;

		Registry.#id ++;
	}

	static init() {
		// never change the order of this
		// or things will explode

		Registry.add(InputGate, "Switch", "in");
		Registry.add(ClockGate, "Oscillator", "clock");
		Registry.add(AndGate, "AND Gate", "and");
		Registry.add(XorGate, "XOR Gate", "xor");
		Registry.add(OrGate, "OR Gate", "or");
		Registry.add(NorGate, "NOR Gate", "nor");
		Registry.add(NotGate, "NOT Gate", "not");
		Registry.add(OutputGate, "Indicator", "out");
	}

	static get(id) {
		return Registry.#ids.get(id);
	}

	static forEach(callback) {
		for(let clazz of this.#ids.values()) {
			callback(clazz);
		}
	}

	/// deprected
	static getByName(name) {
		return Registry.#names.get(name);
	}

}

