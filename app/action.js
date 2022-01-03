
class Action {

	static clipboard = null;

	static copy(wires, gate = null) {
		if(Selected.count() > 0 && (gate == null || gate.selected)) {
			const selected = Selected.get();

			let mx = Number.MAX_SAFE_INTEGER, my = Number.MAX_SAFE_INTEGER;

			selected.forEach(gate => {
				if(gate.x < mx) {mx = gate.x; my = gate.y;}
			})

			Action.clipboard = Manager.serializeArray(selected, wires, mx, my);
			GUI.notifications.push("Copied selection!");
		}else{
			if(gate != null) {
				Action.clipboard = Manager.serializeArray([gate], wires, gate.x, gate.y);
				GUI.notifications.push("Copied selection!");
			}
		}
	}

	static remove(gate = null) {
		if(gate == null || gate.selected) {
			Selected.get().forEach(gate => {
				Event.Rem.trigger({uid: gate.getId()});
			});
		}else{
			Event.Rem.trigger({uid: gate.getId()});
		}
	}

	static paste() {
		if(Action.clipboard != null) {
			Event.Merge.trigger( {a: Action.clipboard, u: mode == CLIENT ? Event.server.userid : null, x: Mouse.x - scx, y: Mouse.y - scy} );
		}else{
			GUI.notifications.push("Nothing to paste!");
		}
	}
	
	static fileExport() {
		Filesystem.download(localStorage.getItem(identifier), identifier.substring("logix-sketch-".length) + ".lxs");
	}

	static share() {
		if( mode != LOCAL ) {
			popup.open(
				"Sketch Sharing",
				`Sketch access code: <b>${group}</b>`,
				mode == HOST ? popup.button("Stop", () => {
					popup.open(
						"Sketch Sharing",
						"Are you sure you want to stop sharing this sketch? All users will be disconnected!",
						popup.button("Yes", () => {
							Event.server.close();
							Event.server = new LocalServer();
							mode = LOCAL;
							GUI.notifications.push("Ended sketch sharing!");
							popup.close();
						}),
						popup.button("No", () => popup.close())
					);
				}) : null,
				popup.button("Ok", () => popup.close())
			);
		}else{
			popup.open(
				"Sketch Sharing", 
				"Are you sure you want to share this sketch? Anyone with an access code will be able to modify and copy it!",
				popup.button("Share", () => {
					popup.close();
					ServerManager.remote(null);
				}),
				popup.button("Cancel", () => popup.close())
			);
		}
	}

}

