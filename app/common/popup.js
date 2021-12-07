
var popup = new class {

	#open = false;

	focused() {
		return this.#open;
	}

	open(head, message, ...options) {
		let body = document.getElementById("popup-body");
		let html = "";

		for( let option of options.reverse() ) {
			html += `<div onclick="${option.event}" class="button compact popup-button">${option.text}</div>`;
		}

		body.children[0].innerHTML = head;
		body.children[1].innerHTML = message;
		body.children[2].innerHTML = html;

		document.getElementById("popup").style.display = "block";
		this.#open = true;
	}

	close() {
		document.getElementById("popup").style.display = "none";
		this.#open = false;
	}

}

