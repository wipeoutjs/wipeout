compiler.registerClass("wipeoutDocs.viewModels.components.jCodeBlock", "wipeoutDocs.viewModels.components.codeBlock", function () {
    var jCodeBlock = function() {
        this._super.apply(this, arguments);
    };
    
    jCodeBlock.prototype.onCodeChanged = function(newVal) {  
        new Function(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"))();
    };

    return jCodeBlock;
});