
HtmlAttr("class", function () {
	
	var test = _class.test = function (attributeName) {
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
		if (!(has = hasClass(element, className)) && attribute.execute(renderContext))
			addClass(element, className);
		else if (has && !attribute.execute(renderContext))
			removeClass(element, className);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (!oldVal && newVal)
				addClass(element, className);
			else if (oldVal && !newVal)
				removeClass(element, className);
		}, false);
	}
	
	function _class (element, attribute, renderContext) { //TODE
		
		if (!test(attribute.name)) return;
		
		if (wipeout.settings.useElementClassName || !element.classList)
			return old_class(element, attribute, renderContext);
		
		var className = attribute.name.substr(attribute.name.indexOf("class-") + 6);
		if (attribute.execute(renderContext))
			element.classList.add(className);
		else
			element.classList.remove(className);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal)
				element.classList.add(className);
			else
				element.classList.remove(className);
		}, false);
    }
	
	return _class;
});