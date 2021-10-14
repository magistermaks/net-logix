
function wire(x1, y1, x2, y2, state) {
	const a = (x2 - x1) / 4;
	const c = state ? color(9, 98, 218) : 0;

	fill(c);

	stroke(c);
	circle(x1, y1, 10);
	circle(x2, y2, 10);

	stroke(255);
	strokeWeight(6);
	line(x1, y1, x1 + a, y1);
	line(x1 + a, y1, x2 - a, y2);
	line(x2, y2, x2 - a, y2);

	stroke(c);
	strokeWeight(2);
	line(x1, y1, x1 + a, y1);
	line(x1 + a, y1, x2 - a, y2);
	line(x2, y2, x2 - a, y2);
}

class WirePoint {

	index;
	gate;

	constructor(gate, index) {
		this.gate = gate;
		this.index = index;
	}

	draw( target, state = false ) {
		let from = this.gate.getRightPoint(this.index);
		let to = target.gate.getLeftPoint(target.index);
	  
		wire(int(from.x), int(from.y), int(to.x), int(to.y), state ? color(9, 98, 218) : 0);
	}

}

class InputWirePoint extends WirePoint {

	constructor(gate, index) {
		super(gate, index);
	}

	get() {
		return this.gate.getOutputState(this.index);
	}

}

class OutputWirePoint {

	self;
	targets;

	// boolean
	state;

	constructor(gate, index) {
		this.self = new WirePoint(gate, index); 
		this.targets = [];
		this.state = false;
	}

	add(gate, index) {
		this.targets.push( new WirePoint(gate, index) );
	}

	remove(gate, index) {
		for( var key in this.targets ) {
			if( this.targets[key].index == index && this.targets[key].gate == gate ) {
				delete this.targets[key];
				break;
			}
		}
	}

	removeAll() {
		for( var target of this.targets ) {
			if( target != null ) {
				target.gate.disconnect(target.index);
			}
		}

		this.targets = [];
	}

	draw() {
		for(var key in this.targets) this.self.draw( this.targets[key], this.state );
	}

}

class WireEditor {

	static #from;
	static #clicked;

	static click() {
	  
		if( !WireEditor.#clicked ) {
			WireEditor.#from = null;
		}
	  
		WireEditor.#clicked = false;
	}

	static isClicked() {
		return WireEditor.#from != null;
	}

	static left(gate, index) {
		WireEditor.#clicked = true;

		if( WireEditor.#from != null ) {
			WireEditor.#from.gate.connect(WireEditor.#from.index, gate, index);
			WireEditor.#from = null;
		}else{
			WireEditor.#from = gate.getInput(index);
			gate.disconnect(index);
		}
	}

	static right(gate, index) {
		WireEditor.#clicked = true;
		WireEditor.#from = new WirePoint(gate, index);
	}

	static draw() {
		if( WireEditor.#from != null ) {
			const point = WireEditor.#from.gate.getRightPoint(WireEditor.#from.index);
			const state = WireEditor.#from.gate.getOutputState(WireEditor.#from.index);

			wire(int(point.x), int(point.y), Mouse.x, Mouse.y, state ? color(9, 98, 218) : 0);
		}
	}

}
