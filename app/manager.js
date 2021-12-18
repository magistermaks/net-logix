
name = "";

class Manager {

	static #valid = false;

	static serialize() {
		
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
				"t": gate.constructor.id,
				"x": round(gate.x),
				"y": round(gate.y),
				"i": id,
				"w": outputs
			};

			if( meta != null ) {
				obj.m = meta;
			}

			json.push(obj);

		}

		return {
			"j": json,
			"x": round(zox),
			"y": round(zoy),
			"z": factor.toFixed(1),
			"u": Date.now(),
			"n": name
		};

	}

	static deserialize(obj, normalize = true) {
		
		zox = obj.x ?? 0;
		zoy = obj.y ?? 0;
		factor = Number(obj.z ?? 1);
		name = obj.n;

		let named = new Map();

		for( var gate of obj.j ) {
			named.set(gate.i, Gate.create(gate.t, gate.x, gate.y, normalize ? -1 : gate.i, gate.m));
		}

		for( var i = 0; i < gates.length; i ++ ) {

			let gate = obj.j[i];

			for( var j = 0; j < gate.w.length; j ++ ) {

				for( var point of gate.w[j] ) {
					
					if( point != null ) {

						let parts = point.split(":");
						gates[i].connect(j, named.get(int(parts[1])), int(parts[0]));

					}

				}
			}
		}

		// update all gates in a sketch
		UpdateQueue.all();
		Manager.#valid = true;

	}

	static reset() {
		gates = [];
	}

	static load(id) {
		Manager.reset();

		try { 
			Manager.deserialize( Save.get(id) );
			return true;
		} catch(err) {
			return false;
		}
	}

	static print() {
		return JSON.stringify(Manager.serialize());
	}

	static save(id) {
		// we shouldn't be saving in online mode nor
		// when the data in `gates` is bogus
		if( !online && Manager.#valid ) {
			Save.set(id, Manager.serialize());
		}
	}

}


