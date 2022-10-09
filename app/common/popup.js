
var popup = new class {

	#open = false;

	focused() {
		return this.#open;
	}

	open(head, message, ...options) {
		const body = document.getElementById("popup-body");

		body.children[0].innerHTML = head;
		body.children[1].innerHTML = message;
		body.children[2].innerHTML = "";

		for (let option of options.reverse()) {
			if (option == null) continue;

			const button = document.createElement("div");
			button.classList.add("button", "compact", "popup-button");
			button.innerText = option.text;
			button.addEventListener("click", option.event);

			body.children[2].appendChild(button);
		}

		document.getElementById("popup").style.display = "block";
		this.#open = true;
	}

	close() {
		document.getElementById("popup").style.display = "none";
		this.#open = false;
	}

	button(text, event) {
		return {text: text, event: event};
	}

}

