
Class("wipeout.viewModels.visual", function () {
    
    var visual = wipeout.base.bindable.extend(function visual (templateId) {
        ///<summary>Base class for anything with a visual element. Interacts with the wipeout template engine to render content</summary>
        ///<param name="templateId" type="String" optional="true">A default template id</param>
        this._super();

        ///<Summary type="Boolean">Specifies whether this object should be used as a binding context. If true, the binding context of this object will be it's parent. Default is false</Summary>
        this.shareParentScope = false;

        ///<Summary type="Object">Dictionary of items created within the current template. The items can be visuals or html elements</Summary>
        this.templateItems = {};

        ///<Summary type="ko.observable" generic0="String">The template of the visual, giving it an appearance</Summary>
        this.templateId = templateId || visual.getDefaultTemplateId();

        //TODO: most of this is to do with old templating
        ///<Summary type="Object">A bag to put objects needed for the lifecycle of this object and its properties</Summary>
        this.__woBag.disposed = wipeout.events.event();
        this.__woBag.createdByWipeout = false;
        this.__woBag.rootHtmlElement = null;
        this.__woBag.routedEventSubscriptions = [];
        this.__woBag.nodes = [];
    });
    
    visual.getDefaultTemplateId = (function () {
        var templateId = null;
        return function () {
            ///<summary>Returns the Id for the default template</summary>   
            ///<returns type="String">The Id for an default template</returns>     

            return templateId || (templateId = wipeout.viewModels.contentControl.createAnonymousTemplate("<span>No template has been specified</span>"));
        };
    })();
    
    visual.getBlankTemplateId = (function () {
        var templateId = null;
        return function () {
            ///<summary>Returns the Id for an empty template</summary>    
            ///<returns type="String">The Id for an empty template</returns>    
            if (!templateId) {
                templateId = wipeout.viewModels.contentControl.createAnonymousTemplate("");
            }

            return templateId;
        };
    })();
    
    visual.visualGraph = function (rootElement, displayFunction) {
        ///<summary>Compiles a tree of all visual elements in a block of html, starting at the rootElement</summary>    
        ///<param name="rootElement" type="HTMLNode" optional="false">The root node of the visual tree</param>
        ///<param name="displayFunction" type="Function" optional="true">A function to convert view models found into a custom type</param>
        ///<returns type="Array" generic0="Object">The visual graph</returns>

        throw "TODO";
        
        /*if (!rootElement)
            return [];

        displayFunction = displayFunction || function() { return typeof arguments[0]; };

        var output = [];
        wipeout.utils.obj.enumerateArr(wipeout.utils.html.getAllChildren(rootElement), function (child) {
            wipeout.utils.obj.enumerateArr(visual.visualGraph(child), output.push, output);
        });

        var vm = wipeout.utils.domData.get(rootElement, wipeout.bindings.wipeout.utils.wipeoutKey);        
        if (vm) {
            return [{ viewModel: vm, display: displayFunction(vm), children: output}];
        }

        return output;*/
    };
    
    visual.prototype.dispose = function() {
        ///<summary>Dispose of this visual</summary>

        this._super();

        // dispose of routed event subscriptions
        enumerateArr(this.__woBag.routedEventSubscriptions.splice(0, this.__woBag.routedEventSubscriptions.length), function(event) {
            event.dispose();
        });

        this.__woBag.disposed.trigger();
    };
    
    visual.prototype.entireViewModelHtml = function() {
        ///<summary>Gets all of the html nodes included in this view model</summary>
        ///<returns type="Array" generic0="Node">The html elements</returns>
        
        if(this.__woBag.rootHtmlElement) {
            if (this.__woBag.rootHtmlElement.nodeType === 1) {
                return [this.__woBag.rootHtmlElement];
            } else if (wipeout.utils.ko.isVirtual(this.__woBag.rootHtmlElement)) {
                // add root element
                var output = [this.__woBag.rootHtmlElement];
                
                wipeout.utils.ko.enumerateOverChildren(this.__woBag.rootHtmlElement, function(child) {
                    output.push(child);
                    if(wipeout.utils.ko.isVirtual(child))
                        output.push(wipeout.utils.ko.getClosingTag(child));
                });
                
                var last = output[output.length - 1].nextSibling;
                
                if(!wipeout.utils.ko.isVirtualClosing(last))
                    throw "Could not compile view model html";

                output.push(last);
                return output;
            }
        }

        // visual has not been redered
        return [];
    };
    
    visual.prototype.getRootHtmlElement = function() {
        ///<summary>Get the root of this view model. Unless rendered manually using the render binding, it will be a knockout virtual element</summary>
        ///<returns type="Node">The root element</returns>
        return this.__woBag.rootHtmlElement;
    };
    
    visual.prototype.getParents = function(includeSharedParentScopeItems) {
        ///<summary>Gets an array of the entire tree of ancestor visual objects</summary>
        ///<param name="includeSharedParentScopeItems" type="Boolean" optional="true">Set to true if items marked with shareParentScope can be returned</param>
        ///<returns type="Array" generic0="wo.view" arrayType="wo.view">A tree of ancestor view models</returns>
        var current = this.getParent(includeSharedParentScopeItems);
        var parents = [];
        while(current) {
            parents.push(current);
            current = current.getParent(includeSharedParentScopeItems);
        }

        return parents;
    };
    
    visual.prototype.getParent = function(includeShareParentScopeItems) {
        ///<summary>Get the parent visual of this visual</summary> 
        ///<param name="includeSharedParentScopeItems" type="Boolean" optional="true">Set to true if items marked with shareParentScope can be returned</param>
        ///<returns type="wo.view">The parent view model</returns>
        var pe;
        var parent = !this.__woBag.rootHtmlElement || !(pe = wipeout.utils.ko.parentElement(this.__woBag.rootHtmlElement)) ?
            null :
            wipeout.utils.html.getViewModel(pe);

        return includeShareParentScopeItems || !parent || !parent.shareParentScope ?
            parent :
            parent.getParent(includeShareParentScopeItems);
    };
    
    visual.prototype.unRegisterRoutedEvent = function(routedEvent, callback, callbackContext /* optional */) {  
        ///<summary>Unregister from a routed event. The callback and callback context must be the same as those passed in during registration</summary>  
        ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to un register from</param>
        ///<param name="callbackContext" type="Any" optional="true">The original context passed into the register function</param>
        ///<returns type="Boolean">Whether the event registration was found or not</returns>         

        for(var i = 0, ii = this.__woBag.routedEventSubscriptions.length; i < ii; i++) {
            if(this.__woBag.routedEventSubscriptions[i].routedEvent === routedEvent) {
                this.__woBag.routedEventSubscriptions[i].event.unRegister(callback, callbackContext);
                return true;
            }
        }  

        return false;
    };
    
    visual.prototype.registerRoutedEvent = function(routedEvent, callback, callbackContext, priority) {
        ///<summary>Register for a routed event</summary>   
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="callbackContext" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty. Event priority does not affect event bubbling order</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         

        var rev;
        for(var i = 0, ii = this.__woBag.routedEventSubscriptions.length; i < ii; i++) {
            if(this.__woBag.routedEventSubscriptions[i].routedEvent === routedEvent) {
                rev = this.__woBag.routedEventSubscriptions[i];
                break;
            }
        }

        if(!rev) {
            rev = new wipeout.events.routedEventRegistration(routedEvent);
            this.__woBag.routedEventSubscriptions.push(rev);
        }

        return rev.event.register(callback, callbackContext, priority);
    };
    
    visual.prototype.triggerRoutedEvent = function(routedEvent, eventArgs) {
        ///<summary>Trigger a routed event. The event will bubble upwards to all ancestors of this visual. Overrides wo.object.triggerRoutedEvent</summary>        
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="eventArgs" type="Any" optional="true">The event args to bubble up with the routed event</param>
        
        // create routed event args if neccessary
        if(!(eventArgs instanceof wipeout.events.routedEventArgs)) {
            eventArgs = new wipeout.events.routedEventArgs(eventArgs, this);
        }

        // trigger event on this
        for(var i = 0, ii = this.__woBag.routedEventSubscriptions.length; i < ii; i++) {
            if(eventArgs.handled) return;
            if(this.__woBag.routedEventSubscriptions[i].routedEvent === routedEvent) {
                this.__woBag.routedEventSubscriptions[i].event.trigger(eventArgs);
            }
        }
        
        // trigger event on model
        if(eventArgs.handled) return;
        if(this.model instanceof wipeout.events.routedEventModel) {
            this.model.routedEventTriggered(routedEvent, eventArgs);
        }

        // trigger event on parent
        if(eventArgs.handled) return;
        var nextTarget = this.getParent();
        if(nextTarget) {
            nextTarget.triggerRoutedEvent(routedEvent, eventArgs);
        }
    };
    
    // virtual
    visual.prototype.onRendered = function (oldValues, newValues) {
        ///<summary>Triggered each time after a template is rendered</summary>   
        ///<param name="oldValues" type="Array" generic0="HTMLNode" optional="false">A list of HTMLNodes removed</param>
        ///<param name="newValues" type="Array" generic0="HTMLNode" optional="false">A list of HTMLNodes rendered</param>
    };
    
    // virtual
    visual.prototype.onUnrendered = function () {
        ///<summary>Triggered just before a visual is un rendered</summary>    
    };
    
    // virtual
    visual.prototype.onApplicationInitialized = function () {
        ///<summary>Triggered after the entire application has been initialized. Will only be triggered on the viewModel created directly by the wipeout binding</summary>    
    };
    
    // list of html tags which will not be treated as objects
    var reservedTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "head", "header", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
    
    visual.reservedTags = {};
    enumerateArr(reservedTags, function(tag) {
        visual.reservedTags[tag] = true;
    });
    
    visual.addGlobalParser("id", "string");
    
    return visual;
});