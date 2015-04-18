
compiler.registerClass("wipeoutDocs.viewModels.components.usageCodeBlock", "wipeoutDocs.viewModels.components.codeBlock", function() {
    var usageCodeBlock = function() {
        this._super("wipeoutDocs.viewModels.components.usageCodeBlock");
        
        this.usage = ko.observable();
        
        this.showDefinitionCode = ko.observable(true);
    };
    
    usageCodeBlock.prototype.onCodeChanged = function(newVal) {  
        this.usage(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"));
    };
    
    return usageCodeBlock;
});