
Class("wipeout.viewModels.if", function () {
 
    var sc = true;
    var staticConstructor = function () {
        if (!sc) return;
        sc = false;
        
        _if.blankTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate("", true);
    };
    
    var _if = wipeout.viewModels.view.extend(function _if(trueTemplateId, model) {
        ///<summary>The if class is a content control which provides the functionality of the knockout if binding</summary> 
        ///<param name="trueTemplateId" type="String" optional="true">The template id if condition is true. If not set, defaults to a blank template</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        
        staticConstructor();
        
        this._super(_if.blankTemplateId, model);

        ///<Summary type="Boolean">Specifies whether this object should be used as a binding context. If true, the binding context of this object will be it's parent. Default is true</Summary>
        this.shareParentScope = true;
        
        ///<Summary type="Boolean">if true, the template will be rendered, otherwise a blank template is rendered</Summary>
        this.condition = false;
		
        ///<Summary type="String">the template to render if the condition is true. Defaults to a blank template</Summary>
		this.trueTemplateId = trueTemplateId || _if.blankTemplateId;
        
        ///<Summary type="String">the template to render if the condition is false. Defaults to a blank template</Summary>
        this.falseTemplateId = _if.blankTemplateId;
        
        this.observe("trueTemplateId", this.reEvaluate, this);
        this.observe("falseTemplateId", this.reEvaluate, this);
        this.observe("condition", this.reEvaluate, this);
        
        ///<Summary type="String">Anonymous version of trueTemplateId</Summary>
        this.trueTemplate = "";
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "trueTemplateId", "trueTemplate");
        
        ///<Summary type="String">Anonymous version of falseTemplateId</Summary>
        this.falseTemplate = "";
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "falseTemplateId", "falseTemplate");
    });
	
    _if.addGlobalParser("falseTemplate", "template");
    _if.addGlobalBindingType("falseTemplate", "ifTemplateProperty");
    _if.addGlobalParser("trueTemplate", "template");
    _if.addGlobalBindingType("trueTemplate", "ifTemplateProperty");
    
    _if.prototype.reEvaluate = function () {
        ///<summary>Set the template id based on the true template, false template and template id</summary>
		
        if (this.condition)
			this.synchronusTemplateChange(this.trueTemplateId);
		else
			this.synchronusTemplateChange(this.falseTemplateId);
    };
    
    return _if;
});