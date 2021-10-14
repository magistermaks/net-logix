
var factor = 1;

var scx = 0, scy = 0;
var tick = 1;
var dragged = null;

var main;
var last;

class Mouse {
	static x = 0;
	static y = 0;
	static px = 0;
	static py = 0;

	static update() {
		Mouse.px = Mouse.x;
		Mouse.py = Mouse.y;
		Mouse.x = mouseX / factor;
		Mouse.y = mouseY / factor;
	}
}

function setup() {
	main = document.querySelector("main");	

	createCanvas(main.offsetWidth, main.offsetHeight);

	// keep the size of the canvas in check
	window.onresize = function() { 
		resizeCanvas(main.offsetWidth, main.offsetHeight);
	};

	// set some stuff
	textAlign(LEFT, TOP);
	textSize(15);
	imageMode(CENTER);

	// load save
	const identifier = window.location.hash.slice(1);
	if( !Manager.load(identifier) ) {
		alert("Failed to load selected sketch!");
		history.back();
	}

	// auto save (every 5s)
	setInterval( function() {
		Manager.save(identifier);
	}, 5000 );

	if( scx == null ) {
		scx = 0;
	}

	if( scy == null ) {
		scy = 0;
	}
}

function matrix( callback, scaleFactor = 1 ) {
	push();
	scale(scaleFactor);
	callback();
	pop();
}

function grid(c) {
	
	const spacing = 50;

	background(200);
	
	stroke(c);
	strokeWeight(1);
	for( var i = scx % spacing; i < main.offsetWidth / factor; i += spacing ) {
		line(i, 0, i, main.offsetHeight / factor);
	}

	for( var i = scy % spacing; i < main.offsetHeight / factor; i += spacing ) {
		line(0, i, main.offsetWidth / factor, i);
	}

}

function mouseReleased() {
	if( dragged != null ) {
		dragged = null;

		mousePressed();
	}
}

function mouseDragged() {
	if( WireEditor.isClicked() ) {
		dragged = {};

		return;
	}

	if( dragged !== null ) {

		dragged.drag(Mouse.x - Mouse.px, Mouse.y - Mouse.py);

	}else{

		let clicked = false;

		for( var box of boxes ) {
			if( box.canClick(Mouse.x, Mouse.y) ) {

				if( box.canGrab(Mouse.x, Mouse.y) ) {
					dragged = box;
				}

				clicked = true;
			}
		}

		// grab the screen
		if( !clicked ) {

			dragged = {
				drag: function(mx, my) {
					scx += mx;
					scy += my;

					Gui.reset();
				}
			};

		}

	}
}

function mousePressed() {
	const now = Date.now();

	const double = (now - last) < 200;

	for( var key in boxes ) {
		if( boxes[key].canClick(Mouse.x, Mouse.y) ) {
			boxes[key].click(Mouse.x, Mouse.y, double);
		}
	}

	last = now;

	WireEditor.click();
}

function keyPressed() {
	if( keyCode == DELETE || keyCode == BACKSPACE ) {
		for( var i = boxes.length - 1; i >= 0; i -- ) {
			if( boxes[i].isSelected() ) boxes[i].remove();
		}
	}

	if( key == " " ) {
		factor = 1;
		scx = 0;
		scy = 0;
	}
}

function mouseWheel(event) {
	factor += ( event.delta < 0 ) ? 0.1 : -0.1;

	if( factor < 0.1 ) factor = 0.1;
	if( factor > 2.0 ) factor = 2.0;
}

function draw() {
	Mouse.update();
	
	matrix( () => {

		grid(180);

		for( var box of boxes ) box.draw();

		for( var gate of gates ) {
			gate.tick();
			gate.drawWires();
		}

		tick ++;

		WireEditor.draw();

	}, factor );

	fill(100);
	noStroke();
	text(name + "\nFPS: " + round(getFrameRate()) + "\nx: " + scx.toFixed(0) + " y: " + scy.toFixed(0) + "\n" + factor.toFixed(2) + "x", 10, 10);
}

