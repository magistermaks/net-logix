<html>

    <head lang="en-US">

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

        <?php include "header.html" ?>

    </head>

    <body>

        <!-- p5.js canvas -->
        <main></main>

		<!-- toolbox container -->
        <div class="toolbox">

            <!-- toolbox buttons -->
            <center>
				<div class="button" title="input">
                    <img class="icon" src="./assets/in.png" onclick="Gui.open(InputGate)">
                </div>

				<div class="button" title="output">
                    <img class="icon" src="./assets/out.png" onclick="Gui.open(OutputGate)">
                </div>

                <div class="button" title="or gate">
                    <img class="icon" src="./assets/or.png" onclick="Gui.open(OrGate)">
                </div>

                <div class="button" title="xor gate">
                    <img class="icon" src="./assets/xor.png" onclick="Gui.open(XorGate)">
                </div>

                <div class="button" title="nor gate">
                    <img class="icon" src="./assets/nor.png" onclick="Gui.open(NorGate)">
                </div>

                <div class="button" title="and gate">
                    <img class="icon" src="./assets/and.png" onclick="Gui.open(AndGate)">
                </div>

				<div class="button" title="not gate">
                    <img class="icon" src="./assets/not.png" onclick="Gui.open(NotGate)">
                </div>

				<div class="button">
                     <!-- separator -->
                </div>

				<div class="button" title="clear">
                    <img class="icon" src="./assets/purge.png" onclick="Gui.purge()">
                </div>

				<div class="button" title="save">
                    <img class="icon" src="./assets/save.png" onclick="Gui.save()">
                </div>

            </center>

        </div>

	</body>

</html>
