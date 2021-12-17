
var access_code = null;

// TODO: THIS NEADS TO DIE, ASAP
class Gui {

	static exit() {
		Manager.save(identifier);
		window.location.href = "index.php"
	}
	
	static fileExport() {
		Filesystem.download(localStorage.getItem(identifier), identifier.substring("logix-sketch-".length) + ".lxs");
	}

	static share() {
		if( online ) {
			popup.open(
				"Sketch Sharing",
				"Sketch access code: <b>" + access_code + "</b>",
				{text: "Ok", event: "popup.close()"}
			);
		}else{
			popup.open(
				"Sketch Sharing", 
				"Are you sure you want to share this sketch? Anyone with an access code will be able to modify and copy it!",
				{text: "Share", event: "popup.close();Gui.shareBegin();"}, {text: "Cancel", event: "popup.close()"}
			);
		}
	}

	static shareBegin() {
		setTimeout(() => {
			Event.server = new RemoteServer(cfg_server, () => {Event.server.host(); online = true;}, (id) => {
				popup.open(
					"Sketch Sharing", 
					`Sketch access code: <b>${id}</b>, share it so that others can join!`,
					{text: "Ok", event: "popup.close()"}
				);
				access_code = id;
			}, () => { popup.open("Network Error!", "Connection with server lost!", {text:"Ok", event:"GUI.openMenu()"}); });
		}, 500);
	}

}

class GUI {

	static focused() {
		return popup.focused() || GUI.picker.focused() || GUI.settings.focused();
	}

	static picker = new class {

		#container = null;
		#body = null;
		#open = false;

		focused() {
			return this.#open;
		}

		init() {
			this.#container = document.getElementById("picker");
			this.#body = document.getElementById("picker-list");

			let html = "";

			Registry.forEach((clazz) => {
				html += `<div onclick="GUI.picker.add(${clazz.name})">${clazz.title}<img src="./assets/${clazz.icon}.png"></div>`;
			});

			this.#body.innerHTML = html;
		}

		open() {
			this.#container.style.display = "block";
			this.#container.style.left = mouseX + 4;
			this.#container.style.top = mouseY + 4;
			this.#container.dataset.x = Mouse.x;
			this.#container.dataset.y = Mouse.y;
			this.#open = true;
		}

		close() {
			this.#container.style.display = "none";
			this.#open = false;
		}

		shouldClose(event) {
			return event?.target?.parentElement?.parentElement != this.#container;
		}

		add(clazz) {
			Event.Add.trigger({type: clazz.id, x: round(picker.dataset.x - scx), y: round(picker.dataset.y - scy)});
			GUI.picker.close();
		}

		getCancelButton(text = "Cancel") {
			return {text: text, event: "popup.close()"};
		}

	}

	static toolbar = new class {

		#container = null;
		#body = null;
		#open = true;

		#x = 0;
		#y = 0;

		focused() {
			return this.#open;
		}

		init() {
			this.#container = document.getElementById("toolbar");
			this.#body = document.getElementById("toolbar-list");
			
			let html = "";

			Registry.forEach((clazz) => {
				html += `<div class="tooltip"><img class="icon" src="./assets/${clazz.icon}.png" onclick="GUI.toolbar.add(${clazz.name})"><span>${clazz.title}</span></div>&nbsp;`;
			});

			this.#body.innerHTML = html;
		}

		open() {
			this.#container.style.display = "block";
			this.#open = true;
		}

		close() {
			this.#container.style.display = "none";
			this.#open = false;
		}

		add(clazz) {
			const step = 20;

			this.#x += step;
			this.#y += step;
	
			if( this.#x + Box.w + step > main.offsetWidth || this.#y + Box.h + step > main.offsetHeight ) {
				this.#x = step;
				this.#y = step;
			}

			Event.Add.trigger({type: clazz.id, x: round(this.#x - scx), y: round(this.#y - scy)});
		}

		reset() {
			this.#x = 0;
			this.#y = 0;
		}

	}

	static settings = new class {

		#container = null;
		#body = null;
		#open = false;

		focused() {
			return this.#open;
		}

		#entry(list, accessor, name) {
			const checked = Boolean(accessor.get() ?? false) ? "checked" : "";
			list.innerHTML += `<div data-id="${accessor.key}"><span style="cursor: auto">${name}</span><input type="checkbox" ${checked} onclick="GUI.settings.update(this)"></div>`;
		}

		init() {
			this.#container = document.getElementById("settings");
			this.#body = document.getElementById("menu-list");

			const list = this.#body;
			list.innerHTML = "";
		
			this.#entry(list, Settings.GRID, "Show background grid");
			this.#entry(list, Settings.OVERLAY, "Show debug overlay");
			this.#entry(list, Settings.AUTOSAVE, "Enable sketch autosave");
			this.#entry(list, Settings.TRANSISTORS, "Show transistor count");
			this.#entry(list, Settings.SNAP, "Snap gates to grid");
			this.#entry(list, Settings.SMOOTH_WIRES, "Use smooth wires");
		}

		update(elem) {
			Settings.access(elem.parentElement.dataset.id).set(elem.checked);
		}

		open() {
			this.#container.style.display = "block";
			this.#open = true;
		}

		close() {
			this.#container.style.display = "none";
			this.#open = false;
		}

	};

	static notifications = new class {
		
		#body = null;

		focused() {
			return true;
		}

		init() {
			this.#body = document.getElementById("notifications");
		}

		push(message) {
			var box = document.createElement("div");
			box.innerText = message;

			this.#body.appendChild(box);

			setTimeout(() => {
				box.style.opacity = 0;

				setTimeout(() => {
					box.remove();
				}, 1000);
			}, 2000);
		}

	};

	static openSketch(id) {
		window.location.href = "sketch.php#" + id;
	}

	static openMenu() {
		window.location.href = "index.php";
	}

	static init() {
		GUI.picker.init();
		GUI.toolbar.init();
		GUI.settings.init();
		GUI.notifications.init();
	}

	static moved() {
		GUI.toolbar.reset();
	}

}


