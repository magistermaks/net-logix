
var gates = []
var nextGateId = 0;

class Gate extends Box {
  
	#updated;

	inputs;
	outputs;

	#id;
 
	constructor( x, y, title, inputs, outputs ) {
		super(x, y, title);
		
		this.inputs = Array(inputs);
		this.outputs = Array(outputs);

		for( var i = 0; i < outputs; i ++ ) {
			this.outputs[i] = new OutputWirePoint(this, i);
		}
		
		this.left = inputs;
		this.right = outputs;
		
		this.#updated = 0;
		this.#id = nextGateId ++;
		
		gates.push(this);
	}

	getId() {
		return this.#id;
	}
	
	connect( output, target, input ) {
		target.disconnect(input);        

		target.inputs[input] = new InputWirePoint(this, output);
		this.outputs[output].add(target, input);
	}
	
	disconnect( input ) {
		if( this.inputs[input] != null ) {
			let point = this.inputs[input];

			point.gate.outputs[point.index].remove(this, input);
			this.inputs[input] = null;
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
		if( this.#updated != tick ) {
			this.#updated = tick;
			this.update();
		}
	  
		return this.getOutput(index).state;
	}
	
	drawWires() {
		for( var key in this.outputs ) if(this.outputs[key] != null) this.outputs[key].draw();
	}

	remove() {
		super.remove();

		for( var i = 0; i < this.inputs.length; i ++ ) {
			this.disconnect(i);
		}

		for( var output of this.outputs ) {
			output.removeAll();
		}

		gates.splice( gates.indexOf(this), 1 );
	}
	
	tick() {
		// this is needed to keep the wire highlighting working on output-less branches
		if( this.#updated + 4 < tick ) {

			for( var i = 0; i < this.outputs.length; i ++ ) {
				this.getOutputState(i);
			}

		}
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

		if( /^[A-Z][a-z]+$/.test(type) ) {
			return new (eval(type + "Gate"))(x, y, meta);
		}else{
			return null;
		}

	}

	serialize() {
		return null;
	}
  
}

class IconGate extends Gate {
  
	constructor(x, y, title, inputs, outputs) {
		super(x, y, title, inputs, outputs);
	}
	
	getImage() {
		return null;
	}
	
	content(x, y) {
		let img = this.getImage();

		if( img == null || img.modified !== true /* check if the image is loaded */ ) {

			const angle = PI + frameCount * 0.1;
			const space = PI;
  
			noFill();
			stroke(0);
			arc(x + Box.w / 2, y + (Box.h - Box.top) / 2, Box.h / 2.5, Box.h / 2.5, angle, angle + space);

		}else{
			image(this.getImage(), x + Box.w / 2, y + (Box.h - Box.top) / 2, Box.h / 2, Box.h / 2);
		}
	}
  
}
