
function create() {
	popup.open(
		"Create New Sketch", 
		"Enter sketch name or click cancel: <input id='name'>",
		popup.button("Create", () => {
			let name = document.getElementById("name").value;

			if( name != null && name.length > 0 ) {
				Manager.add(name);
			}

			popup.close();
		}), 
		popup.button("Cancel", () => popup.close())
	);
}

function fileImport() {
	Filesystem.upload((content, name) => {
		Manager.insert(name.split('.')[0], content);
	});
}

function joinShared() {
	popup.open(
		"Join Shared Sketch", 
		"To join a shared sketch please provide the access code: <input id='group' maxlength='5' size='5'>",
		popup.button("Join", openShared), popup.button("Cancel", () => popup.close())
	)
}

function openShared() {
	window.location.href = "sketch.php#" + document.getElementById("group").value;
}

function redirect(element) {
	window.location.href = "sketch.php#" + element.parentElement.dataset.id;
}

function removeSketch(element) {
	const key = element.parentElement.dataset.id;
	const name = Manager.getName(key);

	popup.open(
		"Delete Sketch?", 
		`Are you sure you want to delete sketch '${name}'?`,
		popup.button("Delete", () => { Manager.remove(key); popup.close(); }), popup.button("Cancel", () => popup.close())
	);
}

window.onload = function() { 
	Manager.init();
};

function setup() {
	canvasOpen();
	noLoop();
}

function draw() {
	background(200);
	grid(180, 0, 0, 1);
}

