


# Logix - Logic Simulator

This help page can be opened from the settings screen.

## Gates

To add a gate to a sketch use the `toolbar` at the bottom of the screen, or press the right mouse button and select the desired gate from the context menu to add it in place. Gates can be selected by pressing <key>SHIFT</key> and dragging, or by double clicking at the gate's title bar. 

You can select all gates by pressing <key>CTRL</key>+<key>A</key>, and unselect them by pressing <key>ESC</key> or double clicking on the background.

Once a gate is selected you can:
- **Delete selected gates** by pressing the <key>DEL</key>, or <key>BACKSPACE</key> key, or right clicking on the gate title bar and selecting the "Delete" option.
- **Copy selected gates** by pressing <key>CTRL</key>+<key>C</key>, or right clicking on the gate title bar and selecting the "Copy" option.
- **Copy the layout of selected gates** by pressing <key>CTRL</key>+<key>ALT</key>+<key>C</key>, or right clicking on the gate title bar and selecting the "Copy layout" option. This copies the gates without the connections between them.

### Paste Selection

To paste the copied selection use <key>CTRL</key>+<key>V</key> or right click and select "Paste" from the context menu.

## Wires

To connect two gates with a wire click on the output of one gate (outputs are on the right side) and then click on the input of another gate (inputs are on the left side), you can also drag the wire between those two points. To disconect a wire, or reconect it to a difrent gate, click on its end (on the input side) and then click on another input to reconect it to that input, or click on the background to drop it, you can also drag the wire between those two points. To pan the background while holding the wire press the middle mouse button.

To connect a single wire to multiple inputs at once, hold <key>CTRL</key> while clicking on the input, the wire will be conected but it won't be dropped.

You can also reconect wires on the output side of the gate, to do this hold <key>CTRL</key> and click on the output, you can now reconect it to a diffrent output or drop it by clicking on the background. If you also hold <key>CTRL</key> while reconecting the wire to a diferent output all already existing connection in that output are going to be replaced, otherwise the two groups of wires are going to be merged together.

## Contributing

Consider helping the project by contributing or reporting issues on Logix's [GitHub](github.com/magistermaks/net-logix) page.
