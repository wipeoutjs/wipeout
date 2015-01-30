
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
    
    // each render context has access to the global scope
    renderContext.prototype = window;
    
    renderContext.childContext = function (forVm, parentContext) {
        
        return new renderContext(forVm, parentContext);
    };
    
    renderContext.addRenderContext = function (toFunction) {
        
        return toFunction
            .toString()
            .replace(/\$this/g, "renderContext.$this")
            .replace(/\$parent/g, "renderContext.$parent");
    };
    
    return renderContext;
});