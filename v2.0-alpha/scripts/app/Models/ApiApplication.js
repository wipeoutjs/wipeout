compiler.registerClass("wipeoutDocs.models.apiApplication", "objjs.object", function() {
    
    var staticContructor = function() {
        if(window.wipeoutApi) return;
		
		var parents = [
			{key: "EventTarget", value: EventTarget},	//TODO: take these out of the list
			{key: "Window", value: Window},
			{key: "Array", value: Array},
			{key: "objjs.object", value: objjs.object},
			{key: "obsjs.disposable", value: obsjs.disposable},
			{key: "obsjs.observableBase", value: obsjs.observableBase},
			{key: "obsjs.arrayBase", value: obsjs.arrayBase},
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
                
        var api = modelPointer.className.indexOf("wipeout") === 0 ?
            wipeoutApi :
            (modelPointer.className.indexOf("wo") === 0 ? woApi : null);
        
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
        var _wipeout = new wipeoutDocs.models.components.treeViewBranch("wipeout", null, [
            new wipeoutDocs.models.components.treeViewBranch("base", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.bindable"),
                /*ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.disposable"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.event"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.if"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.itemsControl"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.object"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.routedEvent"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.routedEventArgs"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.routedEventModel"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.routedEventRegistration"),                
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.view"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.base.visual")
            ]),
            new wipeoutDocs.models.components.treeViewBranch("bindings", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.bindings.bindingBase"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.bindings.ic-render"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.bindings.itemsControl"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.bindings.render"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.bindings.wipeout"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.bindings.wipeout-type"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.bindings.wo")
            ]),
            new wipeoutDocs.models.components.treeViewBranch("template", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.asyncLoader"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.engine"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.template.htmlBuilder")
            ]),
            new wipeoutDocs.models.components.treeViewBranch("utils", null, [
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.bindingDomManipulationWorker"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.call"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.domData"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.domManipulationWorkerBase"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.find"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.html"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.htmlAsync"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.ko"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.mutationObserverDomManipulationWorker"),
                ApiApplication.treeViewBranchFor(wipeoutApi, "wipeout.utils.obj")*/
            ])
        ]);
        
        var _wo = new wipeoutDocs.models.components.treeViewBranch("wo", null, [
       /*     ApiApplication.treeViewBranchFor(wipeoutApi, "wo.bindingDomManipulationWorker"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.call"),
            ApiApplication.treeViewBranchFor(woApi, "wo.contentControl"),
            ApiApplication.treeViewBranchFor(woApi, "wo.disposable"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.domData"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.domManipulationWorkerBase"),
            ApiApplication.treeViewBranchFor(woApi, "wo.event"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.find"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.html"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.htmlAsync"),
            ApiApplication.treeViewBranchFor(woApi, "wo.if"),
            ApiApplication.treeViewBranchFor(woApi, "wo.itemsControl"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.ko"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.mutationObserverDomManipulationWorker"),
            ApiApplication.treeViewBranchFor(wipeoutApi, "wo.obj"),
            ApiApplication.treeViewBranchFor(woApi, "wo.object"),
            ApiApplication.treeViewBranchFor(woApi, "wo.routedEvent"),
            ApiApplication.treeViewBranchFor(woApi, "wo.routedEventArgs"),
            ApiApplication.treeViewBranchFor(woApi, "wo.routedEventModel"),
            ApiApplication.treeViewBranchFor(woApi, "wo.routedEventRegistration"),                
            ApiApplication.treeViewBranchFor(woApi, "wo.view"),
            ApiApplication.treeViewBranchFor(woApi, "wo.visual")*/
        ]);
        
        this.menu = new wipeoutDocs.models.components.treeViewBranch("API", null, [
            _wo,
            _wipeout
        ]);
    };
    
    return ApiApplication;
});