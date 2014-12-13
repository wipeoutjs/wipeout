
Class("wipeout.viewModels.if", function () {
 
    var sc = true;
    var staticConstructor = function () {
        if (!sc) return;
        sc = false;
        
        _if.blankTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate("", true);
    };
    
    var _if = wipeout.viewModels.contentControl.extend(function _if(templateId, model) {
        ///<summary>The if class is a content control which provides the functionality of the knockout if binding</summary> 
        ///<param name="templateId" type="String" optional="true">The template id. If not set, defaults to a blank template</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        
        staticConstructor();
        
        this._super(templateId, model);

        ///<Summary type="Boolean">Specifies whether this object should be used as a binding context. If true, the binding context of this object will be it's parent. Default is true</Summary>
        this.shareParentScope = true;
        
        ///<Summary type="Boolean">if true, the template will be rendered, otherwise a blank template is rendered</Summary>
        this.condition = false;
        
        ///<Summary type="String">the template to render if the condition is false. Defaults to a blank template</Summary>
        this.elseTemplateId = _if.blankTemplateId;
        
        this.observe("elseTemplateId", this.elseTemplateChanged, this);
        
        ///<Summary type="String">Anonymous version of elseTemplateId</Summary>
        this.elseTemplate = "";
        wipeout.viewModels.contentControl.createNONOBSERVABLETemplatePropertyFor(this, "elseTemplateId", "elseTemplate");
        
        ///<Summary type="String">Stores the template id if the condition is false</Summary>
        this.__cachedTemplateId = this.templateId();
        
        this.observe("condition", this.onConditionChanged, this);
        
        this.templateId.subscribe(this.copyTemplateId, this);
        
        this.copyTemplateId(this.templateId());
    });
    
    _if.prototype.elseTemplateChanged = function (oldVal, newVal) {
        ///<summary>Resets the template id to the else template if condition is not met</summary>  
        ///<param name="oldVal" type="String" optional="false">The old else template Id</param>    
        ///<param name="newVal" type="String" optional="false">The else template Id</param>   
        if (!this.condition) {
            this.templateId(newVal);
        }
    };
    
    _if.prototype.onConditionChanged = function (oldVal, newVal) {
        ///<summary>Set the template based on whether the condition is met</summary>      
        ///<param name="oldVal" type="Boolean" optional="false">The old condition</param>     
        ///<param name="newVal" type="Boolean" optional="false">The condition</param>   
        
        if (this.__oldConditionVal && !newVal) {
            this.templateId(this.elseTemplateId);
        } else if (!this.__oldConditionVal && newVal) {
            this.templateId(this.__cachedTemplateId);
        }
        
        this.__oldConditionVal = !!newVal;
    };
    
    _if.prototype.copyTemplateId = function (templateId) {
        ///<summary>Cache the template id and check whether correct template is applied</summary>  
        ///<param name="templateId" type="String" optional="false">The template id to cache</param>      
        if (templateId !== this.elseTemplateId)
            this.__cachedTemplateId = templateId;
    
        if (!this.condition && templateId !== this.elseTemplateId) {
            this.templateId(this.elseTemplateId);
        }
    };
    
    return _if;
});