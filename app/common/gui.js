
class GUI {

	static #popup = false;

	static focused() {
		return GUI.#popup;
	}

	static openPopup(head, body, ...options) {
		let popup = document.getElementById("popup-body");

		let html = "";

		for( let option of options.reverse() ) {
			html += `<div onclick="${option.event}" class="button compact popup-button">${option.text}</div>`;
		}

		popup.children[0].innerHTML = head;
		popup.children[1].innerHTML = body;
		popup.children[2].innerHTML = html;

		document.getElementById("popup").style.display = "block";
		GUI.#popup = true;
	}

	static closePopup() {
		document.getElementById("popup").style.display = "none";
		GUI.#popup = false;
	}

	static openSketch(id) {
		window.location.href = "sketch.php#" + id;
	}

	static openMenu() {
		window.location.href = "index.php";
	}

}

