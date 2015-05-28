Class("wipeout.events.event", function() {
    
    function eventDictionary () {
        this.objects = new wipeout.utils.dictionary();
    }
    
    eventDictionary.prototype.add = function (forObject, event, callback) {
        
        var objectCallbacks;
        if (!(objectCallbacks = this.objects.value(forObject)))
            this.objects.add(forObject, objectCallbacks = {});
        
        if (!objectCallbacks[event])
            objectCallbacks[event] = [callback];
        else
            objectCallbacks[event].push(callback);
        
        return new busybody.disposable((function () {
            var tmp, objectCallbacks = this.objects.value(forObject);

            if (objectCallbacks && objectCallbacks[event] && (tmp = objectCallbacks[event].indexOf(callback)) !== -1) {
                objectCallbacks[event].splice(tmp, 1);
                if (!objectCallbacks[event].length) {
                    delete objectCallbacks[event];
                    for (var i in objectCallbacks)
                        return;
                    
                    this.objects.remove(forObject);
                }
            }
        }).bind(this));
    };
    
    eventDictionary.prototype.callbacks = function (forObject, event) {
        var tmp;
        return (tmp = this.objects.value(forObject)) && tmp[event];
    };
    
    function event () {
        ///<summary>Handles events for wipeout objects</summary>
        
        this.dictionary = new eventDictionary();
    }
    
    event.prototype.register = function (forObject, event, callback, context, priority) {
        ///<summary>Register an event.</summary>
        ///<param name="forObject" type="Object">The object which will fire the event</param>
        ///<param name="event" type="String">The event name</param>
        ///<param name="callback" type="Function">The callback. The first argument will be the event args</param>
        ///<param name="context" type="Object" optional="true">The "this" in the callback</param>
        ///<param name="priority" type="Number" optional="true">Alters the order which callbacks will be called, higher values are executed first. 0 is the default</param>
        
        callback = callback.bind(context);
        callback.priority = priority || 0;
        return this.dictionary.add(forObject, event, callback);
    };
    
    event.prototype.trigger = function (forObject, event, eventArgs) {
        ///<summary>Trigger an event.</summary>
        ///<param name="forObject" type="Object">The object triggering the event</param>
        ///<param name="event" type="String">The event name</param>
        ///<param name="eventArgs" type="Object">The arguments for the event callbacks</param>
        
        var callbacks = this.dictionary.callbacks(forObject, event);
        if (callbacks) {
            callbacks.sort(function (a, b) {
                return a.priority < b.priority;
            });
        
            enumerateArr(callbacks, function (callback) {
                callback(eventArgs);
            }, this);
        }
    };
    
    event.prototype.dispose = function () {
        ///<summary>Dispose of all event handlers.</summary>
        
        this.dictionary.objects.clear();
    };
    
    event.instance = new event();
    
    return event;
});