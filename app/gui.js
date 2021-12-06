
// TODO: rewrite
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

		Event.Add.trigger({type: clazz.id, x: round(x - scx), y: round(y - scy)});
	}

	static init() {
		Gui.Toolbar.init();
		Gui.Picker.init();
		Gui.Settings.init();
	}
	
	static fileExport() {
		Filesystem.download(localStorage.getItem(identifier), identifier.substring("logix-sketch-".length) + ".lxs");
	}

	static share() {
		GUI.openPopup(
			"Sketch Sharing", 
			"Are you sure you want to share this sketch? Anyone with an access code will be able to modify and copy it!",
			{text: "Share", event: "Gui.shareBegin()"}, {text: "Cancel", event: "GUI.closePopup()"}
		);
	}

	static shareBegin() {
		Event.server = new RemoteServer("ws://0:9000", () => {Event.server.host()}, (id) => {
			GUI.openPopup(
				"Sketch Sharing", 
				`Sketch access code: <b>${id}</b>, share it so that others can join!`,
				{text: "Ok", event: "GUI.closePopup()"}
			);
		}, () => { GUI.openPopup("Network Error!", "Connection with server lost!", {text:"Ok", event:"GUI.openMenu()"}); });
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
			Event.Add.trigger({type: clazz.id, x: round(picker.dataset.x - scx), y: round(picker.dataset.y - scy)});
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

