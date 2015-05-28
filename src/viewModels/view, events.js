(function () {
    
    function modelEventSubscription (forViewModel, event, callback, callbackContext, priority) {
        this.forViewModel = forViewModel;
        this.event = event;
        this.callback = callback;
        this.callbackContext = callbackContext;
        this.priority = priority;
    }
    
    modelEventSubscription.prototype.resubscribe = function () {
        if (this.dispose)
            this.dispose.dispose();

        this.dispose = this.forViewModel.model ? 
            this.forViewModel.registerEvent(this.forViewModel.model, this.event, this.callback, this.callbackContext, this.priority) : 
            null;
    };
 
	var view = wipeout.viewModels.view, routedEventName = "routed-event";
    
    view.prototype.registerEvent = function(owner, event, callback, callbackContext, priority) {
        ///<summary>Register for a event</summary>
        ///<param name="owner" type="Object" optional="false">The object which is to raise the event</param>
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="event" type="String" optional="false">The event name</param>
        ///<param name="callbackContext" type="Any" optional="true">The "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty.</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>
        
        var disp = wipeout.events.event.instance.register(owner, event, callback, callbackContext, priority);
        this.registerDisposable(disp);
        return disp;
    };
    
    view.prototype.registerModelEvent = function(event, callback, callbackContext, priority) {
        ///<summary>Register for a event</summary>
        ///<param name="owner" type="Object" optional="false">The object which is to raise the event</param>
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="event" type="String" optional="false">The event name</param>
        ///<param name="callbackContext" type="Any" optional="true">The "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty.</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>
        
        if (!this.$modelEventRegistrations)
            this.$modelEventRegistrations = [];
        
        var subscription;
        this.$modelEventRegistrations.push(subscription = new modelEventSubscription(
            this,
            event,
            callback,
            callbackContext,
            priority));
        
        subscription.resubscribe();
        
        var output = new busybody.disposable((function () {
            if (subscription.dispose)
                subscription.dispose.dispose();
            
            if (this.$modelEventRegistrations && (subscription = this.$modelEventRegistrations.indexOf(subscription)) !== -1) {
                this.$modelEventRegistrations.splice(subscription, 1);
                if (!this.$modelEventRegistrations.length)
                    this.$modelEventRegistrations = null;
            }
        }).bind(this));
        
        this.registerDisposable(output);
        return output;
    };
    
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