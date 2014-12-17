
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
    
    function setName(name) {        
        name = wipeout.utils.obj.trim(name);
        this.nodeValue = " " + name + " ";
        this.closingTag.nodeValue = " /" + name + " ";
    }    
    
    function init() {
        
        // ensure each node can only be rendered once
        this.init = null;
        
        this.nextSibling ? 
            this.parentElement.insertBefore(this.closingTag, this.nextSibling) : 
            this.parentElement.appendChild(this.closingTag);
        
        this.viewModel.render();
    }    
    
    function dispose() {   
        
        // ensure each node can only be disposed of once
        this.dispose = null;
        
        this.closingTag.parentElement.removeChild(this.closingTag);
        this.viewModel.dispose();
        delete this.viewModel;
    }
    
    //TODO: inherit from HTMLComment?
    function viewModelElement(name, viewModel) {
        ///<summary>A placeholder for a viewmodel</summary>
        ///<param name="name" type="String">The name of the view model</param>
        
        name = wipeout.utils.obj.trim(name);
        
        var openingTag = document.createComment(" " + name + " ");
        openingTag.closingTag = document.createComment(" /" + name + " ");        
        openingTag.viewModel = viewModel;
        
        openingTag.wipeoutOpeningTag = true;
        openingTag.closingTag.wipeoutClosingTag = true;
        
        openingTag.closingTag.openingTag = openingTag;
        
        openingTag.setName = setName;
        openingTag.dispose = dispose;
        openingTag.init = init;
        
        return openingTag;
    }
    
    return viewModelElement;    
});