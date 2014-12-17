
Class("wipeout.template.viewModelElement", function () {
    
        ///<Summary type="MutrationObserver">The mutation observer used</Summary>
    var observer = new MutationObserver(function(mutations) {
        _this.appendRemovedNodes(mutations);
    });
    
    observer.initializeOnAdded = function(element) {
    }
        
       // this._observer.observe(document.body, {childList: true, subtree: true});
    
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
        
        openingTag.setName = function(name) {        
            name = wipeout.utils.obj.trim(name);
            this.nodeValue = " " + name + " ";
            this.closingTag.nodeValue = " /" + name + " ";
        }
        
        return openingTag;
    }
    
    /*
        enumerateArr(mutations, function(mutation) {
            enumerateArr(mutation.removedNodes, function(node) {
                if(this._mutations.indexOf(node) === -1)
                    this._mutations.push(node);
            }, this);
        }, this);*/
    
    return viewModelElement;    
});