
class Resource {

	static #cache = new Map();
	static blur = null;

	static get(name) {
		if (Resource.#cache.has(name)) {

			return Resource.#cache.get(name);

		} else {

			const img = loadImage("assets/icons/" + name + ".png");

			Resource.#cache.set(name, img);

			return img;
		}
	}

}

