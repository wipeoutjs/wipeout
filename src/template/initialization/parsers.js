
Class("wipeout.template.initialization.parsers", function () {
    
	function parsers () { }
	
    parsers["json"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for JSON data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Object">A json parsed object</returns>
		
		return JSON.parse(value);
	};
	
	parsers["string"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for string data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument, un parsed</returns>
		
		return value;
	};
	
	parsers["bool"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for boolean data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as boolean</returns>
		
		var tmp = trimToLower(value);
		return tmp ? tmp !== "false" && tmp !== "0" : false;
	};
	
	parsers["int"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for int data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as an int</returns>
		
		return parseInt(trim(value));
	};
	
	parsers["float"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for float data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as a float</returns>
		
		return parseFloat(trim(value));
	};
	
	parsers["regexp"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for float data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as a float</returns>
		
		return new RegExp(trim(value));
	};
	
	parsers["date"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for date data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as a date</returns>
		
		return new Date(trim(value));
	};
	
	parsers["template"] = function (value) {
        ///<summary>A parser for xml temlpate data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument un parsed</returns>
		
		return value;
	};
    
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