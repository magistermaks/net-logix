
name = "";

class Manager {

	static #valid = false;

	static serializeArray(array) {
		
		return array.map(gate => {
	
			const obj = {
				"t": gate.constructor.id,
				"x": round(gate.x),
				"y": round(gate.y),
				"i": gate.getId(),
				"w": gate.outputs.map(output => output.targets.map(target => `${target.index}:${target.gate.getId()}`))
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
	static deserializeArray(array, normalize = true) {	

		const named = new Map();

		// load all gates into logix and index them by id for later use
		const inserted = array.map(obj => {
			const gate = Gate.create(obj.t, obj.x, obj.y, normalize ? -1 : obj.i, obj.m)
			named.set(obj.i, gate);
			return gate;
		}); 

		// load wire configuration
		inserted.forEach((gate, key) => {
			array[key].w.forEach((output, index) => output.forEach(point => {
				const parts = point.split(":");
				gate.connect(index, named.get(int(parts[1])), int(parts[0]));
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


