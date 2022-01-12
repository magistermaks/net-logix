
class GUI {

	static focused() {
		return popup.focused() || GUI.picker.focused() || GUI.settings.focused();
	}

	static picker = new class {

		#container = null;
		#body = null;
		#open = false;

		components = [];

		focused() {
			return this.#open;
		}

		#make(event, text, link) {
			const div = document.createElement('div');
			div.addEventListener("click", () => {event(); GUI.picker.close()} ); 

			const img = document.createElement('img');
			img.src = link;

			const txt = document.createTextNode(text);

			div.appendChild(txt);
			div.appendChild(img);

			return div;
		}

		init() {
			this.#container = document.getElementById("picker");
			this.#body = document.getElementById("picker-list");

			// cache the commonly used html
			Registry.forEach((clazz) => {
				this.components.push(this.#make(() => GUI.picker.add(clazz), clazz.title, `assets/icons/${clazz.icon}.png`));
			});

			main.oncontextmenu = () => {
				for( let i = gates.length - 1; i >= 0; i -- ) {
					if( gates[i].canClick(Mouse.x, Mouse.y) && (gates[i].canGrab(Mouse.x, Mouse.y) || (keyCode == SHIFT && keyIsPressed)) ) {
						this.openForContext(gates[i]);
						return false;
					}
				}

				this.openForContext(null);
				return false;
			};
		}

		openForContext(gate) {
			let html = [];

			if(gate != null) {
				html.push(this.#make(() => Action.copy(true, gate), "Copy", "assets/icons/copy.png"));
				html.push(this.#make(() => Action.copy(false, gate), "Copy Layout", "assets/icons/copy.png"));
				html.push(this.#make(() => Action.remove(gate), "Delete", "assets/icons/purge.png"));

				this.open("Action", html);
			}else{
				html.push(this.#make(() => Action.paste(), "Paste", "assets/icons/copy.png"));
				html.push(...this.components)

				this.open("Add Component...", html);
			}
		}

		open(title, html) {
			this.#container.style.display = "block";
			this.#container.style.left = mouseX + 4;
			this.#container.style.top = mouseY + 4;
			this.#container.dataset.x = Mouse.x;
			this.#container.dataset.y = Mouse.y;
			this.#body.innerHTML = "";
			this.#open = true;
			document.getElementById("picker-top").innerText = title;
			html.forEach(dom => this.#body.appendChild(dom));
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
				html += `<div class="tooltip"><img class="icon" src="assets/icons/${clazz.icon}.png" onclick="GUI.toolbar.add(${clazz.name})"><span>${clazz.title}</span></div>&nbsp;`;
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
		#buttons = null;
		#title = null;
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
			this.#buttons = document.getElementById("menu-buttons");
			this.#title = document.getElementById("menu-title");
		}

		open() {
			this.#title.innerText = "Settings";
			this.#buttons.innerHTML = "<div class=\"button\" onclick=\"GUI.settings.close()\">Close</div> <div class=\"button\" onclick=\"GUI.settings.help()\">Help</div>";
			this.#body.innerHTML = "";
		
			this.#entry(this.#body, Settings.GRID, "Show background grid");
			this.#entry(this.#body, Settings.OVERLAY, "Show debug overlay");
			this.#entry(this.#body, Settings.AUTOSAVE, "Enable sketch autosave");
			this.#entry(this.#body, Settings.TRANSISTORS, "Show transistor count");
			this.#entry(this.#body, Settings.SNAP, "Snap gates to grid");
			this.#entry(this.#body, Settings.SMOOTH_WIRES, "Use smooth wires");
			this.#entry(this.#body, Settings.SHOW_POINTERS, "Show cursors when sharing");

			this.#container.style.display = "block";
			this.#open = true;
		}

		help() {
			this.#title.innerText = "Quick Guide";
			this.#buttons.innerHTML = "<div class=\"button\" onclick=\"GUI.settings.close()\">Close</div>";
			this.#body.innerHTML = "<center style=\"padding: 1em;\" id=\"help-loading\">Loading...</center><iframe onload=\"document.getElementById('help-loading').remove()\" src=\"help.html\"></iframe>";

			this.#container.style.display = "block";
			this.#open = true;
		}

		update(elem) {
			Settings.access(elem.parentElement.dataset.id).set(elem.checked);
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

	static exit(save = true) {
		if(save) {
			Manager.save(identifier);
			Event.server.close();
		}
		window.location.href = "index.php"
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


