
Class("wipeout.template.templateLoader", function () {
    
    function templateLoader(templateName) {
        ///<summary>Private class for loading templates asynchronously</summary>
        ///<param name="templateName" type="string" optional="false">The name and url of this template</param>
        
        // specifies success callbacks for when template is loaded. If this property in null, the loading process has completed
        this._callbacks = [];
        
        // the name and url of the template to load
        this.templateName = templateName;
        
        wipeout.utils.obj.ajax({
            type: "GET",
            url: templateName,
            success: (function(result) {
                this._success = true;
                var callbacks = this._callbacks;
                delete this._callbacks;
				
				this.templateValue = result.responseText;
                for(var i = 0, ii = callbacks.length; i < ii; i++)
                    callbacks[i](this.templateValue);
            }).bind(this),
            error: (function() {
                delete this._callbacks;
                this._success = false;
                throw "Could not locate template \"" + templateName + "\"";
            }).bind(this)
        });
    }
    
    templateLoader.prototype.add = function(success) {
        ///<summary>Call success when this template is loaded</summary>
        ///<param name="success" type="Function" optional="false">The callback</param>
        ///<returns type="Boolean">True if the template is available, false if the template must be loaded</returns>
        
        if (this._callbacks) {
            this._callbacks.push(success);
            
            return {
                cancel: (function() {
                    var i;
                    if (this._callbacks && (i = this._callbacks.indexOf(success)) !== -1)
                        this._callbacks.splice(i, 1);
                }).bind(this)
            };
        }
        
        if (this._success) {
            success(this.templateValue);
            return null;
        }
        
        throw "Could not load template \"" + this.templateName + "\"";
    }
	
	return templateLoader;
});