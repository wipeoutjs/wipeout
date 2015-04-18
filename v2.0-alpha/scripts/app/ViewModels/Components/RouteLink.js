compiler.registerClass("wipeout.rl", "wo.view", function() {
    var RouteLink = function() {
        this._super("wipeoutDocs.viewModels.components.routeLink");
    };
    
    RouteLink.prototype.onRendered = function(oldValues, newValues) {
        this._super(oldValues, newValues);
        
        $(this.templateItems.link).on("click", function(e) {
            if(e.button === 1)
                return;
            
            e.preventDefault();
            window.history.pushState(null, "", this.href);
            crossroads.parse(location.pathname + location.search);
        });
    }
    
    return RouteLink;
});