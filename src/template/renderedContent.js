
Class("wipeout.template.renderedContent", function () {
    
    var renderedContent = wipeout.base.object.extend(function renderedContent (element, name, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="name" type="String">The content of the rendered comment tags</param>
        ///<param name="parentRenderContext" type="wipeout.template.renderContext" optional="true">The render context of the parent view model</param>
                        
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
	}
	
	var mysteryItem = {};
    
    //TODO: this function is too big
    renderedContent.prototype.renderArray = function (array) {
                
        this.unRender();        
        var children = [], getChild;
        
        var itemsControl = this.parentRenderContext.$this instanceof wipeout.viewModels.itemsControl && array === this.parentRenderContext.$this.items ?
            this.parentRenderContext.$this :
            null;
        
        if (itemsControl)
            itemsControl.__woBag.getChild = getChild = function (i) { return children[i] ? children[i].renderedChild : undefined; };
        
        function remove(item) {                    
            if (itemsControl)
                itemsControl.onItemDeleted(item.renderedChild);
			
			delete item.renderedChild;
			delete item.forItem;

            item.dispose();
        };
		
		var render = (function (changes) {
			
			var removed = [];
			enumerateArr(changes, function (change) {
				if (change.type === "splice") {
					var args = new Array(change.addedCount);
					for (var i = 0; i < change.addedCount; i++) args[i] = mysteryItem;
					args.splice(0, 0, change.index, change.removed.length);
					
					removed.push.apply(removed, children.slice(change.index, change.index + change.removed.length));
					children.splice.apply(children, args);
				} else if (!isNaN(parseInt(change.name))) {
					if (children[change.name] !== mysteryItem)
						removed.push(children[change.name]);
					
					children[change.name] = mysteryItem;
				}
			});
			
			for (var k = removed.length - 1; k >= 0; k--)
				if (removed[k] === mysteryItem)
					removed.splice(1, k);
			
			// find added items
			for (var i = 0, ii = children.length; i < ii; i++) {
				if (children[i] !== mysteryItem) continue;
				
				// find if added item had been previously removed
				for (var k = 0, kk = removed.length; k < kk; k++) {
					if (removed[k].forItem === array[i]) {
						var item = removed.splice(k, 1)[0];
						if (i === 0)
							this.prepend(item);
						else
							children[i - 1].insertAfter(item);
						
						item.rename("item: " + i);
						children[i] = item;
						
						break;
					}
				}
				
				// item was moved
				if (k != kk) 
					continue;
				
				var placeholder = document.createElement("script");
				if (i === 0)
					this.prepend(placeholder);
				else
					children[i - 1].insertAfter(placeholder);

				children[i] = new renderedContent(placeholder, "item: " + i, this.parentRenderContext);
				var vm = itemsControl ? itemsControl._createItem(array[i]) : array[i];
				children[i].render(vm);
				children[i].forItem = array[i];
				if (itemsControl) {
					children[i].renderedChild = vm;
					itemsControl.onItemRendered(vm);
				}
			};
			
			enumerateArr(removed, remove);
			
		}).bind(this);
		
        if (array instanceof wipeout.base.array) {
			var changes;
            var arrayObserve = array.observe(render, null, {useRawChanges: true});
		}
        
        this.disposeOfBindings = (function () {
            if (arrayObserve) {
                arrayObserve.dispose();
                arrayObserve = null;
			}
			
            if (getChild && itemsControl.__woBag.getChild === getChild) {
                delete itemsControl.__woBag.getChild;
                getChild = null;
            }
			
			enumerateArr(children, remove);
			children.length = 0;
        }).bind(this);
		
		render([{
			type: "splice",
			addedCount: array.length,
			removed: [],
			index: 0
		}]);
	};
	
    renderedContent.prototype.render = function (object) {
        if (object instanceof Array) {
            this.renderArray(object);
            return;
        }
        
        this.unRender();
        
        if (object == null)
            return;
        
        this.renderContext = this.parentRenderContext ? 
            this.parentRenderContext.childContext(object) :
            new wipeout.template.renderContext(object);
        
        if (object instanceof wipeout.viewModels.visual) {
            object.__woBag.domRoot = this;
            object.observe("templateId", this._template, this);
            if (object.templateId)
                this.template(object.templateId);
        } else {
            this.prependHtml(object.toString());
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
        
        if (this.renderContext && this.renderContext.$this instanceof wipeout.viewModels.visual) {
            delete this.renderContext.$this.__woBag.domRoot;
            delete this.renderContext
        }
    };
    
    //TODO: rename to unRender
    renderedContent.prototype.unTemplate = function(leaveDeadChildNodes) {
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
    
    renderedContent.prototype.template = function(templateId) {
        ///<summary>Render the view model with the given template</summary>
        ///<param name="templateId" type="String">A pointer to the template to apply</param>
        
        // if a previous request is pending, cancel it
        if (this.asynchronous)
            this.asynchronous.cancel();
        
        // remove old template
        if (this.__initialTemplate)
            this.unTemplate();
        
        this.asynchronous = wipeout.template.engine.instance.compileTemplate(templateId, (function (template) {
            delete this.asynchronous;
            
            // remove loading placeholder
            if (element) {
                element.parentElement.removeChild(element);
                element = null;
            }
            
            // get template builder. This generates a html string and a function to
            // add dynamic functionality after it is added to the DOM
            template = template.getBuilder();
            
            // add builder html
			debugger;
            this.prependHtml(template.html);
            
            this.__initialTemplate = true;

            // add dynamic functionality and cache dispose function
            this.disposeOfBindings = template.execute(this.renderContext);
            
            this.renderContext.$this.onRendered();
        }).bind(this));
        
        if (this.asynchronous) {            
            var element = wipeout.utils.html.createTemplatePlaceholder(this.viewModel);
            this.closingTag.parentElement.insertBefore(element, this.closingTag);
        }
    };
    
    renderedContent.prototype.dispose = function(leaveDeadChildNodes) {
        ///<summary>Dispose of this view model and viewModel element, removing it from the DOM</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
        this.unRender(leaveDeadChildNodes);
        
        if (!leaveDeadChildNodes) {
            this.closingTag.parentElement.removeChild(this.closingTag);
            this.openingTag.parentElement.removeChild(this.openingTag);
        }        
    };
        
    //TODO: test
    renderedContent.prototype.prependHtml = function (html) {
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