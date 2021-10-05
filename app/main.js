
var scx = 0, scy = 0;
var tick = 1;
var dragged = null;

var main;
var identifier;

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
	dragged = null;
}

function mouseDragged() {
	if( dragged !== null ) {

		dragged.drag(mouseX - pmouseX, mouseY - pmouseY);

	}else{

		for( var key in boxes ) {
			if( boxes[key].canGrab(mouseX, mouseY) ) {
				dragged = boxes[key];
			}
		}

		// grab the screen
		if( dragged === null ) {
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

function mouseClicked() {
    for( var key in boxes ) {
        if( boxes[key].canClick(mouseX, mouseY) ) {
            boxes[key].click(mouseX, mouseY);
        }
    }

    WireEditor.click();
}

function draw() {

	grid(180);
	
	fill(100);
	noStroke();
	text(name + "\nFPS: " + round(getFrameRate()) + "\nx: " + scx.toFixed(0) + " y: " + scy.toFixed(0), 10, 10);

    for( var key in boxes ) boxes[key].draw();

    for( var key in gates ) {
        gates[key].drawWires();

		// simulate circut
        if( frameCount % 10 === 0 ) {
            gates[key].tick();
            tick ++;
        }
    }

    WireEditor.draw();
}

