compiler.registerClass("wipeoutDocs.viewModels.components.codeBlock", "wo.view", function() {
    var codeBlock = function(templateId) {
        this._super(templateId || "wipeoutDocs.viewModels.components.codeBlock");        
        this.code = null;
        
        this.observe("code", this._onCodeChanged, this);   
    };
	
	codeBlock.prototype.onInitialized = function () {
		this._super();
		     
        this.computed("renderCode", function() {
            return this.code ? this.code.replace(/</g, "&lt;") : this.code;
        });
	}
    
    codeBlock.prototype._onCodeChanged = function(oldVal, newVal) {
		return this.onCodeChanged(newVal);
    };
    
    codeBlock.prototype.onCodeChanged = function(newVal) {
    };
    
    codeBlock.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        prettyPrint(null, this.templateItems.codeBlock);
        
        this.highlightParts();
    };
    
    codeBlock.prototype.highlightParts = function () {
        if (!this.highlight) return;
        
        enumerate(this.highlight instanceof Array ? this.highlight : [this.highlight], function (item) {
            $("span:contains('" + item + "')", this.templateItems.codeBlock)
                .css("font-weight", "bold").css("background", "yellow");
        }, this);
    };
    
    return codeBlock;
});