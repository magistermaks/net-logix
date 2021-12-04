<html>

	<head lang="en-US">

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
		<script src="app/select.js"></script>
		<script src="app/event.js"></script>
		<script src="app/server.js"></script>
		<script src="app/common/save.js"></script>
		<script src="app/common/settings.js"></script>
		<script src="app/common/files.js"></script>
		<script src="app/common/canvas.js"></script>

		<?php include "header.html" ?>

	</head>

	<body>

		<!-- p5.js canvas -->
		<main></main>

		<!-- toolbox container -->
		<div class="toolbox">

			<!-- toolbox buttons -->
			<center id="toolbar-list">
				<!-- filled with javascript -->
			</center>

		</div>

		<!-- control buttons -->
		<div id="topbar">
			<div class="button compact" onclick="Gui.Settings.open()">Settings</div>
			<div class="button compact" onclick="Gui.fileExport()" id="export-button">Export</div>
			<div class="button compact" onclick="Gui.exit()">Exit</div>
		</div>

		<!-- component picker -->
		<div id="picker" style="display:none;">
			<div id="picker-top"> Add Component... </div>
			<div id="picker-list">
				<!-- filled with javascript -->
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

					<div id="menu-list">
						<!-- filled with javascript -->
					</div>

					<div id="new">
						<div class="button" onclick="Gui.Settings.exit()"> Exit </div>
					</div>
	
				</div>

			</div>

		</div>

		<!-- noscript banner -->
		<noscript>
			<div>
				<img src="assets/javascript.png">
				<span> Sorry, but JavaScript is required to run this app. </span>
			</div>
		</noscript>

	</body>

</html>
