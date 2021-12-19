
var scx = 0, scy = 0, scw = 0, sch = 0, zox = 0, zoy = 0;
var tick = 0, fps = 0, ms = 0;

const LOCAL = Symbol('local'); // running in non-online mode
const HOST = Symbol('host'); // running online as host
const CLIENT = Symbol('client'); // running online as client
var mode = LOCAL;

// sketch id and group (online mode only)
var identifier;
var group;

// debug options
var dbg_show_updates = false;
var dbg_show_events = false;
var dbg_show_traffic = false;

/// inititialize app
function setup() {
	const start = Date.now();

	// prepare canvas
	canvasOpen(() => screenOffsetUpdate());

	// notify user if app crashes
	window.onerror = () => {
		alert("Application error occured!");
	};

	// setup some processing stuff
	textAlign(LEFT, TOP);
	textSize(15);
	imageMode(CENTER);

	// setup gate registry
	Registry.init();

	// load sketch
	identifier = window.location.hash.slice(1);
	if( identifier.startsWith("logix-sketch") ) {

		// try loading the sketch
		if( !Manager.load(identifier) ) {
			alert("Failed to load selected sketch, the data is corrupted!");
			GUI.exit();
		}

		// start autosave task (every 5s)
		setInterval( () => {
			if( Settings.AUTOSAVE.get() ) {
				Manager.save(identifier);
			}
		}, 5000 );

		mode = LOCAL;

	}else{
		
		group = Number.parseInt(identifier);

		if( isNaN(group) ) {
			alert("The given access code is invalid!");
			GUI.exit();
		}

		ServerManager.remote(group);

	}

	// inititialize UI
	GUI.init();

	// start watching for dragged gates
	MoveQueue.init();

	// invoke dark magic
	screenOffsetUpdate();

	// manage and render mouse pointers
	Pointers.init();

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
		MoveQueue.interpolate();

		// render sketch
		gates.forEach(gate => gate.draw());
		gates.forEach(gate => gate.drawWires());
		if(dbg_show_updates) gates.forEach(gate => gate.showUpdates());

		WireEditor.draw();
		Selected.draw();
		Pointers.draw();

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

