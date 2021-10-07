
class Gui {

	static #x = 0;
	static #y = 0;

	static exit() {
		Manager.save(identifier);
		window.location.href = "index.php"
	}

	static reset() {
		Gui.#x = 0;
		Gui.#y = 0;
	}

	static open(clazz) {
		const step = 20;

		Gui.#x += step;
		Gui.#y += step;

		let x = Gui.#x;
		let y = Gui.#y;

		if( x + Box.w + step > main.offsetWidth || y + Box.h + step > main.offsetHeight ) {
			Gui.#x = 0;
			Gui.#y = 0;

			x = step;
			y = step;
		}

		new (clazz)(x - scx, y - scy);
	}

}

