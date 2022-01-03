
class Settings {

	static #location = "logix-settings";
	static #data = null;

	static #load() {
		if( Settings.#data == null ) {
			Settings.#data = JSON.parse(localStorage.getItem(Settings.#location)) ?? {};
		}
	}

	static #get(name, value) {
		return Settings.#data[name] ?? Settings.#set(name, value);
	}

	static #set(name, value) {
		Settings.#data[name] = value;
		localStorage.setItem(Settings.#location, JSON.stringify(Settings.#data));
		return value;
	}

	static access(name, value) {
		Settings.#load();
		
		return {
			key: name,
			get: () => Settings.#get(name, value),
			set: (value) => Settings.#set(name, value)
		};
	}

	static reset() {
		localStorage.removeItem(Settings.#location);
		Settings.#data = {};
	}

	// list of settings and their defaults
	static AUTOSAVE = Settings.access("save", true);
	static GRID = Settings.access("grid", true);
	static OVERLAY = Settings.access("overlay", false);
	static TRANSISTORS = Settings.access("transistors", false);
	static EXAMPLE = Settings.access("example", false);
	static SNAP = Settings.access("snap", false);
	static SMOOTH_WIRES = Settings.access("swire", false);
	static SHOW_POINTERS = Settings.access("pointrs", true);
	static SEEN_GUIDE = Settings.access("guide", false);

}

