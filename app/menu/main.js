
function create() {
	const name = prompt( "Enter sketch name or click cancel" );

	if( name != null ) {
		Manager.add(name);
	}
}

function load_file() {
	Filesystem.upload((content, name) => {
		Manager.insert(name, content);
	});
}

function redirect(element) {
	window.location.href = "sketch.php#" + element.parentElement.dataset.id;
}

function remove(element) {
	const key = element.parentElement.dataset.id;
	const name = Manager.getName(key);

	if( confirm(`Are you sure you want to delete sketch '${name}'?`) ) {
		Manager.remove(key);
	}
}

window.onload = function() { 
	Manager.init();
};

