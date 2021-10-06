
var scx = 0, scy = 0;
var tick = 1;
var dragged = null;

var main;
var identifier;
var last;

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
	identifier = window.location.hash.slice(1);
	if( !Manager.load(identifier) ) {
		alert("Failed to load selected sketch!");
		history.back();
	}

	// auto save (every 5s)
	setInterval( function() {
		Manager.save(identifier);
	}, 5000 );
}  

function grid(c) {
	
	const spacing = 50;

	background(200);
	
	stroke(c);
	strokeWeight(1);
	for( var i = scx % spacing; i < main.offsetWidth; i += spacing ) {
		line(i, 0, i, main.offsetHeight);
	}

	for( var i = scy % spacing; i < main.offsetHeight; i += spacing ) {
		line(0, i, main.offsetWidth, i);
	}

}

function fatal( error ) {
	console.error(error);
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

		dragged.drag(mouseX - pmouseX, mouseY - pmouseY);

	}else{

		let clicked = false;

		for( var box of boxes ) {
			if( box.canClick(mouseX, mouseY) ) {

				if( box.canGrab(mouseX, mouseY) ) {
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
        if( boxes[key].canClick(mouseX, mouseY) ) {
            boxes[key].click(mouseX, mouseY, double);
        }
    }

	last = now;

    WireEditor.click();
}

function keyPressed() {
	if( keyCode == DELETE || keyCode == BACKSPACE ) {
		for( var box of boxes ) if( box.isSelected() ) box.remove();
	}
}

function draw() {

	grid(180);
	
	fill(100);
	noStroke();
	text(name + "\nFPS: " + round(getFrameRate()) + "\nx: " + scx.toFixed(0) + " y: " + scy.toFixed(0), 10, 10);

    for( var box of boxes ) box.draw();

    for( var gate of gates ) {
        gate.tick();
		gate.drawWires();
    }

	tick ++;

    WireEditor.draw();
}

