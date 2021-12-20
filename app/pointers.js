
class Pointers {

	static #interval = 100;
	static #map = new Map();

	static update(user, x, y) {	
		if( Pointers.#map.size < 512 ) {
			const old = Pointers.#map.get(user);

			Pointers.#map.set(user, {
				px: old?.x ?? x, 
				py: old?.y ?? y, 
				x: x, y: y, t: Date.now()
			});
		}
	}

	static remove(user) {
		Pointers.#map.delete(user);
	}

	static init() {
		var lx = 0;
		var ly = 0;

		setInterval( () => {
			if(mode != LOCAL && Event.server.userid != null) {
				if( Mouse.x != lx && Mouse.y != ly ) {
					Event.Mouse.trigger({u: Event.server.userid, x: round(Mouse.x - scx), y: round(Mouse.y - scy)});

					lx = Mouse.x;
					ly = Mouse.y;
				}
			}
		}, Pointers.#interval );
	}

	static draw() {
		if(mode != LOCAL && Settings.SHOW_POINTERS.get()) {
			const now = Date.now();

			Pointers.#map.forEach(update => {
				let f = (now - update.t) / Pointers.#interval;
				if( f > 1 ) f = 1;

				let x = scx + update.px + (update.x - update.px) * f;
				let y = scy + update.py + (update.y - update.py) * f;

				// make the mouse always show on screen
				x = max(1, min(x, scw - 1));
				y = max(1, min(y, sch - 1));

				line(x - 10, y, x + 10, y);
				line(x, y - 10, x, y + 10);
			});
		}
	}

}

