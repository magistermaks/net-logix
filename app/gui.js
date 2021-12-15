
var access_code = null;

// TODO: rewrite
class Gui {

	static pause;

	static #x = 0;
	static #y = 0;

	static exit() {
		Manager.save(identifier);
		window.location.href = "index.php"
	}

	static init() {
		Gui.Toolbar.init();
		Gui.Settings.init();
	}
	
	static fileExport() {
		Filesystem.download(localStorage.getItem(identifier), identifier.substring("logix-sketch-".length) + ".lxs");
	}

	static share() {
		if( online ) {
			popup.open(
				"Sketch Sharing",
				"Sketch access code: <b>" + access_code + "</b>",
				popup.getCloseButton("Ok")
			);
		}else{
			popup.open(
				"Sketch Sharing", 
				"Are you sure you want to share this sketch? Anyone with an access code will be able to modify and copy it!",
				{text: "Share", event: "popup.close();Gui.shareBegin();"}, {text: "Cancel", event: "popup.close()"}
			);
		}
	}

	static shareBegin() {
		setTimeout(() => {
			Event.server = new RemoteServer(cfg_server, () => {Event.server.host(); online = true;}, (id) => {
				popup.open(
					"Sketch Sharing", 
					`Sketch access code: <b>${id}</b>, share it so that others can join!`,
					{text: "Ok", event: "popup.close()"}
				);
				access_code = id;
			}, () => { popup.open("Network Error!", "Connection with server lost!", {text:"Ok", event:"GUI.openMenu()"}); });
		}, 500);
	}

}

