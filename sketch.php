<html>

	<head lang="en-US">

		<script src="libs/lz.min.js"></script>
		<script src="libs/p5.min.js"></script>
		<script src="app/main.js"></script>
		<script src="app/image.js"></script>
		<script src="app/box.js"></script>
		<script src="app/vec2f.js"></script>
		<script src="app/gate.js"></script>
		<script src="app/wire.js"></script>
		<script src="app/logic.js"></script>
		<script src="app/manager.js"></script>
		<script src="app/gui.js"></script>
		<script src="app/input.js"></script>
		<script src="app/common/save.js"></script>
		<script src="app/common/settings.js"></script>
		<script src="app/common/files.js"></script>

		<?php include "header.html" ?>

	</head>

	<body>

		<!-- p5.js canvas -->
		<main></main>

		<!-- toolbox container -->
		<div class="toolbox">

			<!-- toolbox buttons -->
			<center>
				<div class="tooltip">
					<img class="icon" src="./assets/clock.png" onclick="Gui.open(ClockGate)">
					<span>Oscillator</span>
				</div>

				<div class="tooltip">
					<img class="icon" src="./assets/in.png" onclick="Gui.open(InputGate)">
					<span>Switch</span>
				</div>

				<div class="tooltip">
					<img class="icon" src="./assets/out.png" onclick="Gui.open(OutputGate)">
					<span>Indicator</span>
				</div>

				<div class="tooltip">
					<img class="icon" src="./assets/or.png" onclick="Gui.open(OrGate)">
					<span>OR Gate</span>
				</div>

				<div class="tooltip">
					<img class="icon" src="./assets/xor.png" onclick="Gui.open(XorGate)">
					<span>XOR Gate</span>
				</div>

				<div class="tooltip">
					<img class="icon" src="./assets/nor.png" onclick="Gui.open(NorGate)">
					<span>NOR Gate</span>
				</div>

				<div class="tooltip">
					<img class="icon" src="./assets/and.png" onclick="Gui.open(AndGate)">
					<span>AND Gate</span>
				</div>

				<div class="tooltip">
					<img class="icon" src="./assets/not.png" onclick="Gui.open(NotGate)">
					<span>NOT Gate</span>
				</div>

			</center>

		</div>

		<!-- control buttons -->
		<div id="topbar">
			<div class="button compact" onclick="Gui.Settings.open()">Settings</div>
			<div class="button compact" onclick="Gui.fileExport()" id="export-button">Export</div>
			<div class="button compact" onclick="Gui.exit()">Exit</div>
		</div>

		<!-- component picker -->
		<div id="picker" style="display:none;top: 600px;left: 534px;">
			<div id="picker-top"> Add Component </div>
			<div id="picker-list">
				<div onclick="Gui.Picker.add(ClockGate)">Oscillator<img src="./assets/clock.png"></div>
				<div onclick="Gui.Picker.add(InputGate)">Switch<img src="./assets/in.png"></div>
				<div onclick="Gui.Picker.add(OutputGate)">Indicator<img src="./assets/out.png"></div>
				<div onclick="Gui.Picker.add(OrGate)">OR Gate<img src="./assets/or.png"></div>
				<div onclick="Gui.Picker.add(XorGate)">XOR Gate<img src="./assets/xor.png"></div>
				<div onclick="Gui.Picker.add(NorGate)">NOR Gate<img src="./assets/nor.png"></div>
				<div onclick="Gui.Picker.add(AndGate)">AND Gate<img src="./assets/and.png"></div>
				<div onclick="Gui.Picker.add(NotGate)">NOT Gate<img src="./assets/not.png"></div>
			</div>
		</div>

		<!-- settings container -->
		<div id="settings" style="display: none">
		
			<!-- background shadow -->
			<div id="shade"></div>

			<!-- menu container -->
			<div id="menu">

				<div>

					<div id="top">
						<span> Settings </span>
					</div>

					<div id="list">
						<!-- filled with javascript -->
					</div>

					<div id="new">
						<div class="button" onclick="Gui.Settings.exit()"> Exit </div>
					</div>
	
				</div>

			</div>

		</div>

	</body>

</html>
