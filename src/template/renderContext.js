
Class("wipeout.template.renderContext", function () {
    
    // warning: do not make observable. This will create a LOT of un necessary subscriptions
    function renderContext (forVm, parentContext) {
        
        this.$this = forVm;
        this.$parents = [];
        this.$parent = null;
        
        if (parentContext) {
            this.$parent = parentContext.$this;
            this.$parents.push(this.$parent);
            enumerateArr(parentContext.$parents, this.$parents.push, this.$parents);
        }            
    }
    
    renderContext.prototype.childContext = function (forVm) {
        
        return new wipeout.template.renderContext(forVm, this);
    };
    
    renderContext.addRenderContext = function (toFunction) {
        
        return toFunction
            .toString()
            .replace(/\$this/g, "renderContext.$this")
            .replace(/\$parent/g, "renderContext.$parent");
    };
    
    return renderContext;
});