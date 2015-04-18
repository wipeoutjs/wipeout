compiler.registerClass("wipeoutDocs.viewModels.components.codeBlock", "wo.view", function() {
    var codeBlock = function(templateId) {
        this._super(templateId || "wipeoutDocs.viewModels.components.codeBlock");        
        this.code = ko.observable();
        
        this.code.subscribe(this.onCodeChanged, this);        
        this.renderCode = ko.computed(function() {
            var code = this.code();
            return code ? code.replace(/</g, "&lt;") : code;
        }, this);
    };
    
    codeBlock.prototype.onCodeChanged = function(newVal) {
    };
    
    codeBlock.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        prettyPrint(null, this.templateItems.codeBlock);
    };
    
    return codeBlock;
});