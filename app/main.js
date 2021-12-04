
var scx = 0, scy = 0, scw = 0, sch = 0;
var tick = 1;

var identifier;
var picker;
var fps = 0, ms = 0;

var dbg_show_updates = false;

/// inititialize app
function setup() {
	const start = Date.now();
	picker = document.getElementById("picker");

	// prepare canvas
	canvasOpen();

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
		alert("Failed to load selected sketch, the data is corrupted!");
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

	// update all gates in a sketch
	UpdateQueue.init();
	MoveQueue.init();

	// invoke dark magic
	zoomInit();

	// init networking and event system
	Event.init();

	console.log(`System ready! Took: ${Date.now() - start}ms`);
}

/// main render loop
function draw() {
	Mouse.update();

	const t = Date.now();
	sch = height / factor;
	scw = width / factor;
	
	matrix(() => {

		scale(factor);
		background(200);

		if( Settings.GRID.get() ) grid(180, scx, scy, factor);

		// update ticking components
		Scheduler.tick();
		UpdateQueue.execute();

		// render sketch
		gates.forEach(gate => gate.draw());
		gates.forEach(gate => gate.drawWires());
		if(dbg_show_updates) gates.forEach(gate => gate.showUpdates());

		WireEditor.draw();
		Selected.draw();

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

/// draw debug overlay
function overlay(t) {
	let overlay = name;

	if( Settings.TRANSISTORS.get() ) {
		const count = gates.length == 0 ? 0 : gates.map(gate => gate.getComplexity()).reduce((a, b) => a + b);
		overlay += " (~" + count + " transistors)";
	}

	if( Settings.OVERLAY.get() ) {
		if( frameCount % 5 == 0 ) {
			ms = t;
			fps = round(getFrameRate());
		}

		overlay += 
			"\nFPS: " + fps + " (" + ms + "ms) q: " + UpdateQueue.size() + 
			"\nx: " + scx.toFixed(0) + " y: " + scy.toFixed(0) + " (" + factor.toFixed(2) + "x)";
	}

	const selected = Selected.count();

	if(selected > 0) {
		overlay += "\nSelected: " + selected;
	}

	fill(100);
	noStroke();
	text(overlay, 10, 10);
}

