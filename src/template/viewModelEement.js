
Class("wipeout.template.viewModelElement", function () {
    
    function viewModelElement (element, xmlOverride, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="xmlOverride" type="wipeout.template.templateElement" optional="true">If set, will use this xml to initialize the view model. If not will parse and use the element property</param>
        ///<param name="parentRenderContext" type="wipeout.template.renderContext" optional="true">The render context of the parent view model</param>
        
        var vm = xmlOverride ? {
            constructor: wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(xmlOverride.name)),
            name: xmlOverride.name
        } : getMeAViewModel(element);
        
        if(!vm)
            throw "Invalid view model";
        
        name = wipeout.utils.obj.trim(vm.name);
                
        // create opening and closing tags and link to this
        this.openingTag = document.createComment(" " + name + " ");        
        this.openingTag.wipeoutOpening = this;
        this.closingTag = document.createComment(" /" + name + " ");
        this.closingTag.wipeoutClosing = this;
        
        // create initialization xml
        this.initialization = xmlOverride || wipeout.template.templateParser(wipeout.utils.html.outerHTML(element))[0];
        
        // create actual view model
        this.viewModel = new vm.constructor();
        this.renderContext = new wipeout.template.renderContext(this.viewModel, parentRenderContext);
        
        // bind the content of this to the view model template
        this.viewModel.observe("templateId", this.template, this);
        
        // add this to DOM and remove placeholder
        element.parentElement.insertBefore(this.openingTag, element);
        element.parentElement.removeChild(element);
        
        // initialize
        this.init();
    }
    
    viewModelElement.getParentElement = function(forHtmlElement) {
        var current = forHtmlElement.wipeoutClosing ? forHtmlElement.wipeoutClosing.openingTag : forHtmlElement;
        while (current = current.previousSibling) {
            if (current.wipeoutClosing)
                current = current.wipeoutClosing.openingTag;
            else if (current.wipeoutOpening)
                return current;
        }
        
        return forHtmlElement.parentElement;
    };
    
    viewModelElement.prototype.init = function() {
        ///<summary>Initialize this by adding the closing tag and rendering the view model</summary>
        
        // insert closing tag
        this.openingTag.nextSibling ? 
            this.openingTag.parentElement.insertBefore(this.closingTag, this.openingTag.nextSibling) : 
            this.openingTag.parentElement.appendChild(this.closingTag);
                
        // cache templateId
        var tid = this.viewModel.templateId;
        
        // initialize the view model
        wipeout.template.engine.instance
            .getVmInitializer(this.initialization)
            .initialize(this.viewModel, this.renderContext);
        
        // if the initialize did not trigger a templateId mutation, trigger one
        if(this.viewModel.templateId === tid)
            this.template(tid, tid);
    };
    
    viewModelElement.prototype.unTemplate = function(leaveDeadChildNodes) {
        ///<summary>Remove a view model's template, leaving it blank</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
        // dispose of bindings
        if (this.disposeOfBindings) {
            this.disposeOfBindings();
            delete this.disposeOfBindings;
        }

        // TODO: test and implement - http://stackoverflow.com/questions/3785258/how-to-remove-dom-elements-without-memory-leaks
        // remove all children
        if(!leaveDeadChildNodes)
            while (this.openingTag.nextSibling && this.openingTag.nextSibling !== this.closingTag)
                this.openingTag.nextSibling.parentNode.removeChild(this.openingTag.nextSibling);
    };
    
    viewModelElement.prototype.template = function(oldTemplateId, templateId) {
        ///<summary>Render the view model with the given template</summary>
        ///<param name="oldTemplateId" type="String">The previous value</param>
        ///<param name="templateId" type="String">A pointer to the template to apply</param>
        
        // if a previous request is pending, cancel it
        if (this.asynchronous)
            this.asynchronous.cancel();
        
        // remove old template
        if (this.__initialTemplate)
            this.unTemplate();
        
        this.asynchronous = wipeout.template.engine.instance.getCompiledTemplate(templateId, (function (template) {
            delete this.asynchronous;
            
            if (element) {
                element.parentElement.removeChild(element);
                element = null;
            }
            
            // get template builder. This generates a html string and a function to
            // add dynamic functionality after it is added to the DOM
            template = template.getBuilder();
            
            //TODO: hack
            // add builder html
            var scr = document.createElement("script");
            this.closingTag.parentElement.insertBefore(scr, this.closingTag);
            scr.insertAdjacentHTML('afterend', template.html);
            scr.parentElement.removeChild(scr);
            
            this.__initialTemplate = true;

            // add dynamic functionality and cache dispose function
            this.disposeOfBindings = template.execute(this.renderContext);            
        }).bind(this));
        
        if (this.asynchronous) {            
            var element = wipeout.utils.html.createTemplatePlaceholder(this.viewModel);
            this.closingTag.parentElement.insertBefore(element, this.closingTag);
        }
    };
    
    viewModelElement.prototype.dispose = function(leaveDeadChildNodes) {
        ///<summary>Dispose of this view model and viewModel element, removing it from the DOM</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
        this.unTemplate(leaveDeadChildNodes);        
        this.viewModel.dispose();
        delete this.viewModel;
        
        if (!leaveDeadChildNodes) {
            this.closingTag.parentElement.removeChild(this.closingTag);
            this.openingTag.parentElement.removeChild(this.openingTag);
        }        
    };
    
    return viewModelElement;    
});