
Class("wipeout.template.viewModelElement", function () {
    
    function viewModelElement (element, xmlOverride, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="xmlOverride" type="wipeout.template.templateElement" optional="true">If set, will use this xml to initialize the view model. If not will parse and use the element property</param>
        ///<param name="parentRenderContext" type="wipeout.template.renderContext" optional="true">The render context of the parent view model</param>
        
        var vm = xmlOverride ? {
            constructor: wipeout.utils.obj.getObject(xmlOverride.name),
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
        this.viewModel.templateId.subscribe(this.template, this);
        
        // add this to DOM and remove placeholder
        element.parentElement.insertBefore(this.openingTag, element);
        element.parentElement.removeChild(element);
        
        // initialize
        this.init();
    }
    
    viewModelElement.prototype.init = function() {
        ///<summary>Initialize this by adding the closing tag and rendering the view model</summary>
        
        // insert closing tag
        this.openingTag.nextSibling ? 
            this.openingTag.parentElement.insertBefore(this.closingTag, this.openingTag.nextSibling) : 
            this.openingTag.parentElement.appendChild(this.closingTag);
                
        // cache templateId
        var tid = this.viewModel.templateId();
        
        // initialize the view model
        this.viewModel._initialize(this.initialization, this.renderContext);
        
        // if the initialize did not trigger a templateId mutation, trigger one
        if(this.viewModel.templateId() === tid)
            this.viewModel.templateId.valueHasMutated();
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
    
    viewModelElement.prototype.template = function(templateId) {
        ///<summary>Render the view model with the given template</summary>
        ///<param name="templateId" type="String">A pointer to the template to apply</param>
            
        // remove old template
        this.unTemplate();

        // get template builder. This generates a html string and a function to
        // add dynamic functionality after it is added to the DOM
        var builder = wipeout.template.newEngine.instance.getTemplate(templateId).getBuilder();

        //TODO: hack
        // add builder html
        var scr = document.createElement("script");
        this.closingTag.parentElement.insertBefore(scr, this.closingTag);
        scr.insertAdjacentHTML('afterend', builder.html);
        scr.parentElement.removeChild(scr);

        // add dynamic functionality and cache dispose function
        this.disposeOfBindings = builder.execute(this.renderContext);
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