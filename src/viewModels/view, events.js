(function () {
 
	var view = wipeout.viewModels.view;
    
    view.prototype.unRegisterRoutedEvent = function(routedEvent, callback, callbackContext /* optional */) {  
        ///<summary>Unregister from a routed event. The callback and callback context must be the same as those passed in during registration</summary>
        ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to un register from</param>
        ///<param name="callbackContext" type="Any" optional="true">The original context passed into the register function</param>
        ///<returns type="Boolean">Whether the event registration was found or not</returns>         

        if (this.$routedEventSubscriptions) {
            var rev = this.$routedEventSubscriptions.value(routedEvent);
            if (rev) {
                rev.event.unRegister(callback, callbackContext);
            }

            return !!rev;
        }
        
        return false;
    };
    
    view.prototype.registerRoutedEvent = function(routedEvent, callback, callbackContext, priority) {
        ///<summary>Register for a routed event</summary>   
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="callbackContext" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty. Event priority does not affect event bubbling order</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         

        if (!this.$routedEventSubscriptions)
            this.$routedEventSubscriptions = new wipeout.utils.dictionary();
        
        var rev = this.$routedEventSubscriptions.value(routedEvent);
        if(!rev) {
            rev = new wipeout.events.routedEventRegistration(routedEvent);
            this.$routedEventSubscriptions.add(routedEvent, rev);
        }

        return rev.event.register(callback, callbackContext, priority);
    };
    
    view.prototype.triggerRoutedEvent = function(routedEvent, eventArgs) {
        ///<summary>Trigger a routed event. The event will bubble upwards to all ancestors of this view. Overrides wo.object.triggerRoutedEvent</summary>        
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="eventArgs" type="Any" optional="true">The event args to bubble up with the routed event</param>
        
        // create routed event args if neccessary
        if(!(eventArgs instanceof wipeout.events.routedEventArgs)) {
            eventArgs = new wipeout.events.routedEventArgs(eventArgs, this);
        } else if (eventArgs.handled) {
            return;
        }
        
        if (this.$routedEventSubscriptions) {
            var rev = this.$routedEventSubscriptions.value(routedEvent);
            if (rev) {
                rev.event.trigger(eventArgs);
            }
        }
        
        // trigger event on model
        if(eventArgs.handled) return;
        if(this.model instanceof wipeout.events.routedEventModel) {
            this.model.routedEventTriggered(routedEvent, eventArgs);
        }

        // trigger event on parent
        if(eventArgs.handled) return;
        var nextTarget = this.getParent();
        if(nextTarget) {
            nextTarget.triggerRoutedEvent(routedEvent, eventArgs);
        }
    };
}());