
Class("wipeout.template.viewModelElement", function () {
    
    function viewModelElement(name/*, viewModel?*/) {
        ///<summary>A placeholder for a viewmodel</summary>
        ///<param name="name" type="String">The name of the view model</param>
        
        name = wipeout.utils.obj.trim(name);
        this.openingTag = document.createComment(" " + name + " ");
        this.closingTag = document.createComment(" /" + name + " ");
        
        this.openingTag.wipeoutOpeningTag = true;
        this.closingTag.wipeoutClosingTag = true;
        
        this.openingTag.closingTag = this.closingTag;
        this.closingTag.openingTag = this.openingTag;
    }
    
    return viewModelElement;    
});