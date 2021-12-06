
var last = 0;
var factor = 1;
var dragger = null;
var zox = 0, zoy = 0;

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

		Selected.dragEnd();
		mousePressed();
	}
}

function mouseDragged(e) {
	if(Gui.pause || GUI.focused()) return;

	Mouse.dragged();

	if(e?.target?.parentElement?.parentElement != picker) {
		Gui.Picker.close();
	}else return;

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

			if( gate.canGrab(Mouse.x, Mouse.y) || (keyCode == SHIFT && keyIsPressed) ) {

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

			// select area if shift is pressed
			if( keyCode == SHIFT && keyIsPressed ) {
				Selected.dragBegin(Mouse.x, Mouse.y);
				dragger = (mx, my) => {};
			}else{
				dragger = (mx, my) => {
					scx += mx;
					scy += my;
					zox += mx;
					zoy += my;

					Gui.reset();
				};
			}

		}

	}
}

function mousePressed(e) {
	if(Gui.pause || GUI.focused()) return;

	const now = Date.now();
	const double = (now - last) < 200;

	last = now;

	// ugly but works
	if(e?.target?.parentElement?.parentElement != picker) {
		Gui.Picker.close();
	}

	// iterate backwards to click only the gate "on top"
	if( keyCode != SHIFT || !keyIsPressed ) {
		for( let i = gates.length - 1; i >= 0; i -- ) {
			if( gates[i].canClick(Mouse.x, Mouse.y) ) {
				gates[i].click(Mouse.x, Mouse.y, double);
				WireEditor.click();
				return;
			}
		}
	}

	WireEditor.click();
	
	// if we got here it means that user double clicked on background
	if(double) {
		Selected.removeAll();
	}

}

function keyPressed(event) {
	if(Gui.pause || GUI.focused()) return;

	if( keyCode == ESCAPE ) {
		Selected.removeAll();
		return false;
	}

	if( keyCode == DELETE || keyCode == BACKSPACE ) {
		Selected.get().forEach(gate => {
			Event.Rem.trigger({uid: gate.getId()});
		});
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
		zoomInit();
		return false;
	}

	if( key == 's' && event.ctrlKey ) {
		Manager.save(identifier);
		return false;
	}

}

// 
// time_wasted_while_trying_to_fucking_make_this_work = 15h
//
function mouseWheel(event) {
	if(Gui.pause || GUI.focused() || Gui.Picker.isOpen()) return;

	let old = factor;

	factor += ( event.delta < 0 ) ? 0.1 : -0.1;

	if( factor < 0.1 ) factor = 0.1;
	if( factor > 2.0 ) factor = 2.0;

	// TODO make it point to mouse

	// by mug12, the smart one
	const s = 0.5 / factor;
	scx = zox + main.offsetWidth * s;
	scy = zoy + main.offsetHeight * s;
}

function zoomInit() {
	zox = scx - main.offsetWidth / 2;
	zoy = scy - main.offsetHeight / 2;
}

