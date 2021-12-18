
var main;

function canvasOpen(callback = null) {
	main = document.querySelector("main");
	createCanvas(main.offsetWidth, main.offsetHeight);

	// keep the size of the canvas in check
	window.onresize = () => {
		resizeCanvas(main.offsetWidth, main.offsetHeight);
		
		if(callback != null) {
			callback();
		}
	};
}

/// draw background grid
function grid(c, x, y, f) {
	const spacing = 50;
	const separation = spacing * 4;

	const sepx = x % separation;
	const sepy = y % separation;
	
	strokeWeight(1);

	for( var i = x % spacing; i < main.offsetWidth / f; i += spacing ) {
		stroke( (i - sepx) % separation == 0 ? c - 15 : c );
		line(i, 0, i, main.offsetHeight / f);
	}

	for( var i = y % spacing; i < main.offsetHeight / f; i += spacing ) {
		stroke( (i - sepy) % separation == 0 ? c - 15 : c );
		line(0, i, main.offsetWidth / f, i);
	}
}

