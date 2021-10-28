
var scx = 0, scy = 0;
var tick = 1;

var identifier;
var main, picker;
var fps = 0, ms = 0;

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

	// inititialize UI
	Gui.init();
}

/// main render loop
function draw() {
	Mouse.update();

	let t = Date.now();
	
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
	overlay(Date.now() - t);
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
	const separation = spacing * 4;

	const sepx = scx % separation;
	const sepy = scy % separation;
	
	stroke(c);
	strokeWeight(1);
	for( var i = scx % spacing; i < main.offsetWidth / factor; i += spacing ) {
		stroke( (i - sepx) % separation == 0 ? c - 15 : c );
		line(i, 0, i, main.offsetHeight / factor);
	}

	stroke(c);
	for( var i = scy % spacing; i < main.offsetHeight / factor; i += spacing ) {
		stroke( (i - sepy) % separation == 0 ? c - 15 : c );
		line(0, i, main.offsetWidth / factor, i);
	}

}

/// draw debug overlay
function overlay(t) {
	let overlay = name;

	if( Settings.TRANSISTORS.get() ) {
		const count = gates.map(gate => gate.getComplexity()).reduce((a, b) => a + b);
		overlay += " (~" + count + " transistors)";
	}

	if( Settings.OVERLAY.get() ) {
		if( frameCount % 5 == 0 ) {
			ms = t;
			fps = round(getFrameRate());
		}

		overlay += 
			"\nFPS: " + fps + " (" + ms + "ms)" + 
			"\nx: " + scx.toFixed(0) + " y: " + scy.toFixed(0) +
			"\n" + factor.toFixed(2) + "x";
	}

	fill(100);
	noStroke();
	text(overlay, 10, 10);
}

