
name = "";

class Manager {

	static #serialize() {
		
		let json = []

		for( var gate of gates ) {
			
			let outputs = [];
			let id = gate.getId();

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

			const meta = gate.serialize();

			let obj = {
				"type": gate.constructor.name.slice(0, -4),
				"x": gate.x,
				"y": gate.y,
				"id": id,
				"wires": outputs
			};

			if( meta != null ) {
				obj.meta = meta;
			}

			json.push(obj);

		}

		return {
			"json": json,
			"x": round(scx),
			"y": round(scy),
			"name": name
		};

	}

	static #deserialize(obj) {
		
		scx = obj.x;
		scy = obj.y;
		name = obj.name;

		let named = new Map();

		for( var gate of obj.json ) {
			named.set(gate.id, Gate.deserialize(gate.type, gate.x, gate.y, gate.meta));
		}

		for( var i = 0; i < gates.length; i ++ ) {

			let gate = obj.json[i];

			for( var j = 0; j < gate.wires.length; j ++ ) {

				for( var point of gate.wires[j] ) {
					
					if( point != null ) {

						let parts = point.split(":");
						gates[i].connect(j, named.get(int(parts[1])), int(parts[0]));

					}

				}
			}
		}

	}

	static reset() {
		gates = [];
	}

	static load(id) {
		Manager.reset();

		try { 
			Manager.#deserialize( Save.get(id) );
			return true;
		} catch(err) {
			return false;
		}
	}

	static print() {
		return JSON.stringify(Manager.#serialize());
	}

	static save(id) {	
		Save.set(id, Manager.#serialize());
	}

}


