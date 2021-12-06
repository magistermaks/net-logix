
class Manager {

	static #empty = null;

	static init() {
		Manager.print();

		if( !Settings.EXAMPLE.get(false) ) {

			fetch("data/example.json")
				.then(response => response.text())
				.then(response => {
					Settings.EXAMPLE.set(true);
					console.log("Downloaded example sketch template");

					Manager.#set("example", response);
				} );
		}

		fetch("data/default.json")
			.then(response => response.text())
			.then(response => {
				console.log("Downloaded empty sketch template");
				Manager.#empty = response;
			} );
	}

	static #entry(list, key) {
		const name = Manager.getName(key);
		const time = Manager.getDate(key);
		list.innerHTML += `<div title="${time}" data-id="${key}"><span onclick="redirect(this)">${name}</span><img title="Delete this sketch" onclick="removeSketch(this)" src="assets/purge.png"></div>`;
	}

	static print() {
		let start = Date.now();

		const list = document.querySelector("#menu-list");
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

		console.log(`Reloaded ${keys.length} sketch(es) in ${Date.now() - start}ms`);
	}

	static #set(id, json) {
		localStorage.setItem("logix-sketch-" + id, json);
		Manager.print();
	}

	static getName(key) {
		try{
			return Save.get(key).n;
		}catch(err) {
			return key;
		}
	}

	static getDate(key) {
		try{
			let timestamp = Save.get(key).u;

			if( timestamp != null ) {
				const d = new Date( Save.get(key).u );
				return "Last edited on: " + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
			}
		}catch(err) {
			return "";
		}

		return "";
	}

	static add(name) {
		if( Manager.#empty == null ) {
			alert("Template not ready! Try again in a second!");
			return;
		}

		let json = Manager.#empty.replace("$NAME", name);

		Manager.insert(name, json);
	}

	static insert(name, json) {
		let id = name.toLowerCase().replace(/\W+/g, "-");

		while( localStorage.getItem("logix-sketch-" + id) != null ) {
			id += "-";
		}

		Manager.#set(id, json);
	}

	static remove(name) {
		localStorage.removeItem(name);
		Manager.print();
	}

}
