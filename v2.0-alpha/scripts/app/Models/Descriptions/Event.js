compiler.registerClass("wipeoutDocs.models.descriptions.event", "wipeoutDocs.models.descriptions.classItem", function() {
    var eventDescription = function(constructorFunction, eventName, classFullName, isStatic) {
        this._super(eventName, wipeoutDocs.models.descriptions.property.getPropertySummary(constructorFunction, eventName), isStatic);
                        
        this.eventName = eventName;
        this.classFullName = classFullName;
        
        this.title = this.eventName;
    };
    
    return eventDescription;
});