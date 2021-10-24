
class Resource {

	static #cache = new Map();

	static get(name) {
		if( Resource.#cache.has(name) ) {

			return Resource.#cache.get(name);

		}else{

			let img = loadImage("assets/" + name + ".png");

			Resource.#cache.set(name, img);

			return img;
		}
	}

}

