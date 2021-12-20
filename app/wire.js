
/// draws wire between two points
function wire(x1, y1, x2, y2, state) {
	const c = state ? color(9, 98, 218) : 0;
	const a = (x2 - x1) / 4;
	
	fill(c);

	// start & end
	stroke(c);
	strokeWeight(2);
	circle(x1 + 0.5, y1 + 0.5, 10);
	circle(x2 + 0.5, y2 + 0.5, 10);

	noFill();

	// background
	stroke(255);
	strokeWeight(6);

	if( Settings.SMOOTH_WIRES.get() ) {
		bezier(x1, y1, x1 + a, y1, x2-a, y2, x2, y2);
	}else{
		line(x1, y1, x1 + a, y1);
		line(x1 + a, y1, x2 - a, y2);
		line(x2, y2, x2 - a, y2);
	}

	// foreground
	stroke(c);
	strokeWeight(2);

	if( Settings.SMOOTH_WIRES.get() ) {
		bezier(x1, y1, x1 + a, y1, x2-a, y2, x2, y2);
	}else{
		line(x1, y1, x1 + a, y1);
		line(x1 + a, y1, x2 - a, y2);
		line(x2, y2, x2 - a, y2);
	}

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

	notify() {
		for(let point of this.targets) {
			point?.gate.notify();
		}
	}

}

class WireEditor {

	static #targets = null;
	static #clicked = false;
	static #input = false;

	static click() {
		WireEditor.#targets = null;
	}	
	
	static isClicked() {
		return WireEditor.#targets != null;
	}

	static left(gate, index) {

		if( WireEditor.isClicked() && !WireEditor.#input ) {

			if( WireEditor.#targets != null ) {
				Event.Cwire.trigger({
					uid: WireEditor.#targets[0].gate.getId(), 
					output: WireEditor.#targets[0].index, 
					target: gate.getId(), 
					index: index
				});

				if( keyCode != CONTROL || !isKeyPressed ) {
					WireEditor.#targets = null;
				}
			}else{
//				WireEditor.#targets = [gate.getInput(index)];
//				gate.disconnect(index);
			}
			return;

		}

		// TODO: this was a little confusing to use (input => output drawing)
		// but i'm not ruling out the option of adding it in some form in the future

		// if( keyCode == CONTROL && isKeyPressed ) {	
		// 	WireEditor.#targets = [new WirePoint(gate, index)];
		// 	WireEditor.#input = true;
		// } else

		if( gate.getInput(index) != null ) {
			WireEditor.#targets = [gate.getInput(index)];
			Event.Dwire.trigger({uid: gate.getId(), index: index});
			WireEditor.#clicked = true;
			WireEditor.#input = false;
		}
	}

	static right(gate, index) {

		if( WireEditor.isClicked() && WireEditor.#input ) {

			// use control to replace, not merge connections
			if( keyCode == CONTROL && isKeyPressed ) gate.getOutput(index).removeAll();

			for( let target of WireEditor.#targets ) {
				Event.Cwire.trigger({
					uid: gate.getId(), 
					output: index, 
					target: target.gate.getId(), 
					index: target.index
				});
			}

			WireEditor.#targets = null;
			return;
		}

		WireEditor.#clicked = true;

		if( keyCode == CONTROL && isKeyPressed ) {
			WireEditor.#targets = gate.getOutput(index).targets.filter(() => true); // copy array without <empty slots> ehh
			gate.getOutput(index).removeAll();
			WireEditor.#input = true;
		}else{
			WireEditor.#targets = [new WirePoint(gate, index)];
			WireEditor.#input = false;
		}
	}

	static draw() {
		if( WireEditor.#targets != null && WireEditor.#targets.length > 0 ) {
			const state = !WireEditor.#input ? WireEditor.#targets[0].gate.getOutputState(WireEditor.#targets[0].index) : 0;

			for( let target of WireEditor.#targets ) {
				const point = WireEditor.#input ? target.gate.getLeftPoint(target.index) : target.gate.getRightPoint(target.index);

				wire(int(point.x), int(point.y), Mouse.x, Mouse.y, state);

				// indicate that replace mode is active
				if( keyCode == CONTROL && isKeyPressed ) {
					stroke(255, 0, 0);
					noFill();
					circle(Mouse.x + 0.5, Mouse.y + 0.5, 20);
				}
			}
		}
	}

}
