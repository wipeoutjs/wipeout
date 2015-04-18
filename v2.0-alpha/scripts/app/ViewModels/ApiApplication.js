
compiler.registerClass("wipeoutDocs.viewModels.apiApplication", "wipeoutDocs.viewModels.application", function() {
    
    function ApiApplication() {
        this._super("wipeoutDocs.viewModels.apiApplication");
        
        this.registerDisposable(ko.computed(function() {
            var tmp;
            if( (tmp = this.model()) &&
                (tmp = tmp.content()))
                    $("#headerText").html(tmp.title);
        }, this));
    };
    
    ApiApplication.prototype.route = function(query) { 
        var temp = wipeoutDocs.models.apiApplication.getModel(query);        
        if (temp)
            this.model().content(temp);
    };
    
    ApiApplication.prototype.routeTo = function(item) {
        history.pushState(null, '', wipeoutDocs.models.apiApplication.routableUrl(item));
        crossroads.parse(location.pathname + location.search);
    };
    
    ApiApplication.prototype.onRendered = function() {
        this._super.apply(this, arguments);
        
        //TODO: this
        this.templateItems.treeView.select();
    };
    
    return ApiApplication;
});