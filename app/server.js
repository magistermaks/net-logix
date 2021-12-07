
class LocalServer {

	constructor() {
	}

	event(object, handle) {
		handle.event(object.args);
	}

	ready() {
		return true;
	}

}

