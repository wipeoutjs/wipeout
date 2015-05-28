
Class("wipeout.events.routedEvent", function () {
    
    var routedEvent = function routedEvent() {
        ///<summary>A routed event is triggered on a view and travels up to ancestor views all the way to the root of the application</summary>
        
        // allow for non use of the new key word
        if(!(this instanceof routedEvent))
           return new routedEvent();
    };

    routedEvent.prototype.trigger = function(triggerOnView, eventArgs) {
        ///<summary>Trigger a routed event on a view</summary>
        ///<param name="triggerOnView" type="wo.view" optional="false">The view where the routed event starts</param>
        ///<param name="eventArgs" type="Any" optional="true">The event args to bubble up with the routed event</param>
        
        triggerOnView.triggerRoutedEvent(this, new wipeout.events.routedEventArgs(eventArgs, triggerOnView));
    };
    
    routedEvent.prototype.unRegister = function (callback, triggerOnView, context /* optional */) {
        ///<summary>Unregister a routed event on a view</summary>
        ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
        ///<param name="triggerOnView" type="wo.view" optional="false">The view passed into the register function</param>
        ///<param name="context" type="Any" optional="true">The original context passed into the register function</param>
        ///<returns type="Boolean">Whether the event registration was found or not</returns>         
        return triggerOnView.unRegisterRoutedEvent(this, callback, context);
    };
    
    routedEvent.prototype.register = function(callback, triggerOnView, context /* optional */) {
        ///<summary>Register a routed event on a view</summary>
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="triggerOnView" type="wo.view" optional="false">The view registered to the routed event</param>
        ///<param name="context" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         
        
        return triggerOnView.registerRoutedEvent(this, callback, context);
    };
    
    return routedEvent;
});

Class("wipeout.events.routedEventArgs", function () {
    
    var routedEventArgs = function routedEventArgs(eventArgs, originator) { 
        ///<summary>Arguments passed to routed event handlers. Set handled to true to stop routed event propogation</summary>
        ///<param name="eventArgs" type="Any" optional="true">The inner event args</param>
        ///<param name="originator" type="Any" optional="false">A pointer to event raise object</param>
        
        ///<Summary type="Boolean">Signals whether the routed event has been handled and should not propagate any further</Summary>
        this.handled = false;
        
        ///<Summary type="Any">The original event args used when the routedEvent has been triggered</Summary>
        this.data = eventArgs;
        
        ///<Summary type="Any">The object which triggered the event</Summary>
        this.originator = originator;
    };
    
    return routedEventArgs;
});