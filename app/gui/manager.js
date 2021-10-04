
class Manager {

	static #empty = null;

	static init() {
		Manager.print();

		if( localStorage.getItem("example-logix") != "true" ) {

			fetch("data/example.json")
				.then(response => response.text())
				.then(response => {
					localStorage.setItem("example-logix", "true")
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
		list.innerHTML += `<div><span onclick="redirect('${key}')" title="${key}">${name}</span><img onclick="remove('${key}')" src="assets/purge.png"></div>`;
	}

	static print() {
		const list = document.querySelector("#list");
		list.innerHTML = "";

		var count = 0;

		for( var i = 0; i < localStorage.length; i ++ ) {
			const key = localStorage.key(i);

			if( key.startsWith("logix-sketch") ) {
				Manager.#entry(list, key);
				count ++;
			}
		}

		console.log(`Shown ${count} sketches`);
	}

	static #set(id, json) {
		localStorage.setItem("logix-sketch-" + id, json);
		Manager.print();
	}

	static getName(key) {
		try{
			return JSON.parse( localStorage.getItem(key) ).name;
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

		while( localStorage.getItem(id) != null ) {
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
