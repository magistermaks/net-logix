
class Gui {

	static pause;

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

	static Settings = class {

		static #entry(list, accessor, name) {
			const checked = Boolean(accessor.get() ?? false) ? "checked" : "";
			list.innerHTML += `<div data-id="${accessor.key}"><span style="cursor: auto">${name}</span><input type="checkbox" ${checked} onclick="Gui.Settings.update(this)"></div>`;
		}

		static #init() {
			const list = document.querySelector("#list");
			list.innerHTML = "";
		
			Gui.Settings.#entry(list, Settings.GRID, "Show background grid");
			Gui.Settings.#entry(list, Settings.OVERLAY, "Show debug overlay");
			Gui.Settings.#entry(list, Settings.AUTOSAVE, "Enable sketch autosave");
			Gui.Settings.#entry(list, Settings.TRANSISTORS, "Show estimated transistor count");
		}

		static update(elem) {
			Settings.access(elem.parentElement.dataset.id).set(elem.checked);
		}

		static open() {
			Gui.Settings.#init();
			document.querySelector("#settings").style.display = "block";
			Gui.pause = true;
		}

		static exit() {
			document.querySelector("#settings").style.display = "none";
			Gui.pause = false;
		}

	};

}

