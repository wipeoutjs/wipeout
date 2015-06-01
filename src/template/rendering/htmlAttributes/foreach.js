
HtmlAttr("foreach", function () {
	
	//TODE
	return function foreach (element, attribute, renderContext) {
        ///<summary>If the value is true, render the content, otherwise render nothing</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
        
        var template = attribute._value.getParentElement();
        if (!template) {
            element.innerHTML = "";
            return;
        }
        
        element.setAttribute("data-wo-el", "wo.list");
        var content = new wipeout.template.rendering.viewModelElement(element, null, renderContext, true);
        
        content.createdViewModel.itemTemplateId = wipeout.viewModels.content.createAnonymousTemplate(template);
        
        var disp;
        attribute.watch(function (oldVal, newVal) {
            if (oldVal !== newVal) {
                if (disp)
                    content.disposeOf(disp);
                
                disp = busybody.tryBindArrays(newVal, content.createdViewModel.items, true);
                if (disp)
                    disp = content.registerDisposable(disp);
            }
        }, true);
        
        return content;
    }
});