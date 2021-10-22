<html>

	<head lang="en-US">

		<!-- <script src="libs/p5.min.js"></script> -->
		<script src="libs/lz.min.js"></script>
		<script src="app/menu/main.js"></script>
		<script src="app/menu/menu.js"></script>
		<script src="app/common/save.js"></script>
		<script src="app/common/settings.js"></script>

		<?php include "header.html" ?>

	</head>

	<body>

		<!-- p5.js canvas -->
		<main></main>

		<!-- menu container -->
		<div id="menu">

			<div>

				<div id="top">
					<span> Select Sketch </span>
				</div>

				<div id="list">
					<!-- filled with javascript -->
				</div>

				<div id="new">
					<span onclick="create()"> New Sketch </span>
				</div>

			</div>

		</div>

		<div id="footer">
			Version 1.2.0 <br>
			Source avaible at <a href="https://github.com/magistermaks/net-logix">Github</a> 
		</div>

	</body>

</html>

