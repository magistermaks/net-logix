
class Pointers {

	static #interval = 100;
	static #map = new Map();

	static update(user, x, y) {
		if (Pointers.#map.size < 512) {
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

		setInterval(() => {
			if(mode != LOCAL && Event.server.userid != null) {
				const mx = round(Mouse.x - scx);
				const my = round(Mouse.y - scy);

				if (mx != lx && my != ly) {
					Event.Mouse.trigger({u: Event.server.userid, x: mx, y: my});

					lx = mx;
					ly = my;
				}
			}
		}, Pointers.#interval);
	}

	static draw() {
		if (mode != LOCAL && Settings.SHOW_POINTERS.get()) {
			const now = Date.now();

			Pointers.#map.forEach(update => {
				let f = (now - update.t) / Pointers.#interval;
				if (f > 1) f = 1;

				let x = scx + update.px + (update.x - update.px) * f;
				let y = scy + update.py + (update.y - update.py) * f;

				// make the mouse always show on screen
				x = max(1, min(x, scw - 1));
				y = max(1, min(y, sch - 1));

				let fg = 10 / factor;

				stroke(0);
				strokeWeight(fg/5);
				line(x - fg, y, x + fg, y);
				line(x, y - fg, x, y + fg);
			});
		}
	}

}

