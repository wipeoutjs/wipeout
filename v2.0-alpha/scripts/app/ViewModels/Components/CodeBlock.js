compiler.registerClass("wipeoutDocs.viewModels.components.codeBlock", "wo.view", function() {
    var codeBlock = function(templateId) {
        this._super(templateId || "wipeoutDocs.viewModels.components.codeBlock");        
        this.code = null;
        
        this.code.subscribe(this.onCodeChanged, this);        
        this.computed("renderCode", function() {
            return this.code ? this.code.replace(/</g, "&lt;") : this.code;
        });
    };
    
    codeBlock.prototype.onCodeChanged = function(newVal) {
    };
    
    codeBlock.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        prettyPrint(null, this.templateItems.codeBlock);
    };
    
    return codeBlock;
});