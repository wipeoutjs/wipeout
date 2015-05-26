
compiler.registerClass("wipeoutDocs.viewModels.apiApplication", "wipeoutDocs.viewModels.application", function() {
    
    function ApiApplication() {
        this._super("wipeoutDocs.viewModels.apiApplication");
		
		this.observe("model.content.title", function (oldVal, newVal) {
			$("#headerText").html(newVal);
		});
    };
    
    ApiApplication.prototype.onApplicationInitialized = function() { 
        this._super();
    };
    
    ApiApplication.prototype.route = function(query) { 
        var temp = wipeoutDocs.models.apiApplication.getModel(query);        
        if (temp)
            this.model.content = temp;
    };
    
    ApiApplication.prototype.routeTo = function(item) {
        history.pushState(null, '', wipeoutDocs.models.apiApplication.routableUrl(item));
        crossroads.parse(location.pathname + location.search);
    };
    
    return ApiApplication;
});