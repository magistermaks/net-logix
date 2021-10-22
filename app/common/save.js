
class Save {

	static #version = 1;

	static get(id) {
		let data = localStorage.getItem(id);
		let version;
	
		do {
			version = Number.parseInt(data.substring(0, data.indexOf(";")));

			// fallback to version 0
			if( Number.isNaN(version) ) {
				version = 0;
			}

			// upgrade data
			switch( version ) {

				case 0:
					data = "1;" + LZString.compressToUTF16( data.replaceAll("Gate", "").replaceAll("class", "type") );
					break;
			}
		} while( version != Save.#version );

		// strip version token
		data = data.substring(1 + data.indexOf(";"));

		return JSON.parse( LZString.decompressFromUTF16(data) ); 
	}

	static set(id, object) {
		let data = Save.#version + ";" + LZString.compressToUTF16( JSON.stringify(object) );

		localStorage.setItem(id, data);
	}

	static download() {
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

}

