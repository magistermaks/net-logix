
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

		Action.execute("add", {type: clazz.id, x: x - scx, y: y - scy});
	}

	static init() {
		Gui.Toolbar.init();
		Gui.Picker.init();
		Gui.Settings.init();
	}
	
	static fileExport() {
		Filesystem.download(localStorage.getItem(identifier), identifier.substring("logix-sketch-".length) + ".lxs");
	}

	static Toolbar = class {
		
		static init() {
			const list = document.querySelector("#toolbar-list");
			list.innerHTML = "";

			Registry.forEach((clazz) => {
				list.innerHTML += `<div class="tooltip"><img class="icon" src="./assets/${clazz.icon}.png" onclick="Gui.open(${clazz.name})"><span>${clazz.title}</span></div>&nbsp;`;
			});
		}

	}

	static Picker = class {

		static init() {
			const list = document.querySelector("#picker-list");
			list.innerHTML = "";

			Registry.forEach((clazz) => {
				list.innerHTML += `<div onclick="Gui.Picker.add(${clazz.name})">${clazz.title}<img src="./assets/${clazz.icon}.png"></div>`;
			});
		}

		static open() {
			picker.style.display = "";
			picker.style.left = mouseX + 4;
			picker.style.top = mouseY + 4;
			picker.dataset.x = Mouse.x;
			picker.dataset.y = Mouse.y;
		}

		static close() {
			picker.style.display = "none";
		}

		static add(clazz) {
			Action.execute("add", {type: clazz.id, x: int(picker.dataset.x) - scx, y: int(picker.dataset.y) - scy});
			Gui.Picker.close();
		}

		static isOpen() {
			return picker.style.display == "";
		}

	}

	static Settings = class {

		static #entry(list, accessor, name) {
			const checked = Boolean(accessor.get() ?? false) ? "checked" : "";
			list.innerHTML += `<div data-id="${accessor.key}"><span style="cursor: auto">${name}</span><input type="checkbox" ${checked} onclick="Gui.Settings.update(this)"></div>`;
		}

		static init() {
			const list = document.querySelector("#menu-list");
			list.innerHTML = "";
		
			Gui.Settings.#entry(list, Settings.GRID, "Show background grid");
			Gui.Settings.#entry(list, Settings.OVERLAY, "Show debug overlay");
			Gui.Settings.#entry(list, Settings.AUTOSAVE, "Enable sketch autosave");
			Gui.Settings.#entry(list, Settings.TRANSISTORS, "Show transistor count");
			Gui.Settings.#entry(list, Settings.SNAP, "Snap gates to grid");
			Gui.Settings.#entry(list, Settings.SMOOTH_WIRES, "Use smooth wires");
		}

		static update(elem) {
			Settings.access(elem.parentElement.dataset.id).set(elem.checked);
		}

		static open() {
			document.querySelector("#settings").style.display = "block";
			Gui.pause = true;
		}

		static exit() {
			document.querySelector("#settings").style.display = "none";
			Gui.pause = false;
		}

	};

}

