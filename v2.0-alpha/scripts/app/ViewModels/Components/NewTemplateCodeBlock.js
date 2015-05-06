compiler.registerClass("wipeoutDocs.viewModels.components.newTemplateCodeBlock", "wipeoutDocs.viewModels.components.templateCodeBlock", function() {
    var newTemplateCodeBlock = function() {
        this._super.apply(this, arguments);
    };
    
    newTemplateCodeBlock.prototype.onCodeChanged = function(newVal) {
        
        if (this.newScriptId) {
            var oldScript = document.getElementById(this.newScriptId);
            if (oldScript)
                oldScript.parentElement.removeChild(oldScript);
                
            delete wipeout.template.engine.instance.templates[this.newScriptId];
        }
        
        return this._super.apply(this, arguments);
    };
    
    newTemplateCodeBlock.prototype.getTemplateHtml = function(newVal) {
        
        if(!this.newScriptId) throw "You must specify a script id";
        
        return '<script type="text/xml" id="' + 
            this.newScriptId + '">' + 
            this._super(newVal.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">")) + 
            "</script>";
    };
    
    return newTemplateCodeBlock;
});