
Class("wipeout.template.viewModelElement", function () {
    
    function viewModelElement (element, xmlOverride) {
        
        this.childVms = [];
        
        var vm = xmlOverride ? {
            constructor: wipeout.utils.obj.getObject(xmlOverride.name),
            name: xmlOverride.name
        } : getMeAViewModel(element);
        
        if(!vm)
            throw "Invalid view model";
        
        name = wipeout.utils.obj.trim(vm.name);
        
        this.openingTag = document.createComment(" " + name + " ");
        this.closingTag = document.createComment(" /" + name + " ");
        
        this.openingTag.wipeoutOpening = this;
        this.closingTag.wipeoutClosing = this;
                
        this.initialization = xmlOverride || wipeout.template.templateParser(wipeout.utils.html.outerHTML(element))[0];
        
        this.viewModel = new vm.constructor();
        this.viewModel.templateId.subscribe(this.template, this);
        
        element.parentElement.insertBefore(this.openingTag, element);
        element.parentElement.removeChild(element);
        
        this.init();
    }
    
    viewModelElement.prototype.getParent = function() {
        var node = this.openingTag;
        while (node = (node.previousSibling || node.parentElement)) {
            
            if (node.wipeoutOpeningTag)
                return node;
            
            if (node.wipeoutClosingTag)
                node = node.openingTag;
        }
    };
    
    viewModelElement.prototype.init = function() {
        
        this.openingTag.nextSibling ? 
            this.openingTag.parentElement.insertBefore(this.closingTag, this.openingTag.nextSibling) : 
            this.openingTag.parentElement.appendChild(this.closingTag);
                
        var tid = this.viewModel.templateId();
        
        var parent = this.getParent();
        if (parent) {
            parent.childVms.push(this);
            parent = parent.renderContext;
        } else {
            // Set root model
        }
        
        this.renderContext = new wipeout.template.renderContext(this.viewModel, parent);
        this.viewModel._initialize(this.initialization, this.renderContext);
        
        if(this.viewModel.templateId() === tid)
            this.viewModel.templateId.valueHasMutated();
    };
    
    viewModelElement.prototype.unTemplate = function(leaveChildNodes) {
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

        // TODO: test and implement - http://stackoverflow.com/questions/3785258/how-to-remove-dom-elements-without-memory-leaks
        // remove all children
        if(!leaveChildNodes)
            while (this.openingTag.nextSibling && this.openingTag.nextSibling !== this.closingTag)
                this.openingTag.nextSibling.parentNode.removeChild(this.openingTag.nextSibling);
    };
    
    viewModelElement.prototype.template = function(templateId) {
            
        this.unTemplate();

        var builder = wipeout.template.newEngine.instance.getTemplate(templateId).getBuilder();

        //TODO: hack
        var scr = document.createElement("script");
        this.openingTag.parentElement.insertBefore(scr, this.closingTag);
        scr.insertAdjacentHTML('afterend', builder.html);
        scr.parentElement.removeChild(scr);

        this.disposeOfBindings = builder.execute();
    };
    
    viewModelElement.prototype.dispose = function(leaveChildNodes) {  
        
        this.unTemplate(leaveChildNodes);        
        this.viewModel.dispose();
        this.closingTag.parentElement.removeChild(this.closingTag);
        this.openingTag.parentElement.removeChild(this.openingTag);
        delete this.viewModel;
    };
    
    return viewModelElement;    
});