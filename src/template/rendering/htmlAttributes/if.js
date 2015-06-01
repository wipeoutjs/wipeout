
HtmlAttr("if", function () {
	
	//TODE
	return function _if (element, attribute, renderContext) {
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
        
        element.setAttribute("data-wo-el", "wo.if");
        var content = new wipeout.template.rendering.viewModelElement(element, null, renderContext, true);
        
        content.createdViewModel.ifTrueId = wipeout.viewModels.content.createAnonymousTemplate(template);
        attribute.watch(function (oldValue, newValue) {
            content.createdViewModel.condition = newValue;
            content.createdViewModel.reEvaluate();
        }, true);
        
        return content;
    }
});