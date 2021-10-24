
var last = 0;
var factor = 1;
var dragger = null;

class Mouse {
	static x = 0;
	static y = 0;
	static px = 0;
	static py = 0;
	static ox = 0;
	static oy = 0;

	static update() {
		Mouse.x = mouseX / factor;
		Mouse.y = mouseY / factor;
	}

	static dragged() {
		this.ox = this.x - this.px;
		this.oy = this.y - this.py;
		this.px = this.x;
		this.py = this.y;
	}
}

function mouseReleased() {
	if( dragger != null ) {
		dragger = null;

		mousePressed();
	}
}

function mouseDragged() {
	if(Gui.pause) return;

	Mouse.dragged();
	Gui.Picker.close();

	if( WireEditor.isClicked() ) {
		dragger = () => {};
		return;
	}

	if( dragger !== null ) {
		dragger(Mouse.ox, Mouse.oy);
	}else{

		let clicked = false;

		for(let gate of gates) {
			if( !gate.canClick(Mouse.x, Mouse.y) ) continue;

			if( gate.canGrab(Mouse.x, Mouse.y) ) {

				if( gate.selected ) {
					dragger = (mx, my) => {
						Selected.get().forEach(gate => gate.drag(mx, my));
					}
				}else{
					dragger = (mx, my) => gate.drag(mx, my);
				}

				gate.top();
			}

			clicked = true;
		}

		// grab the screen if nothing else was clicked
		if( !clicked ) {

			dragger = (mx, my) => {
				scx += mx;
				scy += my;

				Gui.reset();
			};

		}

	}
}

function mousePressed(e) {
	if(Gui.pause) return;

	const now = Date.now();
	const double = (now - last) < 200;

	last = now;

	// ugly but works
	if(e?.target?.parentElement?.parentElement != picker) {
		Gui.Picker.close();
	}

	// iterate backwards to click only the gate "on top"
	for( let i = gates.length - 1; i >= 0; i -- ) {
		if( gates[i].canClick(Mouse.x, Mouse.y) ) {
			gates[i].click(Mouse.x, Mouse.y, double);
			WireEditor.click();
			return;
		}
	}

	WireEditor.click();
	
	// if we got here it means that user double clicked on background
	if(double) {
		Selected.removeAll();
	}

}

function keyPressed(event) {
	if(Gui.pause) return;

	if( keyCode == ESCAPE ) {
		Selected.removeAll();
		return false;
	}

	if( keyCode == DELETE || keyCode == BACKSPACE ) {
		Selected.get().forEach(gate => gate.remove());
		return false;
	}

	if( key == 'a' && event.ctrlKey ) {
		Selected.addAll();
		return false;
	}

	if( key == " " ) {
		factor = 1;
		scx = 0;
		scy = 0;
		return false;
	}
}

function mouseWheel(event) {
	if(Gui.pause || Gui.Picker.isOpen()) return;

	factor += ( event.delta < 0 ) ? 0.1 : -0.1;

	if( factor < 0.1 ) factor = 0.1;
	if( factor > 2.0 ) factor = 2.0;
}
