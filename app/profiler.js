
var profiler = new class {

	mtime = 0;
	ftime = 0;

	frames = new Array(100).fill(0);
	updates = new Array(100).fill(0);
	marks = [];
	pix = 0;

	#chart(diameter, x, y, data, total) {
		fill(255, 255, 255, 200);
		circle(x, y, diameter);

		let angle = 0;

		data.forEach(point => {
			const a = radians((point.t / total) * 360);
			fill(point.c);
			arc(x, y, diameter, diameter, angle, angle + a );
			angle += a;
		});
	}

	draw(diff) {
		if(!dbg_show_profiler) return;

		stroke(0, 0, 0, 200);
		line(0, height - 1 - 16.6*5, 100, height - 1 - 16.6*5);

		stroke(255, 0, 0, 200);
		for(let i = 0; i < 100; i ++) {
			line(i, height - 1, i, height - 1 - this.frames[i] * 5);
		}
	
		stroke(0, 0, 255, 200);
		for(let i = 0; i < 100; i ++) {
			line(i + 100, height - 1, i + 100, height - 1 - this.updates[i] * 5);
		}

		fill(0); 
		noStroke();
		textAlign(RIGHT, TOP);

		for(let i = 0; i < 5; i ++) {
			fill(this.marks[i].c);
			text(`${this.marks[i].t}ms`, width - 120, height - 25 - i * 20); 
			text(`${this.marks[i].n}: `, width - 180, height - 25 - i * 20); 
		}

		textAlign(LEFT, TOP);
		this.#chart(100, width - 60, height - 60, this.marks, diff);

	}

	frame() {
		const now = Date.now();
		const diff = now - this.ftime;
		this.ftime = now;

		this.frames[this.pix % 100] = diff;
		this.updates[this.pix % 100] = UpdateQueue.size();
		this.pix ++;

		return diff;
	}

	markReset() {
		this.marks = [];
		this.mtime = Date.now();
	}

	mark(name, r, g, b) {
		const now = Date.now();

		this.marks.push({
			n: name,
			c: color(r, g, b),
			t: now - this.mtime
		});

		this.mtime = now;
	} 

}

