
class Filesystem {

	/// stackoverflow.com/a/30832210
	static download(data, name) {
		const file = new Blob([data], {type: "text/plain"});
		const link = document.createElement('a');
		const url = URL.createObjectURL(file);

		link.href = url;
		link.download = name;
		document.body.appendChild(link);
		link.click();

		setTimeout(() => {
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}

	static upload( callback ) {
		let input = document.getElementById("upload");
		
		if( input == null ) {
			input = document.createElement("input");

			input.type = "file";
			input.id = "upload";
			input.accept = ".lxs";
			input.style.display = "none";

			input.onchange = (event) => {
				const input = event.target;
				const reader = new FileReader();

				reader.onload = function() {
					callback( reader.result, input.files[0].name );
				};

				reader.readAsText(input.files[0]);
			};

			document.body.appendChild(input);
		}

		input.click();
    }

}

