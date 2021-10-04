
name = "";

class Manager {

	static #serialize() {
		
		let json = []
		let next = 0;

		for( var gate of gates ) {
			
			let outputs = [];
			let id = gate.getId();

			if( id > next ) {
				next = id;
			}

			for( var output of gate.outputs ) {
 
				if( output == null ) {
					continue;
				}

				let wires = [];

				for( var target of output.targets ) {

					if( target == null ) {
						continue;
					}

					wires.push( target.index + ":" + target.gate.getId() );

				}

				outputs.push(wires);			

			}

			json.push( {
				"class": gate.constructor.name,
				"x": gate.x,
				"y": gate.y,
				"id": id,
				"wires": outputs
			} );

		}

		return {
			"json": json,
			"next": next,
			"x": scx,
			"y": scy,
			"name": name
		};

	}

	static #deserialize(obj) {
		
		nextGateId = obj.next;
		scx = obj.x;
		scy = obj.y;
		name = obj.name;

		for( var gate of obj.json ) {
			Gate.deserialize(gate.class, gate.x, gate.y, gate.id);
		}

		for( var i = 0; i < gates.length; i ++ ) {

			let gate = obj.json[i];

			for( var j = 0; j < gate.wires.length; j ++ ) {

				for( var point of gate.wires[j] ) {
					
					let parts = point.split(":");
					gates[i].connect(j, gates[parts[1]], int(parts[0]));

				}
			}
		}

	}

	static reset() {
		gates = [];
		boxes = [];
		nextGateId = 0;
	}

	static load(id) {
		Manager.reset();

		let obj = JSON.parse(localStorage.getItem(id));

		if( obj == null ) {
			return false;
		}

		Manager.#deserialize(obj);
		return true;
	}

	static print() {
		return JSON.stringify(Manager.#serialize());
	}

	static save(id) {
		let json = JSON.stringify(Manager.#serialize());

		localStorage.setItem(id, json);
	}

}


