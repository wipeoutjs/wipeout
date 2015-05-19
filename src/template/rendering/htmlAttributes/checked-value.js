
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
            valueGetter = value.buildPermanentGetter(renderContext);
        });
        
        if (!element.checked && onChecked(element, attribute, valueGetter) === attribute.get(renderContext))
            element.setAttribute("checked", "checked");
        
        function set(first) {
            if (element.checked)
                attribute.set(renderContext, onChecked(element, attribute, valueGetter), element);
            else if (element.type !== "radio")
                attribute.set(renderContext, onUnChecked(element, attribute, valueGetter), element);
            else if (!first && noRadiosAreSelected(element.name))
                attribute.set(renderContext, null, element);
        }
        
        set(true);
        
		attribute.onElementEvent(
            element.getAttribute("wo-on-event") || element.getAttribute("data-wo-on-event") || "change", 
            renderContext, 
            set);
        
        // if value changes, update checked value
        attribute.otherAttribute("value", function (value) {
            value.watch(renderContext, function (oldVal, newVal) {
                if (element.hasAttribute("checked"))
                    attribute.set(renderContext, newVal, element);
            });
        });
    };
});