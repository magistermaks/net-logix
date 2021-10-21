
var boxes = []

class Box {

	x = 0;
	y = 0;
	#title;

	left;
	right;

	#selected = false;

	static w = 100;
	static h = 100;
	static top = 20;
	static con = 10;
	static wiggle = 6;
	static cnt = 10;

	constructor(x, y, title) {
		this.x = x;
		this.y = y;
		this.#title = title;
		this.left = 0;
		this.right = 0;

		boxes.push(this);
	}

	setPoints(left, right) {
		this.left = left;
		this.right = right;
	}

	drag(mx, my) {
		this.x += mx;
		this.y += my;
	} 

	isSelected() {
		return this.#selected;
	}

	unSelect() {
		this.#selected = false;
	}

	canGrab(mx, my) {
		return this.canClick(mx, my) && scy + this.y + Box.wiggle + Box.top >= my;
	}

	canClick(mx, my) {
		return scx + this.x - Box.wiggle <= mx 
			&& scx + this.x + Box.w + Box.wiggle >= mx 
			&& scy + this.y - Box.wiggle <= my 
			&& scy + this.y + Box.h + Box.wiggle >= my;
	}
	
	getLeftPoint(index) {
		let space = float(Box.h - Box.top) / (this.left + 1);
		return new Vec2f( scx + this.x, scy + this.y + Box.top + space * (index + 1) );
	}
	
	getRightPoint(index) {
		let space = float(Box.h - Box.top) / (this.right + 1); 
		return new Vec2f( scx + this.x + Box.w, scy + this.y + Box.top + space * (index + 1) );
	}
  
	draw() {
	  
		const radius = 4.0;
	  
		// select border color
		strokeWeight(this.#selected ? 3 : 2);
		stroke(this.#selected ? color(9, 98, 215 + 40 * sin(frameCount / 12)) : 0);
		
		// background
		fill(255);
		rect(scx + this.x, scy + this.y, Box.w, Box.h, radius);
	
		// top bar
		fill(100);
		rect(scx + this.x, scy + this.y, Box.w, Box.top, radius, radius, 0, 0);
		
		// draw title
		fill(255);
		noStroke();
		text(this.#title, scx + this.x + 2, scy + this.y + 4);
		
		// draw box contents
		this.content(scx + this.x, scy + this.y + Box.top);
		
		fill(255);
		strokeWeight(2);
		stroke(this.#selected ? color(9, 98, 218) : 0);
		
		const leftSpace = float(Box.h - Box.top) / (this.left + 1); 
		const rightSpace = float(Box.h - Box.top) / (this.right + 1); 
		
		// left connectors
		for( let i = 0; i < this.left; i ++ ) {
			circle(scx + this.x, scy + this.y + Box.top + leftSpace * (i + 1), Box.con);
		}
		
		// right connectors
		for( let i = 0; i < this.right; i ++ ) {
			circle(scx + this.x + Box.w, scy + this.y + Box.top + rightSpace * (i + 1), Box.con);
		}
		
	}

	remove() {
		boxes.splice( boxes.indexOf(this), 1 );
	}
	
	content(x, y) {
		
	}
	
	click(mx, my, double) {
		if( double && mx > this.x + scx && mx < this.x + scx + Box.w && my > this.y + scy && my < this.y + scy + Box.top ) {
			this.#selected = !this.#selected;
		}
	}

}
