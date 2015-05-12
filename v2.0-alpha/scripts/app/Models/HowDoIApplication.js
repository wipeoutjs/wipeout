compiler.registerClass("wipeoutDocs.models.howDoIApplication", "orienteer", function() {
    
    function articleLink(title, article) {
        this.text = title;
        this.article = article;
        this.href = buildHref({article: article});
        this.visible = true;
    };
    
    var buildHref = function(parameters) {
        if(parameters.article && !wo.contentControl.templateExists("Articles." + parameters.article))
            throw "No template for " + parameters.article;
        
        var output = []
        for(var i in parameters)
            output.push(i + "=" + parameters[i]);
        
        return location.protocol + "//" + location.host + location.pathname + "?" + output.join("&");
    };
    
    function HowDoIApplication() {
        this._super();
        
        this.leftHandNav = [{
            header: new articleLink("Get started", "get-started"),
            items: [
                new articleLink("With orienteer", "get-started-with-orienteer"),
                new articleLink("With busybody", "get-started-with-busybody"),
                new articleLink("With Hello World", "get-started-with-hello-world"),  
                new articleLink("With dynamic values", "get-started-with-dynamic-values"),    
                new articleLink("With viewModels", "get-started-with-view-models"),           
                new articleLink("With View Bindings", "get-started-with-bindings"),
                new articleLink("With Functions and Events", "get-started-with-functions-and-events"),
                new articleLink("With Computeds", "get-started-with-computeds"),
                new articleLink("With lists", "get-started-with-lists"),
            ]
        }, {
            header: new articleLink("Define viewModels", "define-view-models"),
            items: [
                new articleLink("Add a default template", "add-a-default-template"),
                new articleLink("Add a default value", "add-a-default-value"),
                new articleLink("Add a function", "add-a-function"),
                new articleLink("Add a static value", "add-a-static-value"),
                new articleLink("Add a static function", "add-a-static-function"),
                new articleLink("Alter the viewModel lifecycle", "view-model-lifecycle"),
                new articleLink("Add a property binding", "add-a-property-binding"),
                new articleLink("Add a property parser", "add-a-parser"),
                new articleLink("Inherit from another viewModel", "inherit-from-another-view-model"),
            ]
        }, {        
            header: new articleLink("Bind or set properties", "bind-or-set-propertes"),
            items: [
                new articleLink("Bind to a static value", "bind-to-static-value"),      
                new articleLink("Bind to a property on the viewModel", "bind-in-scope"),
                new articleLink("Bind to a property on the model", "bind-to-model"),
                new articleLink("Bind to a property on the parent's viewModel", "bind-to-parents-view-model"),
                new articleLink("Set the model from the parent's model", "bind-to-parents-model"),
                new articleLink("Cascading models", "cascading-models"),
                new articleLink("Bind to a global value", "bind-to-global"),
                new articleLink("Set properties using XML elements", "bind-with-elements"),
                new articleLink("Find an ancestor to bind to", "bind-to-ancestor")
        ]}, {        
            header: new articleLink("Property flags", "property-flags"),
            items: [
		]}, {        
            header: new articleLink("Binding Types", "binding-types"),
            items: [
                new articleLink("One way bindings", "bind-one-way"),
                new articleLink("Two way bindings", "bind-two-way"),
                new articleLink("One way to source bindings", "bind-one-way-to-source"),
                new articleLink("Setter binding", "bind-no-way"),
                new articleLink("Change default binding", "change-default-binding"),
                new articleLink("Custom binding", "custom-binding"),
		]}, {        
            header: new articleLink("Parsers", "parsers"),
            items: [
                new articleLink("Boolean Parser", "boolean-parser"),
                new articleLink("Date Parser", "date-parser"),
                new articleLink("Float Parser", "float-parser"),
                new articleLink("Int Parser", "int-parser"),
                new articleLink("Json Parser", "json-parser"),
                new articleLink("Regexp Parser", "regexp-parser"),
                new articleLink("String Parser", "string-parser"),
		]}, {        
            header: new articleLink("Binding Filters", "filters"),
            items: [
		]}, {        
            header: new articleLink("Calling viewModel methods", "call-view-model-method"),
            items: [
        ]}, {        
            header: new articleLink("Parsing values from html", "parsing-values-from-html"),
            items: [
        ]}, {        
            header: new articleLink("Set properties using XML elements", "set-properties-using-xml-elements"),
            items: [
                new articleLink("String Properties", "set-string-property"),
                new articleLink("Boolean Properties", "set-boolean-property"),
                new articleLink("Int Properties", "set-int-property"),
                new articleLink("Float Properties", "set-float-property"),
                new articleLink("Date Properties", "set-date-property"),
                new articleLink("JSON Properties", "set-json-property"),
                new articleLink("Add custom parser", "add-property-parser"),
                new articleLink("Set Complex Properties", "set-complex-properties"),
            ]}, {
            header: new articleLink("Use the wipeout OO framework", "wipeout-oo"),
            items: [
                new articleLink("Inheritance", "inheritance"),
                new articleLink("Overriding methods", "overriding-methods"),
                new articleLink("Another extend syntax", "another-extend-syntax"),
                new articleLink("Virtual method cache", "virtual-method-cache"),
                new articleLink("Strict mode", "strict-mode")
            ]}, {        
            header: new articleLink("Use the model layer", "models"),
            items: []
        }, {        
            header: new articleLink("Use templates", "templates"),
            items: [
                new articleLink("template id", "template-id"),
                new articleLink("Referencing items in a template", "referencing-items-in-a-template"),
                new articleLink("Asynchronus templates", "asynchronous-templates"),
                new articleLink("wo.contentControl", "templates-content-control"),
            ]}, {        
            header: new articleLink("Work with lists", "working-with-lists"),
            items: [
                new articleLink("Setting the list template", "items-control-list-template"),
                new articleLink("List item lifecycle", "items-control-item-lifecycle"),
                new articleLink("Creating custom list items", "items-control-custom-items"),
                new articleLink("Self removing items", "items-control-self-removing-items")
            ]}, {        
            header: new articleLink("Control the viewModel lifecycle", "control-the-view-model-lifecycle"),
            items: []
        }, {
            header: new articleLink("Use the if control", "if-control"),
            items: []
        }, {
            header: new articleLink("Use wipeout bindings", "wipeout-bindings"),
            items: [
                new articleLink("The wipeout binding", "wipeout-binding"),
                new articleLink("The itemsControl binding", "items-control-binding"),
                new articleLink("The render binding", "render-binding"),
            ]}, {
            header: new articleLink("Work with events", "events"),
            items: [
                new articleLink("Advanced events", "advanced-events")
            ]}, {
            header: new articleLink("Work with routed events", "routed-events"),
            items: [
                new articleLink("Advanced routed events", "advanced-routed-events"),
                new articleLink("Routed event models", "routed-event-models")
            ]}, {
        
            header: new articleLink("Share Parent Scope", "share-parent-scope"),
            items: []
        }, {
            header: new articleLink("Disposing of Subscriptions", "disposing-of-subscriptions"),
            items: [
                new articleLink("Disposing using a callback", "disposing-using-a-callback"),
                new articleLink("Disposing using a disposable object", "disposing-using-a-disposable-object"),
                new articleLink("Forcing disposal", "forcing-disposal")
            ]}, {
            header: new articleLink("Wipeout Utilities", "wipeout-utilities"),
            items: []
        }, {
            header: new articleLink("Bind to a specific viewModel", "bind-to-specific-view-model"),
            items: [
                new articleLink("Knockout binding context", "knockout-binding-context"),
                new articleLink("Find a viewModel", "find-a-view-model"),
                new articleLink("Custom $find filters", "custom-find-filters"),
                new articleLink("Call a viewModel method", "call-a-view-model-method"),
                new articleLink("Find and call a viewModel method", "find-and-call-a-view-model-method")
        ]}, {        
            header: new articleLink("Wipeout native classes", "wipeout-native-classes"),
            items: []
        }, {        
            header: new articleLink("Reserved Tags", "reserved-tags"),
            items: []
        }, {        
            header: new articleLink("Profiling", "profiling"),
            items: []
        }, {        
            header: new articleLink("Wipeout namespaces", "wipeout-namespaces"),
            items: []
        }, {        
            header: new articleLink("Overriding functionality (advanced)", "overriding-functionality"),
            items: [
                new articleLink("New global functionality", "new-global-functionality"),
                new articleLink("Global Overrides", "global-overrides"),
                new articleLink("Local Overrides", "local-overrides")
            ]
        }];
        
        this.flatList = [];
        this.index();
    };
    
    HowDoIApplication.prototype.search = function(searchTerm) {
        if(!searchTerm || searchTerm.length < 2)
            searchTerm = "";
        
        var _this = this;        
        var token = this.token = {};        
        setTimeout(function() {
            if(token === _this.token)
                _this._search(searchTerm);
        }, 100);
    };
    
    HowDoIApplication.prototype._search = function(searchTerm) {
        if(!searchTerm) {
            wipeout.utils.obj.enumerateArr(this.flatList, function(item) {
                if(!item.visible)item.visible = true;
            }, this);
            
            return;
        }
        
        searchTerm = searchTerm.toLowerCase().split(/\s+/);        
        
        wipeout.utils.obj.enumerateArr(this.flatList, function(item) {
            
            var visible = true;
            var title = item.text.toLowerCase();
            for(var i = 0, ii = searchTerm.length; i < ii; i++)
                visible &= (title.indexOf(searchTerm[i]) !== -1 || item.body.indexOf(searchTerm[i]) !== -1);
            
            item.visible = visible;
        }, this);
    };
    
    HowDoIApplication.prototype.index = function() {
        this.flatList.length = 0;
        wipeout.utils.obj.enumerateArr(this.leftHandNav, function(group) {
            if(group.header)
                this.flatList.push(group.header);
            
            wipeout.utils.obj.enumerateArr(group.items, function(item) {
                this.flatList.push(item);
            }, this);
        }, this);
        
        wipeout.utils.obj.enumerateArr(this.flatList, function(item) {
            item.body = document.getElementById("Articles." + item.href.substr(item.href.indexOf("article=") + 8)).text.toLowerCase();
        }, this);        
    };
    
    return HowDoIApplication;
});