
class Save {

	static #version = 2;

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

				case 1:
					data = LZString.decompressFromUTF16(data.substring(1 + data.indexOf(";")));
					data = data.replaceAll("type", "t").replaceAll("wires", "w").replaceAll("id", "i").replaceAll("json", "j").replaceAll("name", "n").replaceAll("meta", "m");
					data = "2;" + LZString.compressToUTF16(data);
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

}

