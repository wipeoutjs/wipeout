
HtmlAttr("class", function () {
	
	var test = _class.test = function (attributeName) {
        ///<summary>Test an attribute name to determine if it is this attribute</summary>
        ///<param name="attributeName" type="String">The attribute name</param>
        ///<returns type="Boolean">The result</returns>
		
		return /^\s*(data\-)?wo\-class\-./.test(attributeName);
	};
	
	var buildRegex = function (forClass) {
		
		return new RegExp("(?:^|\\s)" + forClass + "(?!\\S)", "g");
	};

	var hasClass = function (element, className) {
		
		return buildRegex(className).test(element.className);
	};

	var addClass = function (element, className) {
		
		if (!hasClass(element, className))
			element.className = trim(element.className + (element.className.length ? " " : "") + className);
	};

	var removeClass = function (element, className) {
		
		var re;
		if ((re = buildRegex(className)).test(element.className))
			element.className = trim(element.className.replace(re, ""));
	};
	
	function old_class(element, attribute, renderContext) {
		var attr, has;
		var className = attribute.name.substr(attribute.name.indexOf("class-") + 6);
        var getter = attribute.getter();
		if (!(has = hasClass(element, className)) && getter())
			addClass(element, className);
		else if (has && !getter())
			removeClass(element, className);
		
		attribute.watch(function (oldVal, newVal) {
			if (!oldVal && newVal)
				addClass(element, className);
			else if (oldVal && !newVal)
				removeClass(element, className);
		}, false);
	}
	
	//TODE
	function _class (element, attribute, renderContext) {
        ///<summary>Add or remove css classes</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		if (wipeout.settings.useElementClassName || !element.classList)
			return old_class(element, attribute, renderContext);
		
		var className = attribute.name.substr(attribute.name.indexOf("class-") + 6);
		if (attribute.getter()())
			element.classList.add(className);
		else
			element.classList.remove(className);
		
		attribute.watch(function (oldVal, newVal) {
			if (newVal)
				element.classList.add(className);
			else
				element.classList.remove(className);
		}, false);
    }
	
	return _class;
});