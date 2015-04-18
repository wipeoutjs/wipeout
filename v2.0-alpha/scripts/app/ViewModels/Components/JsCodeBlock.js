compiler.registerClass("wipeoutDocs.viewModels.components.JsCodeBlock", "wipeoutDocs.viewModels.components.codeBlock", function () {
    var jsCodeBlock = function() {
        this._super.apply(this, arguments);
    };
    
    jsCodeBlock.prototype.onCodeChanged = function(newVal) {  
        new Function(newVal
            .replace(/\&lt;/g, "<")
            .replace(/\&amp;/g, "&")
            .replace(/\&gt;/g, ">"))();
    };

    return jsCodeBlock;
});