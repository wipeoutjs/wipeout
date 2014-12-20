
Class("wipeout.template.viewModelElement", function () {
    
    //TODO: IE compatability
    new MutationObserver(function(mutations) {
        
        enumerateArr(mutations, function(mutation) {
            
           /* enumerateArr(mutation.removedNodes, function(node) {                
                if(node.wipeoutOpeningTag)
                    node.dispose();
            }, this);*/
            
            enumerateArr(mutation.addedNodes, function(node) {                
                if(node.wipeoutOpeningTag && document.body.contains(node))
                    node.init();
            }, this);
        }, this);
        
    }).observe(document.body, {childList: true, subtree: true});
    
    function getParent(node) {
        while (node = (node.previousSibling || node.parentElement)) {
            
            if (node.wipeoutOpeningTag)
                return node;
            
            if (node.wipeoutClosingTag)
                node = node.openingTag;
        }
    }
    
    function init() {
        
        // ensure each node can only be rendered once
        this.init = null;
        
        this.nextSibling ? 
            this.parentElement.insertBefore(this.closingTag, this.nextSibling) : 
            this.parentElement.appendChild(this.closingTag);
                
        var tid = this.viewModel.templateId();
        
        var parent = getParent(this);
        if (parent) {
            parent.childVms.push(this);
            parent = parent.renderContext;
        }
        
        this.renderContext = new wipeout.template.renderContext(this.viewModel, parent);
                
        //this.viewModel._initialize(this.initialization, parent);
        if(this.viewModel.templateId() === tid)
            this.viewModel.templateId.valueHasMutated();
    }
    
    function unTemplate(leaveChildNodes) {
        
        //dispose of child vms
        enumerateArr(this.childVms, function (item) {
            item.dispose(true);
        });
        
        this.childVms.length = 0;
            
        // dispose of bindings
        if (this.disposeOfBindings) {
            this.disposeOfBindings();
            delete this.disposeOfBindings;
        }

        // remove all children
        if(!leaveChildNodes)
            while (this.nextSibling && this.nextSibling !== this.closingTag)
                this.nextSibling.parentNode.removeChild(this.nextSibling);
    }
    
    function template(templateId) {
            
        this.unTemplate();

        var builder = wipeout.template.newEngine.instance.getTemplate(templateId).getBuilder();

        //TODO: hack
        var scr = document.createElement("script");
        this.parentElement.insertBefore(scr, this.closingTag);
        scr.insertAdjacentHTML('afterend', builder.html);
        scr.parentElement.removeChild(scr);

        this.disposeOfBindings = builder.execute();
    }
    
    function dispose(leaveChildNodes) {          
        this.unTemplate(leaveChildNodes);        
        this.viewModel.dispose();
        this.closingTag.parentElement.removeChild(this.closingTag);
        delete this.viewModel;
        this.parentElement.removeChild(this);
    }
    
    //TODO: inherit from HTMLComment?
    function viewModelElement(element, xmlOverride) {
        ///<summary>A placeholder for a viewmodel</summary>
        ///<param name="element" type="Element">The name of the element to replace with the view model</param>
        ///<param name="xmlOverride" type="wipeout.template.templateElement" optional="true">If set, the view model is initialized from this xml, not from the element</param>
        
        var vm = xmlOverride ? {
            constructor: wipeout.utils.obj.getObject(xmlOverride.name),
            name: xmlOverride.name
        } : getMeAViewModel(element);
        
        if(!vm)
            throw "Invalid view model";
        
        name = wipeout.utils.obj.trim(vm.name);
        
        var openingTag = document.createComment(" " + name + " ");
        openingTag.closingTag = document.createComment(" /" + name + " "); 
        
        openingTag.wipeoutOpeningTag = true;
        openingTag.closingTag.wipeoutClosingTag = true;
        
        openingTag.closingTag.openingTag = openingTag;
        
        openingTag.initialization = xmlOverride || wipeout.template.templateParser(wipeout.utils.html.outerHTML(element))[0];
        
        openingTag.viewModel = new vm.constructor();
        openingTag.viewModel.templateId.subscribe(template, openingTag);
        
        element.parentElement.insertBefore(openingTag, element);
        element.parentElement.removeChild(element);
        
        openingTag.childVms = [];
        
        openingTag.init = init;
        openingTag.template = template;
        openingTag.unTemplate = unTemplate;
        openingTag.dispose = dispose;
        
        return openingTag;
    }
    
    return viewModelElement;    
});