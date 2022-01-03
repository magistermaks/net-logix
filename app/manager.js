
name = "";

class Manager {

	static #valid = false;

	static serializeArray(array, wires = true, ox = 0, oy = 0) {
		
		return array.map(gate => {
	
			const obj = {
				"t": gate.constructor.id,
				"x": round(gate.x - ox),
				"y": round(gate.y - oy),
				"i": gate.getId(),
				"w": wires ? gate.outputs.map(output => output.targets.map(target => `${target.index}:${target.gate.getId()}`)) : []
			};

			const meta = gate.serialize();
			if(meta != null) obj.m = meta;
			
			return obj;

		});

	}

	static serialize() {

		return {
			"j": Manager.serializeArray(gates),
			"x": round(zox),
			"y": round(zoy),
			"z": factor.toFixed(1),
			"u": Date.now(),
			"n": name
		};

	}

	// Warn: this method modifies global state
	static deserializeArray(array, normalize = true, ox = 0, oy = 0) {

		const named = new Map();

		// load all gates into logix and index them by id for later use
		const inserted = array.map(obj => {
			const gate = Gate.create(obj.t, obj.x + ox, obj.y + oy, normalize ? -1 : obj.i, obj.m)
			named.set(obj.i, gate);
			return gate;
		}); 

		// load wire configuration
		inserted.forEach((gate, key) => {
			array[key].w.forEach((output, index) => output.forEach(point => {
				const parts = point.split(":");
				const uid = int(parts[1]);

				if(named.has(uid)) {
					gate.connect(index, named.get(uid), int(parts[0]));
				}else{
					console.warn(`Unable to connect gate #${gate.getId()} with gate #${uid}, as that UID was not in the loaded array!`)
				}
			}));
		})

		return inserted;

	}

	// Warn: this method modifies global state
	static deserialize(obj, normalize = true) {
		
		zox = obj.x ?? 0;
		zoy = obj.y ?? 0;
		factor = Number(obj.z ?? 1);
		name = obj.n;

		Manager.deserializeArray(obj.j, normalize);

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
			console.error(err);
			return false;
		}
	}

	static print() {
		return JSON.stringify(Manager.serialize());
	}

	static save(id) {
		// we shouldn't be saving in online client mode,
		// nor when the data in `gates` is bogus
		if( mode != CLIENT && Manager.#valid ) {
			Save.set(id, Manager.serialize());
		}
	}

}


