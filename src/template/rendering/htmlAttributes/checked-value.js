
HtmlAttr("checked-value", function () {
    
    function onChecked (element, attribute, valueGetter) {
        
        if (valueGetter)
            return valueGetter();
        
        if (element.hasAttribute("value"))
            return element.getAttribute("value")
        
        return true;
    }
    
    function onUnChecked (element, attribute, valueGetter) {
        return valueGetter || element.hasAttribute("value") ? null : false;
    }
    
    function noRadiosAreSelected(name) {
        var radios = document.querySelectorAll('input[type=radio][name="' + name.replace('"', '\\"') + '"]');
        for (var i = 0, ii = radios.length; i < ii; i++)
            if (radios[i].checked)
                return false;
        
        return true;
    }
    
    return function checkedValue (element, attribute, renderContext) {
        ///<summary>Bind to the value of a checked html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
        
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + attribute.value(true) + "\".";
        
        var valueGetter;
        attribute.otherAttribute("value", function (value) {
            valueGetter = value.getter();
        });
        
        if (!element.checked && onChecked(element, attribute, valueGetter) === attribute.getter()())
            element.setAttribute("checked", "checked");
        
        var setter = attribute.setter();
        function set(first) {
            if (element.checked)
                setter(onChecked(element, attribute, valueGetter));
            else if (element.type !== "radio")
                setter(onUnChecked(element, attribute, valueGetter));
            else if (!first && noRadiosAreSelected(element.name))
                setter(null);
        }
        
        set(true);
        
		attribute.onElementEvent(
            element.getAttribute("wo-on-event") || element.getAttribute("data-wo-on-event") || "change", 
            renderContext, 
            set);
        
        // if value changes, update checked value
        attribute.otherAttribute("value", function (value) {
            value.watch(function (oldVal, newVal) {
                if (element.hasAttribute("checked"))
                    setter(newVal);
            });
        });
    };
});