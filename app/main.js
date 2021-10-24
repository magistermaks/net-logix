
var scx = 0, scy = 0;
var tick = 1;

var identifier;
var main, picker;

/// inititialize app
function setup() {
	main = document.querySelector("main");
	picker = document.getElementById("picker");

	createCanvas(main.offsetWidth, main.offsetHeight);

	// keep the size of the canvas in check
	window.onresize = () => {
		resizeCanvas(main.offsetWidth, main.offsetHeight);
	};

	// open component picker
	main.oncontextmenu = () => {
		Gui.Picker.open();
		return false;
	};

	// notify user if app crashes
	window.onerror = () => {
		alert("Application error occured!");
	};

	// set some processing stuff
	textAlign(LEFT, TOP);
	textSize(15);
	imageMode(CENTER);

	// setup gate registry
	Registry.init();

	// load sketch
	identifier = window.location.hash.slice(1);
	if( !Manager.load(identifier) ) {
		alert("Failed to load selected sketch!");
		history.back();
	}

	// set default value immediately
	Settings.AUTOSAVE.get();

	// start autosave task (every 5s)
	setInterval( () => {
		if( Settings.AUTOSAVE.get() ) {
			Manager.save(identifier);
		}
	}, 5000 );

	// fix screen offset if it was corrupted
	if( scx == null ) scx = 0;
	if( scy == null ) scy = 0;
}

/// main render loop
function draw() {
	Mouse.update();
	
	matrix(() => {

		scale(factor);
		background(200);

		if( Settings.GRID.get() ) grid(180);

		// render sketch
		gates.forEach(gate => gate.draw());
		gates.forEach(gate => gate.drawWires());
		WireEditor.draw();

	});

	tick ++;
	overlay();
}

/// matrix stack helper
function matrix( callback ) {
	push();
	callback();
	pop();
}

/// draw background grid
function grid(c) {
	
	const spacing = 50;
	
	stroke(c);
	strokeWeight(1);
	for( var i = scx % spacing; i < main.offsetWidth / factor; i += spacing ) {
		line(i, 0, i, main.offsetHeight / factor);
	}

	for( var i = scy % spacing; i < main.offsetHeight / factor; i += spacing ) {
		line(0, i, main.offsetWidth / factor, i);
	}

}

/// draw debug overlay
function overlay() {
	let overlay = name;

	if( Settings.TRANSISTORS.get() ) {
		const count = gates.map(gate => gate.getComplexity()).reduce((a, b) => a + b);
		overlay += " (~" + count + " transistors)";
	}

	if( Settings.OVERLAY.get() ) {
		overlay += 
			"\nFPS: " + round(getFrameRate()) +
			"\nx: " + scx.toFixed(0) + " y: " + scy.toFixed(0) +
			"\n" + factor.toFixed(2) + "x";
	}

	fill(100);
	noStroke();
	text(overlay, 10, 10);
}

