
Class("wipeout.template.initialization.parsers", function () {
    
	function parsers () { }
	
    parsers["json"] = function (value, propertyName, renderContext) {
		return JSON.parse(value);
	};
	
	parsers["string"] = function (value, propertyName, renderContext) {
		return value;
	};
	
	parsers["bool"] = function (value, propertyName, renderContext) {
		var tmp = trimToLower(value);
		return tmp ? tmp !== "false" && tmp !== "0" : false;
	};
	
	parsers["int"] = function (value, propertyName, renderContext) {
		return parseInt(trim(value));
	};
	
	parsers["float"] = function (value, propertyName, renderContext) {
		return parseFloat(trim(value));
	};
	
	parsers["regexp"] = function (value, propertyName, renderContext) {
		return new RegExp(trim(value));
	};
	
	parsers["date"] = function (value, propertyName, renderContext) {
		return new Date(trim(value));
	};
	
	parsers["template"] = function (value) {
		return value;
	};
    
    //TODM
    parsers.template.useRawXmlValue = true;
    
    parsers.j = parsers["json"];
    parsers.s = parsers["string"];
    parsers.b = parsers["bool"];
    parsers.i = parsers["int"];
    parsers.f = parsers["float"];
    parsers.r = parsers["regexp"];
    parsers.d = parsers["date"];
	
	return parsers;
});