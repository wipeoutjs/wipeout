compiler.registerClass("wipeoutDocs.models.apiApplication", "busybody.observable", function() {
    
    var staticContructor = function() {
        if(window.wipeoutApi) return;
		
		var parents = [
			{key: "Array", value: Array},
			{key: "orienteer", value: orienteer},
			{key: "busybody.disposable", value: busybody.disposable},
			{key: "busybody.observableBase", value: busybody.observableBase},
			{key: "busybody.observable", value: busybody.observable},
			{key: "busybody.arrayBase", value: busybody.arrayBase},
			{key: "busybody.array", value: busybody.array},
			{key: "wipeout.base.bindable", value: wipeout.base.bindable}
		];
		
        wipeoutApi = new wipeoutDocs.models.components.apiBuilder(wipeout, "wipeout")
            .build({
                knownParents: parents, 
                filter: function(i) {
                    return i.key.indexOf("wipeout.debug") !== 0 && i.key.indexOf("wipeout.profile") !== 0;
                }
            });
		
        woApi = new wipeoutDocs.models.components.apiBuilder(wo, "wo").build({knownParents: parents});
		
		orienteerApi = new wipeoutDocs.models.components.apiBuilder(orienteer, "orienteer").build();
		
		busybodyApi = new wipeoutDocs.models.components.apiBuilder(busybody, "busybody").build({knownParents: parents});
    };
    
    ApiApplication.routableUrl = function(item) {
        staticContructor();
        
        if(item instanceof wipeoutDocs.models.descriptions.class)
            output = "type=api&className=" + item.classFullName;
        else if(item instanceof wipeoutDocs.models.descriptions.event)
            output = "type=api&className=" + item.classFullName + "&eventName=" + item.eventName + "&isStatic=" + item.isStatic;
        else if(item instanceof wipeoutDocs.models.descriptions.property)
            output = "type=api&className=" + item.classFullName + "&propertyName=" + item.propertyName + "&isStatic=" + item.isStatic;
        else if(item instanceof wipeoutDocs.models.descriptions.function)
            output = "type=api&className=" + item.classFullName + "&functionName=" + item.functionName + "&isStatic=" + item.isStatic;
        else if(item instanceof wipeoutDocs.models.descriptions.class)
            output = "type=Home";
        else
            throw "Unknown page type";
        
        return location.origin + location.pathname + "?" + output;
    };
    
    ApiApplication.getModel = function(modelPointer) {
        staticContructor();
        
        if(!modelPointer) return null;
                
        switch (modelPointer.type) {
            case "api":
                return ApiApplication.getApiModel(modelPointer);             
        }
        
        return null;
    };
    
    parseBool = function(item) {
        return item && item.toLowerCase() !== "false";
    }
    
    ApiApplication.getApiModel = function(modelPointer) {
        staticContructor();
                
        var api = null;
		if (modelPointer.className.indexOf("wipeout") === 0)
			api = wipeoutApi;
		else if (modelPointer.className.indexOf("wo") === 0)
			api = woApi;
		else if (modelPointer.className.indexOf("orienteer") === 0)
			api = orienteerApi;
		else if (modelPointer.className.indexOf("busybody") === 0)
			api = busybodyApi;
        
        if(!api) return null;
        
        var _class = api.forClass(modelPointer.className);
        if(_class) {
            if(modelPointer.eventName)
                return _class.getEvent(modelPointer.eventName, parseBool(modelPointer.isStatic));
            if(modelPointer.propertyName)
                return _class.getProperty(modelPointer.propertyName, parseBool(modelPointer.isStatic));
            if(modelPointer.functionName)
                return _class.getFunction(modelPointer.functionName, parseBool(modelPointer.isStatic));
        }
        
        return _class;        
    };
    
    ApiApplication.getSubBranches = function(classDescription) {   
        staticContructor();
        
        var output = [];
        
        enumerate(classDescription.staticEvents, function(event) {
            output.push(new wipeoutDocs.models.components.treeViewBranch(event.eventName, ApiApplication.routableUrl(event)));            
        });
        
        enumerate(classDescription.staticProperties, function(property) {
            output.push(new wipeoutDocs.models.components.treeViewBranch(property.propertyName, ApiApplication.routableUrl(property)));
        });
        
        enumerate(classDescription.staticFunctions, function(_function) {
            output.push(new wipeoutDocs.models.components.treeViewBranch(_function.functionName, ApiApplication.routableUrl(_function)));
        });
        
        enumerate(classDescription.events, function(event) {
            output.push(new wipeoutDocs.models.components.treeViewBranch(event.eventName, ApiApplication.routableUrl(event)));            
        });
        
        enumerate(classDescription.properties, function(property) {
            output.push(new wipeoutDocs.models.components.treeViewBranch(property.propertyName, ApiApplication.routableUrl(property)));            
        });
        
        enumerate(classDescription.functions, function(_function) {
            output.push(new wipeoutDocs.models.components.treeViewBranch(_function.functionName, ApiApplication.routableUrl(_function)));            
        });
        
        output.sort(function() { return arguments[0].name.localeCompare(arguments[1].name); });
        return output;
    };
    
    ApiApplication.treeViewBranchFor = function(api, classFullName) {
        staticContructor();
        
        var friendlyName = classFullName.split(".");
        friendlyName = friendlyName[friendlyName.length - 1];
        
        var definition = api.forClass(classFullName);
        for (var i = definition.staticProperties.length - 1; i >= 0; i--)
            if(definition.staticProperties[i].name === "__woName")
                definition.staticProperties.splice(i, 1);
        
        return new wipeoutDocs.models.components.treeViewBranch(
            friendlyName, 
            ApiApplication.routableUrl(definition), 
            ApiApplication.getSubBranches(definition));
    };
    
    function ApiApplication() {
        staticContructor();
        
        this._super();
        
        this.content = new wipeoutDocs.models.pages.landingPage();
        var _busybody = new wipeoutDocs.models.components.treeViewBranch("busybody", null, [
            new wipeoutDocs.models.components.treeViewBranch("callbacks", null, [
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.callbacks.arrayCallback"),
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.callbacks.changeCallback"),
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.callbacks.propertyCallback"),
			]),
            new wipeoutDocs.models.components.treeViewBranch("observeTypes", null, [
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.observeTypes.computed"),
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.observeTypes.observeTypesBase"),
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.observeTypes.pathObserver"),
			]),
            new wipeoutDocs.models.components.treeViewBranch("utils", null, [
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.utils.compiledArrayChange"),
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.utils.executeCallbacks"),
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.utils.obj"),
				ApiApplication.treeViewBranchFor(busybodyApi, "busybody.utils.observeCycleHandler"),
			]),
			ApiApplication.treeViewBranchFor(busybodyApi, "busybody.array"),
			ApiApplication.treeViewBranchFor(busybodyApi, "busybody.arrayBase"),
			ApiApplication.treeViewBranchFor(busybodyApi, "busybody.disposable"),
			ApiApplication.treeViewBranchFor(busybodyApi, "busybody.observable"),
			ApiApplication.treeViewBranchFor(busybodyApi, "busybody.observableBase")
		]);
				
        var _wipeout = new wipeoutDocs.models.components.treeViewBranch("wipeout", null, [
            new wipeoutDocs.models.components.treeViewBranch("base", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.bindable")
            ]),
            new wipeoutDocs.models.components.treeViewBranch("events", null, [
				ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.events.event"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.events.routedEventArgs"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.events.routedEventModel")
			]),
            new wipeoutDocs.models.components.treeViewBranch("htmlBindingTypes", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.ifTemplateProperty"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.nb"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.ow"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.owts"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.setTemplateToTemplateId"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.shareParentScope"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.templateElementSetter"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.templateProperty"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.tw"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.htmlBindingTypes.viewModelId")
			]),
            new wipeoutDocs.models.components.treeViewBranch("polyfills", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.polyfills.Array"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.polyfills.Function")
			]),
            /*new wipeoutDocs.models.components.treeViewBranch("profile", null, [
			]),*/
            new wipeoutDocs.models.components.treeViewBranch("template", null, [
            	new wipeoutDocs.models.components.treeViewBranch("initialization", null, [
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.initialization.compiledInitializer"),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.initialization.parsers"),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.initialization.viewModelPropertyValue"),
				]),
            	new wipeoutDocs.models.components.treeViewBranch("rendering", null, [
					new wipeoutDocs.models.components.treeViewBranch("htmlAttributes", null, [
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-attr"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-class"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-content"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-data"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-event"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.id"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-render"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-style"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-value"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wo-visible"),
                		ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlAttributes.wipeoutCreateViewModel")
					]),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.builder"),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.compiledTemplate"),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.htmlPropertyValue"),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.renderedArray"),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.renderedContent"),
                	ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.rendering.viewModelElement")
				]),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.context"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.engine"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.filters"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.loader"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.propertyValue"),
			]),
            new wipeoutDocs.models.components.treeViewBranch("utils", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.dictionary"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.domData"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.find"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.html"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.jsParse"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.obj"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.viewModels")
			]),
            new wipeoutDocs.models.components.treeViewBranch("viewModels", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.viewModels.contentControl"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.viewModels.if"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.viewModels.itemsControl"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.viewModels.view")
			]),
            new wipeoutDocs.models.components.treeViewBranch("wml", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.wml.wmlAttribute"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.wml.wmlComment"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.wml.wmlElement"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.wml.wmlElementBase"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.wml.wmlParser"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.wml.wmlString")
			]),
			ApiApplication.treeViewBranchFor(wipeoutApi, "wo.viewModel")
        ]);
		
        var _wo = new wipeoutDocs.models.components.treeViewBranch("wo", null, [
            ApiApplication.treeViewBranchFor(woApi, "wo.addHtmlAttribute"),
			ApiApplication.treeViewBranchFor(woApi, "wo.contentControl"),
            ApiApplication.treeViewBranchFor(woApi, "wo.filters"),
            ApiApplication.treeViewBranchFor(woApi, "wo.findFilters"),
            ApiApplication.treeViewBranchFor(woApi, "wo.if"),
            ApiApplication.treeViewBranchFor(woApi, "wo.bindings"),
            ApiApplication.treeViewBranchFor(woApi, "wo.itemsControl"),
            ApiApplication.treeViewBranchFor(woApi, "wo.parsers"),
            ApiApplication.treeViewBranchFor(woApi, "wo.triggerEvent"),
            ApiApplication.treeViewBranchFor(woApi, "wo.view")
        ]);
        
        this.menu = new wipeoutDocs.models.components.treeViewBranch("API", null, [
            _wo,
			ApiApplication.treeViewBranchFor(orienteerApi, "orienteer"),
            _busybody,
            _wipeout
        ]);
    };
    
    return ApiApplication;
});