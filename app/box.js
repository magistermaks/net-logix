
class Box {

	x = 0;
	y = 0;
	#title;

	left;
	right;

	bx = 0;
	by = 0;

	selected = false;

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
	}

	setPoints(left, right) {
		this.left = left;
		this.right = right;
	}

	drag(mx, my) {

		if( Settings.SNAP.get() ) {

			this.bx += mx;
			this.by += my;

			// by how many grids can we move at once
			const mlx = max(int(abs(this.bx / 25)), 1);
			const mly = max(int(abs(this.by / 25)), 1);

			// how much offset do we need to snap to the next grid
			let gx = mlx * (abs(this.x % 25) || 25);
			let gy = mly * (abs(this.y % 25) || 25);

			if( abs(this.bx) >= gx ) {
				gx *= Math.sign(this.bx);

				this.x += gx;
				this.bx -= gx;
			}

			if( abs(this.by) >= gy ) {
				gy *= Math.sign(this.by);

				this.y += gy;
				this.by -= gy;
			}

		}else{

			this.x += mx;
			this.y += my;

		}

		MoveQueue.add(this);

	} 

	canGrab(mx, my) {
		return this.canClick(mx, my) && (scy + this.y + Box.wiggle + Box.top >= my);
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
	  
		// check if the box is visible
		if( this.x + Box.w < -scx || this.y + Box.h < -scy || this.x > -scx + scw || this.y > -scy + sch ) return;

		const radius = 4.0;
	  
		// select border color
		strokeWeight(this.selected ? 3 : 2);
		stroke(this.selected ? color(19, 98, 205 + 50 * sin(frameCount / 12)) : 0);
		
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
		stroke(this.selected ? color(9, 98, 218) : 0);
		
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
	
	content(x, y) {
		
	}
	
	click(mx, my, double) {
		if( double && mx > this.x + scx && mx < this.x + scx + Box.w && my > this.y + scy && my < this.y + scy + Box.top ) {
			Selected.toggle(this);
		}
	}

}

