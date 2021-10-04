
class Gui {

	static #x = 0;
	static #y = 0;

	static purge() {
		if( confirm("Are you sure you want to clear this sketch?") ) {
			Manager.reset();
		}
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

