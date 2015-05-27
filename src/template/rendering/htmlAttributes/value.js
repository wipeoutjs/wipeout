
HtmlAttr("value", function () {
	
    // ensure setByEvent is not used the first time
    var sbe = {};
    
	//TODE
    function select (select, attribute, renderContext) {
		
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + attribute.value(true) + "\".";
        
        var getter = attribute.getter();
        select.value = getter();
        wipeout.utils.domData.set(select, "wo-value-getter", getter);
        
        var setByEvent = sbe;
        attribute.watch(function (oldValue, newValue) {
            if (setByEvent === newValue)
                return;
            
            var optionValue;
            for (var i = 0, ii = select.options.length; i < ii; i++) {
                if (optionValue = wipeout.utils.domData.get(select.options[i], "wo-value-getter")) {
                    if (optionValue() === newValue) {
                        select.selectedIndex = i;
                        return;
                    }
                } else if (select.options[i].hasAttribute("value")) {
                    if (select.options[i].value == newValue) {
                        select.selectedIndex = i;
                        return;
                    }
                } else if (select.options[i].innerHTML == newValue) {
                    select.selectedIndex = i;
                    return;
                }
            }
        });
        
        var setter = attribute.setter();
		attribute.onElementEvent(
            select.getAttribute("wo-on-event") || select.getAttribute("data-wo-on-event") || "change",
            function () {
                var selected = select.options[select.selectedIndex], optionValue;
                
                if (!selected)
                    setter(setByEvent = null);
                else if (optionValue = wipeout.utils.domData.get(selected, "wo-value-getter"))
                    setter(setByEvent = optionValue());
                else if (selected.hasAttribute("value"))
                    setter(setByEvent = selected.getAttribute("value"));
                else
                    setter(setByEvent = selected.innerHTML);
            });
    };
    
	//TODE
	return function value (element, attribute, renderContext) {
        ///<summary>Bind to the value of a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
        // for checkboxes, radios and options "value" works in conjunction with "checked-value"
		if (element.type === "checkbox" || element.type === "radio")
			return;
        
        if (trimToLower(element.tagName) === "select")
            return select(element, attribute, renderContext);
        
        // TODO: not terribly efficient. Getters should be lazy created
        if (trimToLower(element.tagName) === "option") {
            var getter = attribute.getter(), parentGetter;
            wipeout.utils.domData.set(element, "wo-value-getter", getter);
                   
            if (parentGetter = wipeout.utils.domData.get(element.parentElement, "wo-value-getter")) {
                element.selected = getter() === parentGetter();
            } else if (element.parentElement) {
                element.selected = getter() === element.parentElement.value;
            }
            
            // TODO: is this needed? (If so, needs tests)
            /*attribute.watch(function (oldValue, newValue) {
                if (element.selected && element.parentElement) {
                    var event = document.createEvent("UIEvents");
                    event.initUIEvent(
                        element.parentElement.getAttribute("wo-on-event") || element.parentElement.getAttribute("data-wo-on-event") || "change", 
                        true, true, null, 1);
                    element.parentElement.dispatchEvent(event)
                }
            });*/
            
            return;
        }
		
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + attribute.value(true) + "\".";
		
		var textarea = trimToLower(element.tagName) === "textarea";
		attribute.watch(function (oldVal, newVal) {
            if (newVal == null) 
                newVal = "";
            
			if (textarea && element.innerHTML !== newVal)
                element.innerHTML = newVal;
			else if (!textarea && element.value !== newVal)
                element.value = newVal;
        }, true);
		
        var setter = attribute.setter();
		attribute.onElementEvent(element.getAttribute("wo-on-event") || element.getAttribute("data-wo-on-event") || "change", function () {
			setter(textarea ? element.innerHTML : element.value);
        });
    }
});