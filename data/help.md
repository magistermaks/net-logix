# Logix - Logic Simulator

This help page can be opened from the settings screen.

## Gates

To add a gate to a sketch use the `toolbar` at the bottom of the screen, or press the right mouse button and select the desired gate from the context menu to add it in place. Gates can be selected by pressing <key>SHIFT</key> and dragging and area selection, or by double clicking at the gate's title bar. 

You can select all gates by pressing <key>CTRL</key>+<key>A</key>, and unselect them by pressing <key>ESC</key> or double clicking on the background.

Once a gate is selected you can:
- **Delete selected gates** by pressing the <key>DEL</key>, or <key>BACKSPACE</key> key, or right clicking on the gate title bar and selecting the "Delete" option.
- **Copy selected gates** by pressing <key>CTRL</key>+<key>C</key>, or right clicking on the gate title bar and selecting the "Copy" option.
- **Copy the layout of selected gates** by pressing <key>CTRL</key>+<key>ALT</key>+<key>C</key>, or right clicking on the gate title bar and selecting the "Copy layout" option. This copies the gates without the connections between them.

### Paste Selection

To paste the copied selection use <key>CTRL</key>+<key>V</key> or right click and select "Paste" from the context menu.

## Wires

To connect two gates with a wire click on the output of one gate (outputs are on the right side) and then click on the input of another gate (inputs are on the left side), you can also drag the wire between those two points. To disconnect a wire, or reconnect it to a different gate, click on its end (on the input side) and then click on another input to reconnect it to that input, or click on the background to drop it. You can also drag the wire between those two points. To pan the background while holding the wire press the middle mouse button.

To connect a single wire to multiple inputs at once, hold <key>CTRL</key> while clicking on the input, the wire will be connected but it won't be dropped.

You can also reconnect wires on the output side of the gate, to do this hold <key>CTRL</key> and click on the output, you can now reconnect it to a different output or drop it by clicking on the background. If you also hold <key>CTRL</key> while reconnecting the wire to a different output all already existing connection in that output are going to be replaced, otherwise the two groups of wires are going to be merged together.

## Sharing

You can download a Logix sketch by pressing the "Export" button in the top right. Such a file can then be imported in the main menu under the "Import" option.  

Logix also allows two or more users to work simultaneously on the same sketch, to share your sketch with another person click the "Share" button and give them the access code. To then join a sketch enter that code under the "Join" option in the main menu. *Remember that everyone in a possession of that code can copy or delete your entire sketch!* If you wish to stop sharing a sketch you can press "Share" button again and select "Stop", or exit to main menu.

## Contributing

Consider helping the project by contributing or reporting issues on Logix's <a href="https://github.com/magistermaks/net-logix" target="_top">GitHub</a> page.
