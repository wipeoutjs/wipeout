Class("wipeout.template.asyncLoader", function () {
    
    var asyncLoader = function asyncLoader() {
        ///<summary>Loads remote templates and runs callbacks when the template is added to the DOM</summary>
                
    };
    
    asyncLoader.prototype.load = function(templateId, success) {
        ///<summary>Load a template</summary>
        ///<param name="templateId" type="string" optional="false">The url for the template to load. This will also be the id when the template is loaded</param>
        ///<param name="success" type="Function" optional="true">Run when the template exists in the DOM</param>
        ///<returns type="Boolean">True if the template is available, false if the template must be loaded</returns>
        if (!this.pending[templateId])
            this.pending[templateId] = new loader(templateId);
            
        return this.pending[templateId].add(success || function() {});
    };
    
    function loader(templateName) {
        ///<summary>Private class for loading templates asynchronously</summary>
        ///<param name="templateName" type="string" optional="false">The name and url of this template</param>
        
        // signifies whether the template has been sucessfully loaded or not
        this._success = wipeout.viewModels.contentControl.templateExists(templateName);
        
        // specifies success callbacks for when template is loaded. If this property in null, the loading process has completed
        this._callbacks = this._success ? null : [];
        
        // the name and url of the template to load
        this.templateName = templateName;
        
        if(!this._success) {
            var _this = this;
            wipeout.utils.obj.ajax({
                type: "GET",
                url: templateName,
                success: function(result) {
                    _this._success = true;
                    var callbacks = _this._callbacks;
                    delete _this._callbacks;
                    for(var i = 0, ii = callbacks.length; i < ii; i++)
                        callbacks[i](result.responseText);
                },
                error: function() {
                    delete _this._callbacks;
                    _this._success = false;
                    throw "Could not locate template \"" + templateName + "\"";
                }
            });
        }
    }
    
    loader.prototype.add = function(success) {
        ///<summary>Call success when this template is loaded</summary>
        ///<param name="success" type="Function" optional="false">The callback</param>
        ///<returns type="Boolean">True if the template is available, false if the template must be loaded</returns>
        
        if(this._callbacks) {
            this._callbacks.push(success);
            return false;
        }
        
        if(this._success) {
            success();
            return true;
        }
        
        throw "Could not load template \"" + this.templateName + "\"";
    }
    
    asyncLoader.instance = new asyncLoader();
    
    return asyncLoader;
});