
Class("wipeout.viewModels.if", function () {
 
    var sc = true;
    var staticConstructor = function () {
        if (!sc) return;
        sc = false;
        
        _if.blankTemplateId = wipeout.viewModels.content.createAnonymousTemplate("", true);
    };
    
    var _if = wipeout.viewModels.view.extend(function _if(ifTrueId, model) {
        ///<summary>Provides if/else functionality in a template</summary> 
        ///<param name="ifTrueId" type="String" optional="true">The template id if condition is true. If not set, defaults to a blank template</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        
        staticConstructor();
        
        this._super(_if.blankTemplateId, model);

        ///<Summary type="Boolean">Specifies whether this object should be used as a binding context. If true, the binding context of this object will be it's parent. Default is true</Summary>
        this.shareParentScope = true;
        
        ///<Summary type="Boolean">if true, the template will be rendered, otherwise a blank template is rendered</Summary>
        this.condition = false;
		
        ///<Summary type="String">the template to render if the condition is true. Defaults to a blank template</Summary>
		this.ifTrueId = ifTrueId || _if.blankTemplateId;
        
        ///<Summary type="String">the template to render if the condition is false. Defaults to a blank template</Summary>
        this.ifFalseId = _if.blankTemplateId;
        
        this.observe("ifTrueId", this.reEvaluate, {context: this});
        this.observe("ifFalseId", this.reEvaluate, {context: this});
        this.observe("condition", this.reEvaluate, {context: this});
        
        ///<Summary type="String">Anonymous version of ifTrueId</Summary>
        this.ifTrue = "";
        wipeout.viewModels.content.createTemplatePropertyFor(this, "ifTrueId", "ifTrue");
        
        ///<Summary type="String">Anonymous version of ifFalseId</Summary>
        this.ifFalse = "";
        wipeout.viewModels.content.createTemplatePropertyFor(this, "ifFalseId", "ifFalse");
    });
	
    _if.addGlobalParser("ifFalse", "template");
    _if.addGlobalBindingType("ifFalse", "ifTemplateProperty");
    _if.addGlobalParser("ifTrue", "template");
    _if.addGlobalBindingType("ifTrue", "ifTemplateProperty");
    
    _if.prototype.reEvaluate = function () {
        ///<summary>Set the template id based on the true template, false template and template id</summary>
		
        if (this.condition)
			this.synchronusTemplateChange(this.ifTrueId);
		else
			this.synchronusTemplateChange(this.ifFalseId);
    };
    
    return _if;
});