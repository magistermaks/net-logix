
function create() {
	const name = prompt( "Enter sketch name or click cancel" );

	if( name != null ) {
		Manager.add(name);
	}
}

function redirect(key) {
	window.location.href = "sketch.php#" + key
}

function remove(key) {
	if( confirm(`Are you sure you want to delete sketch '${key}'?`) ) {
		Manager.remove(key);
	}
}

window.onload = function() { 
	Manager.init();
};

