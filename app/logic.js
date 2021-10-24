
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
		}
	}

	update() {
		this.outputs[0].state = this.state;
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
		//this.period = Number(meta ?? 10);
	}

	tick() {
		super.tick();

		if( tick % ClockGate.period /*this.period*/ == 0 ) {
			this.state = !this.state;
		}
	}

	update() {
		this.outputs[0].state = this.state;
	}

	serialize() {
		return null; //this.period;
	}
  
}

class AndGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "And", 2, 1, 3, Resource.get("and"));
	}
	
	update() {
		this.outputs[0].state = this.getInputState(0) && this.getInputState(1);
	}
  
}

class XorGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Xor", 2, 1, 6, Resource.get("xor"));
	}
	
	update() {
		this.outputs[0].state = this.getInputState(0) != this.getInputState(1);
	}
  
}

class OrGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Or", 2, 1, 0, Resource.get("or"));
	}
	
	update() {
		this.outputs[0].state = this.getInputState(0) || this.getInputState(1);
	}
  
}

class NorGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Nor", 2, 1, 1, Resource.get("nor"));
	}
	
	update() {
		this.outputs[0].state = !(this.getInputState(0) || this.getInputState(1));
	}
  
}

class NotGate extends SingleStateGate {
	
	constructor(x, y) {
	   super(x, y, "Not", 1, 1, 1, Resource.get("not"));
	}
	
	update() {
		this.outputs[0].state = !this.getInputState(0);
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

	tick() {
		this.state = this.getInputState(0);
	}
  
}

class Registry {

	static #reg = new Map();
	static #id = 0;

	static add(clazz) {
		Registry.#reg.set(Registry.#id, clazz);
		clazz.id = Registry.#id;

		Registry.#id ++;
	}

	static init() {
		Registry.add(InputGate);
		Registry.add(ClockGate);
		Registry.add(AndGate);
		Registry.add(XorGate);
		Registry.add(OrGate);
		Registry.add(NorGate);
		Registry.add(NotGate);
		Registry.add(OutputGate);
	}

	static get(id) {
		return Registry.#reg.get(id);
	}

}

