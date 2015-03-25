
//http://www.w3.org/TR/html-markup/syntax.html
Class("wipeout.wml.wmlParser", function () {  
    		
	function parse (htmlElement) {

		var tmp, output = new wipeout.wml.wmlElement(htmlElement.localName);
		for (var i = 0, ii = htmlElement.childNodes.length; i < ii; i++) {
			if (htmlElement.childNodes[i].nodeType === 1)
				output.push(parse(htmlElement.childNodes[i]));
			else if (htmlElement.childNodes[i].nodeType === 8)
				output.push(new wipeout.wml.wmlComment(htmlElement.childNodes[i].textContent));
			else if (htmlElement.childNodes[i].nodeType === 3)
				output.push(new wipeout.wml.wmlString(htmlElement.childNodes[i].textContent));
			else {
				// case should not arise
				tmp = document.createElement("div");
				tmp.appendChild(htmlElement.childNodes[i]);
				output.push(new wipeout.wml.wmlString(tmp.innerHTML));
			}
		}

		for (var i = 0, ii = htmlElement.attributes.length; i < ii; i++)
			output.attributes[htmlElement.attributes[i].name] = new wipeout.wml.wmlAttribute(htmlElement.attributes[i].value, '"');

		return output;
	}
	
    function wmlParser(wmlString) {
		
		var div = document.createElement("div");
		div.innerHTML = wmlString;
		return parse(div);
    }
    
    return wmlParser;
});