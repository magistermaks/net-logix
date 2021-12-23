<html>

	<head lang="en-US">

		<script src="app/menu/main.js"></script>
		<script src="app/menu/menu.js"></script>
		<script src="app/common/popup.js"></script>
		<script src="app/common/save.js"></script>
		<script src="app/common/settings.js"></script>
		<script src="app/common/files.js"></script>
		<script src="app/common/canvas.js"></script>

		<?php include "header.html" ?>

		<?php
			$config = parse_ini_file("logix.ini");
		?>

	</head>

	<body>

		<!-- p5.js canvas -->
		<main></main>

		<!-- menu container -->
		<div id="menu">

			<div>

				<div id="menu-top">
					<span> Select Sketch </span>
				</div>

				<div id="menu-list">
					<!-- filled with javascript -->
				</div>

				<div id="menu-buttons">
					<div class="button" onclick="create()"> New </div>
					<div class="button" onclick="fileImport()"> Import </div>
					<?php if($config['online']): ?><div class="button" onclick="joinShared()"> Join </div><?php endif; ?>
				</div>

			</div>

		</div>

		<!-- branding -->
		<div id="brand">
			<div>Logix</div>
			<div>Logic Circuit Simulator</div>
		</div>

		<!-- generic popup -->
		<div style="display: none" id="popup">
			<div id="shade"></div>

			<!-- content -->
			<div id="popup-body">
    			<div></div>
    			<div></div>
    			<div></div>
			</div>
		</div>

		<div id="footer">
			Version 1.7.0 <br>
			Source avaible at <a href="https://github.com/magistermaks/net-logix">Github</a> 
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

