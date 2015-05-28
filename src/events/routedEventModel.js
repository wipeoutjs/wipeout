
Class("wipeout.events.routedEventModel", function () {
    
    //TODO: disposal
    
    var routedEventName = "routed-event";
    var routedEventModel = orienteer.extend(function routedEventModel() {
        ///<summary>The base class for models if they wish to invoke routed events on their viewModel</summary>
        
		this._super();
    });
    
    routedEventModel.triggerRoutedEvent = "__triggerRoutedEventOnVM";
        
    routedEventModel.prototype.triggerRoutedEvent = function(routedEvent, eventArgs) {
        ///<summary>Trigger a routed event which will propogate to any view models where this object is it's model and continue to bubble from there</summary>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to trigger</param>
        ///<param name="eventArgs" type="Any" optional="true">The routed event args</param>
        
        // Used by wo.model to acertain when a routed event should be fired
        wipeout.event.instance.trigger(this, routedEventModel.triggerRoutedEvent, {routedEvent: routedEvent, eventArgs: eventArgs});
    };        
        
    routedEventModel.prototype.routedEventTriggered = function(routedEvent, eventArgs) {
        ///<summary>Called by the owning view model when a routed event is fired</summary>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to trigger</param>
        ///<param name="eventArgs" type="Any" optional="true">The routed event args</param>
                
        if (!this.__routedEventSubscriptions || eventArgs.handled)
            return;
        
        this.__routedEventSubscriptions.trigger(routedEvent, routedEventName, routedEvent);
    };        
    
    routedEventModel.prototype.registerRoutedEvent = function(routedEvent, callback, callbackContext, priority) {
        ///<summary>Register for a routed event</summary>   
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="callbackContext" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty. Event priority does not affect event bubbling order</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         

        if (!this.__routedEventSubscriptions)
            this.__routedEventSubscriptions = new wipeout.event();
        
        return this.__routedEventSubscriptions.register(routedEvent, routedEventName, callback, callbackContext || this, priority);
    };
    
    return routedEventModel;
});