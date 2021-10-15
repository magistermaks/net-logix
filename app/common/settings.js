
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

	static access(name) {
		Settings.#load();
		
		return {
			key: name,
			get: (value) => Settings.#get(name, value),
			set: (value) => Settings.#set(name, value)
		};
	}

	static reset() {
		localStorage.removeItem(Settings.#location);
		Settings.#data = {};
	}

	// list of settings
	static AUTOSAVE = Settings.access("save");
	static GRID = Settings.access("grid");
	static OVERLAY = Settings.access("overlay");
	static TRANSISTORS = Settings.access("transistors");
	static EXAMPLE = Settings.access("example");

}

