
Class("wipeout.template.renderedContent", function () {
    
    var renderedContent = wipeout.base.object.extend(function renderedContent (element, name, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="name" type="String">The content of the rendered comment tags</param>
        ///<param name="parentRenderContext" type="wipeout.template.renderContext" optional="true">The render context of the parent view model</param>
                        
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
    
    //TODO: this function is too big
    renderedContent.prototype.renderArray = function (array) {
                
        this.unRender();        
        var children = [], getChild;
        
        var itemsControl = this.parentRenderContext.$this instanceof wipeout.viewModels.itemsControl && array === this.parentRenderContext.$this.items ?
            this.parentRenderContext.$this :
            null;
        
        var arrayObserve;
        var create = (function (item, index) {
            var placeholder = document.createElement("script");
            if (index >= children.length)
                this.closingTag.parentElement.insertBefore(placeholder, this.closingTag);
            else
                children[index].openingTag.parentElement.insertBefore(placeholder, children[index].openingTag);

            var output = new renderedContent(placeholder, "item: " + index, this.parentRenderContext);
            item = itemsControl ? itemsControl._createItem(item) : item;
            output.render(item);
            if (itemsControl) {
                itemsControl.onItemRendered(item);
                output.renderedChild = item;
            }
                
            return output;
        }).bind(this);
        
        enumerateArr(array, function (item, i) {
            children.push(create(item, i));            
        });
        
        if (itemsControl)
            itemsControl.__woBag.getChild = getChild = function (i) { return children[i] ? children[i].renderedChild : undefined; };
        
        if (array instanceof wipeout.base.array) {
            arrayObserve = array.observe(function (removed, added, indexes) {
                debugger;
                removed = [];
                enumerateArr(indexes.removed, function (rem) {
                    removed.push(children[rem.index]);
                });
                
                var moved = {};
                enumerateArr(indexes.moved, function (item) {
                    moved[item.to] = children[item.to];
                    
                    var toMove = moved[item.from] || children[item.from];
                    if (item.to >= children.length - 1)
                        toMove.appendTo(this.openingTag);
                    else
                        toMove.move(children[item.to].openingTag);
                        
                    children[item.to] = toMove;
                }, this);
                
                enumerateArr(indexes.added, function (added) {
                    children[added.index] = create(added.value, added.index);
                });
                
                enumerateArr(removed, function (item) {                    
                    if (itemsControl)
                        itemsControl.onItemDeleted(item.renderedChild);

                    item.dispose();
                });
                
                children.length = array.length;
            }, this);
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
        ///<param name="oldTemplateId" type="String">The previous value</param>
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
    }
    
    //TODO: test
    renderedContent.prototype.move = function (insertBefore) {
        
        var html = this.allHtml();
        for (var i = 0, ii = html.length; i < ii; i++) {
            html[i].parentElement.removeChild(html[i]);
            insertBefore.parentElement.insertBefore(html[i], insertBefore);
        }
    };
    
    //TODO: test
    renderedContent.prototype.appendTo = function (parent) {
        
        if (parent.wipeoutClosing)
            parent = parent.wipeoutClosing.openingTag;
        
        if (parent.wipeoutOpening)
            return this.move(parent.firstChild || parent.wipeoutOpening.closingTag);
        
        var html = this.allHtml();
        for (var i = html.length - 1; i >= 0; i--) {
            html[i].parentElement.removeChild(html[i]);
            parent.appendChild(html[i]);
        }
    };
    
    //TODO: test
    renderedContent.prototype.allHtml = function() {
        var output = [this.openingTag], current = this.openingTag;
        
        while (current && current !== this.closingTag) {
            output.push(current = current.nextSibling); 
        }
        
        return output;
    };
    
    return renderedContent;    
});