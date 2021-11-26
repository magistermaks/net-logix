
class Selected {

	static #gates = [];
	static #x;
	static #y;
	static #area = false;
	
	static get() {
		return Selected.#gates.slice();
	}

	static count() {
		return Selected.#gates.length;
	}

	static add(gate) {
		if( !gate.selected ) {
			gate.selected = true;

			if( !Selected.#gates.includes(gate) ) {
				Selected.#gates.push(gate);
			}
		}
	}

	static remove(gate) {
		if( gate.selected ) {
			gate.selected = false;

			if( Selected.#gates.includes(gate) ) {
				Selected.#gates.splice(Selected.#gates.indexOf(gate), 1);
			}
		}
	}

	static toggle(gate) {
		if( !gate.selected ) {
			Selected.add(gate);
		}else{
			Selected.remove(gate);
		}
	}

	static addAll() {
		gates.forEach(gate => Selected.add(gate));
	}

	static removeAll() {
		Selected.#gates.forEach(gate => gate.selected = false);
		Selected.#gates = [];
	}

	static draw() {
		if( Selected.#area ) {
			fill(33, 150, 243, 100);
			stroke(33, 150, 243, 255);
			rect(Selected.#x, Selected.#y, Mouse.x - Selected.#x, Mouse.y - Selected.#y);
		}
	}

	static dragBegin(x, y) {
		if( !Selected.#area ) {
			Selected.#x = x;
			Selected.#y = y;
		}
		Selected.#area = true;
	}

	static dragEnd() {
		if( Selected.#area ) {
			const minx = min(Selected.#x, Mouse.x);
			const miny = min(Selected.#y, Mouse.y);
			const maxx = max(Selected.#x, Mouse.x);
			const maxy = max(Selected.#y, Mouse.y);

			gates.forEach(gate => {
				const x = gate.x + scx;
				const y = gate.y + scy;

				if( x > minx && y > miny && x < maxx && y < maxy ) {
					Selected.add(gate);
				}
			});
		}

		Selected.#area = false;
	}

}


