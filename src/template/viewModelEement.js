
Class("wipeout.template.viewModelElement", function () {
    
    //TODO: IE compatability
    new MutationObserver(function(mutations) {
        
        enumerateArr(mutations, function(mutation) {
            enumerateArr(mutation.removedNodes, function(node) {                
                if(node.wipeoutOpeningTag && !document.body.contains(node))
                    node.dispose();
            }, this);
            
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
                
        var dispose;
        this.viewModel = new this.vmConstructor();
        var tid = this.viewModel.templateId();
        this.viewModel.templateId.subscribe(function(newVal) {
            //this.viewModel.unTemplate();
            
            if(dispose)
                dispose();
            
            var builder = wipeout.template.newEngine.instance.getTemplate(newVal).getBuilder();
            
            //TODO: hack
            var scr = document.createElement("script");
            this.parentElement.insertBefore(scr, this.closingTag);
            scr.insertAdjacentHTML('afterend', builder.html);
            scr.parentElement.removeChild(scr);
            
            dispose = builder.execute();
        }, this);
        
        var parent = getParent(this);
        if (parent)
            parent = parent.renderContext;
        
        this.renderContext = new wipeout.template.renderContext(this.viewModel, parent);
                
        //this.viewModel._initialize(this.initialization, parent);
        if(this.viewModel.templateId() === tid)
            this.viewModel.templateId.valueHasMutated();
    }
    
    function dispose() {   
        
        // ensure each node can only be disposed of once
        this.dispose = null;
        
        // order is important
        this.viewModel.dispose();
        this.closingTag.parentElement.removeChild(this.closingTag);
        delete this.viewModel;
    }
    
    //TODO: inherit from HTMLComment?
    function viewModelElement(element, xmlOverride) {
        ///<summary>A placeholder for a viewmodel</summary>
        ///<param name="element" type="Element">The name of the element to replace with the view model</param>
        ///<param name="xmlOverride" type="wipeout.template.templateElement" optional="true">If set, the view model is initialized from this xml, not from the element</param>
        
        var vm = xmlOverride ? {
            constructor: wipeout.utils.obj.getObject(xmlOverride.name),
            name: xmlOverride.name
        }: getMeAViewModel(element);
        
        if(!vm)
            throw "Invalid view model";
        
        name = wipeout.utils.obj.trim(vm.name);
        
        var openingTag = document.createComment(" " + name + " ");
        openingTag.closingTag = document.createComment(" /" + name + " "); 
        
        openingTag.wipeoutOpeningTag = true;
        openingTag.closingTag.wipeoutClosingTag = true;
        
        openingTag.closingTag.openingTag = openingTag;
        
        openingTag.initialization = xmlOverride || wipeout.template.templateParser(wipeout.utils.html.outerHTML(element))[0];
        openingTag.vmConstructor = vm.constructor;
        
        element.parentElement.insertBefore(openingTag, element);
        element.parentElement.removeChild(element);
        
        openingTag.dispose = dispose;
        openingTag.init = init;
        
        return openingTag;
    }
    
    return viewModelElement;    
});