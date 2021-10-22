
class Filesystem {

	/// stackoverflow.com/a/30832210
	static download(data, name) {
		const file = new Blob([data], {type: "text/plain"});
		const a = document.createElement('a');
		const url = URL.createObjectURL(file);

		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();

		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}

	static upload( callback ) {
		let i = document.getElementById("upload");
		if( i == null ) i = document.createElement("input");

		i.type = "file";
		i.id = "upload";
		i.accept = ".lxs";
		i.style.display = "none";

		i.onchange = function(event) {
			var input = event.target;
			var reader = new FileReader();

			reader.onload = function() {
				callback( reader.result, input.files[0].name );
			};

			reader.readAsText(input.files[0]);
			document.body.removeChild(i);
		};

		document.body.appendChild(i);
		i.click();
    }

}

