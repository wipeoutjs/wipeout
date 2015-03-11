
Class("wipeout.template.rendering.renderedContent", function () {
    
    var renderedContent = wipeout.base.object.extend(function renderedContent (element, name, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="name" type="String">The content of the rendered comment tags</param>
        ///<param name="parentRenderContext" type="wipeout.template.context" optional="true">The render context of the parent view model</param>
                        
		this._super();
		
        name = wipeout.utils.obj.trim(name);
        
        this.parentRenderContext = parentRenderContext;
                
        // create opening and closing tags and link to this
        this.openingTag = document.createComment(" " + name + " ");        
        this.openingTag.wipeoutOpening = this;
        this.closingTag = document.createComment(" /" + name + " ");
        this.closingTag.wipeoutClosing = this;
        
        // add this to DOM and remove placeholder
        element.parentElement.insertBefore(this.openingTag, element);
        element.parentElement.insertBefore(this.closingTag, element);
        element.parentElement.removeChild(element);
    });
	
	renderedContent.prototype.rename = function (name) {
		this.openingTag.nodeValue = " " + name + " ";
		this.closingTag.nodeValue = " /" + name + " ";
	};
	
    renderedContent.prototype.render = function (object, arrayIndex) {
		
        if (object instanceof Array) {
            this.renderArray(object);
            return;
        }
        
        this.unRender();
		
		this.viewModel = object;
        
        if (this.viewModel == null)
            return;
		
		this.renderContext = this.parentRenderContext ? 
			this.parentRenderContext.contextFor(this.viewModel, arrayIndex) :
			new wipeout.template.context(this.viewModel, arrayIndex);
        
        if (this.viewModel instanceof wipeout.viewModels.view) {
            this.viewModel.$domRoot = this;
            this.templateObserved = this.viewModel.observe("templateId", this._template, this, {activateImmediately: true});
			
            if (this.viewModel.templateId)
                this.template(this.viewModel.templateId);
        } else {
            this.appendHtml(this.viewModel.toString());
        }
    };
    
    renderedContent.prototype._template = function(oldTemplateId, templateId) {
        ///<summary>Render the view model with the given template</summary>
        ///<param name="oldTemplateId" type="String">The previous value (unused)</param>
        ///<param name="templateId" type="String">A pointer to the template to apply</param>
		
        this.template(templateId);
    };
        
    //TODO: rename to unRender
    renderedContent.prototype.unRender = function(leaveDeadChildNodes) {
        this.unTemplate(leaveDeadChildNodes);
        
		if (this.templateObserved) {
			this.templateObserved.dispose();
			delete this.templateObserved;
		}
		
        if (this.viewModel instanceof wipeout.viewModels.view)
            delete this.viewModel.$domRoot;
		
		delete this.renderContext;
		delete this.viewModel;
    };
    
    //TODO: rename to unRender
    renderedContent.prototype.unTemplate = function(leaveDeadChildNodes) {
        ///<summary>Remove a view model's template, leaving it blank</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
		delete this.currentTemplate;
		
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
    
    renderedContent.prototype.template = function(templateId) {
        ///<summary>Render the view model with the given template</summary>
        ///<param name="templateId" type="String">A pointer to the template to apply</param>
        		
        // if a previous request is pending, cancel it
        if (this.asynchronous)
            this.asynchronous.cancel();
		
		if (this.currentTemplate === templateId) return;
        
        // remove old template
        if (this.__initialTemplate)
            this.unTemplate();
				
		if (!templateId) return;
        		
        this.asynchronous = wipeout.template.engine.instance.compileTemplate(templateId, (function (template) {
            delete this.asynchronous;
            
            // remove loading placeholder
            if (element) {
                element.parentElement.removeChild(element);
                element = null;
            }
            
			this.currentTemplate = templateId;
			
			// add html and execute to add dynamic content
            this.disposeOfBindings = template.quickBuild(this.appendHtml.bind(this), this.renderContext);
            this.__initialTemplate = true;
            
            this.viewModel.onRendered();
        }).bind(this));
        
        if (this.asynchronous) {            
            var element = wipeout.utils.html.createTemplatePlaceholder(this.viewModel);
            this.closingTag.parentElement.insertBefore(element, this.closingTag);
        }
    };
    
    renderedContent.prototype.dispose = function(leaveDeadChildNodes) {
        ///<summary>Dispose of this view model and viewModel element, removing it from the DOM</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
		if (!this.closingTag) return;
		
        this.unRender(leaveDeadChildNodes);
        
        if (!leaveDeadChildNodes) {
            this.closingTag.parentElement.removeChild(this.closingTag);
            this.openingTag.parentElement.removeChild(this.openingTag);
			
			delete this.closingTag;
			delete this.openingTag;
        }        
    };
        
    //TODO: test
    renderedContent.prototype.appendHtml = function (html) {
        //TODO: hack
        var scr = document.createElement("script");
        this.closingTag.parentElement.insertBefore(scr, this.closingTag);
        scr.insertAdjacentHTML('afterend', html);
        scr.parentElement.removeChild(scr);
    };
    
    renderedContent.getParentElement = function(forHtmlElement) {
        var current = forHtmlElement.wipeoutClosing ? forHtmlElement.wipeoutClosing.openingTag : forHtmlElement;
        while (current = current.previousSibling) {
            if (current.wipeoutClosing)
                current = current.wipeoutClosing.openingTag;
            else if (current.wipeoutOpening)
                return current;
        }
        
        return forHtmlElement.parentElement;
    };
    
    return renderedContent;    
});