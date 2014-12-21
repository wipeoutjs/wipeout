
Class("wipeout.template.renderContext", function () {
    
    function renderContext (forVm, parentContext) {
        
        this.$data = forVm;
        this.$parents = [];
        
        if (parentContext) {
            enumerateArr(parentContext.$parents, this.$parents.push, this.$parents);
            this.$parents.push(parentContext.$data);
        }            
    }
    
    renderContext.prototype.childContext = function (forVm) {
        
        return new wipeout.template.renderContext(forVm, this);
    };
    
    return renderContext;
});