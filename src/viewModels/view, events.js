(function () {
 
    function blank(){}
	var view = wipeout.viewModels.view;
    view.prototype.registerEvent = function(forPath, event, callback, callbackContext, priority) {
        ///<summary>Register for a event</summary>
        ///<param name="forPath" type="String" optional="false">The path to the object to subscribe to</param>
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="event" type="String" optional="false">The event name</param>
        ///<param name="callbackContext" type="Any" optional="true">The "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty.</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>
        
        if (!forPath)
            return {dispose:blank};
        
        forPath = wipeout.utils.obj.splitPropertyName(forPath);
        var length = forPath.length;
        
        var _this = this;
        var disp = wipeout.events.event.instance.registerForAll(event, function (args, owner) {
            if (owner) {
                var current = _this;
                for (var i = 0; current && i < length; i++)
                    current = current[forPath[i]];
                
                if (current === owner)
                    return callback.apply(this, arguments);
            }
        }, callbackContext, priority);
        
        this.registerDisposable(disp);
        return disp;
    };
    
    var routedEventName = "routed-event";
    view.prototype.registerRoutedEvent = function(routedEvent, callback, callbackContext, priority) {
        ///<summary>Register for a routed event</summary>   
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="routedEvent" type="Object" optional="false">The routed event</param>
        ///<param name="callbackContext" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty. Event priority does not affect event bubbling order</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         

        if (!this.$routedEventSubscriptions)
            this.$routedEventSubscriptions = new wipeout.events.event();
        
        return this.$routedEventSubscriptions.register(routedEvent, routedEventName, callback, callbackContext, priority);
    };
    
    view.prototype.triggerRoutedEvent = function(routedEvent, eventArgs) {
        ///<summary>Trigger a routed event. The event will bubble upwards to all ancestors of this view. Overrides wo.object.triggerRoutedEvent</summary>        
        ///<param name="routedEvent" type="Object" optional="false">The routed event</param>
        ///<param name="eventArgs" type="Any" optional="true">The event args to bubble up with the routed event</param>
        
        // create routed event args if neccessary
        if(!(eventArgs instanceof wipeout.events.routedEventArgs)) {
            eventArgs = new wipeout.events.routedEventArgs(eventArgs, this);
        }
        
        if (eventArgs.handled) return;
        if (this.$routedEventSubscriptions)
            this.$routedEventSubscriptions.trigger(routedEvent, routedEventName, eventArgs);
        
        // trigger event on model
        if (eventArgs.handled) return;
        if (this.model instanceof wipeout.events.routedEventModel) {
            this.model.routedEventTriggered(routedEvent, eventArgs);
        }

        // trigger event on parent
        if (eventArgs.handled) return;
        var nextTarget = this.getParent();
        if (nextTarget) {
            nextTarget.triggerRoutedEvent(routedEvent, eventArgs);
        }
    };
}());