
class Manager {

	static #empty = null;

	static init() {
		Manager.print();

		if( !Settings.EXAMPLE.get(false) ) {

			fetch("data/example.json")
				.then(response => response.text())
				.then(response => {
					Settings.EXAMPLE.set(true);
					console.log("Downloaded example sketch");

					Manager.#set("example", response);
				} );
		}

		fetch("data/default.json")
			.then(response => response.text())
			.then(response => {
				console.log("Downloaded empty sketch");
				Manager.#empty = response;
			} );
	}

	static #entry(list, key) {
		const name = Manager.getName(key);
		list.innerHTML += `<div data-id="${key}"><span onclick="redirect(this)">${name}</span><img onclick="remove(this)" src="assets/purge.png"></div>`;
	}

	static print() {
		const list = document.querySelector("#list");
		list.innerHTML = "";

		var keys = [];

		for( var i = 0; i < localStorage.length; i ++ ) {
			const key = localStorage.key(i);

			if( key.startsWith("logix-sketch") ) {
				keys.push(key);
			}
		}

		keys.sort();
		
		for( var key of keys ) {
			Manager.#entry(list, key);
		}

		console.log(`Shown ${keys.length} sketches`);
	}

	static #set(id, json) {
		localStorage.setItem("logix-sketch-" + id, json);
		Manager.print();
	}

	static getName(key) {
		try{
			return Save.get(key).name;
		}catch(err) {
			return key;
		}
	}

	static add(name) {
		if( Manager.#empty == null ) {
			alert("Template not ready! Try again in a second!");
			return;
		}

		var id = name.toLowerCase().replace(/\W+/g, "-");

		while( localStorage.getItem("logix-sketch-" + id) != null ) {
			id += "-";
		}

		var json = Manager.#empty.replace("$NAME", name);
		Manager.#set(id, json);
	}

	static remove(name) {
		localStorage.removeItem(name);
		Manager.print();
	}

}
