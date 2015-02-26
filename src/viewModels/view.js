
Class("wipeout.viewModels.view", function () {    

    var modelRoutedEventKey = "wipeout.viewModels.view.modelRoutedEvents";
    
    var view = wipeout.viewModels.visual.extend(function view (templateId, model /*optional*/) {        
        ///<summary>Extends on the visual class to provide expected MVVM functionality, such as a model and bindings</summary>  
        ///<param name="templateId" type="String" optional="true">An initial template id</param>
        ///<param name="model" type="Any" optional="true">An initial model</param>

        this._super(templateId);
        
        ///<Summary type="ko.observable" generic0="Any">The model of view. If not set, it will default to the model of its parent view</Summary>
        this.model = model == null ? null : model;
        
        this.observe("model", this._onModelChanged, this);
    }); 
    
    view.setObservable = function(obj, property, value) {
        ///<summary>Set an observable or non observable property</summary>
        ///<param name="obj" type="Any" optional="false">The object to set the property on</param>
        ///<param name="property" type="String" optional="false">The name of the property</param>
        ///<param name="value" type="String" optional="false">The value to set the property to</param>
        
        if(ko.isObservable(obj[property])) {
            obj[property](ko.utils.unwrapObservable(value));
        } else {
            obj[property] = ko.utils.unwrapObservable(value);
        }
    };
    
    view.prototype.dispose = function() {
        ///<summary>Dispose of view specific items</summary>    
        this._super();
        
        if(this.__woBag[modelRoutedEventKey]) {
            this.disposeOf(this.__woBag[modelRoutedEventKey]);
            delete this.__woBag[modelRoutedEventKey];
        }
    };

    
    // virtual
    view.prototype.onInitialized = function() {
        ///<summary>Called by the template engine after a view is created and all of its properties are set</summary>    
    };
        
    view.prototype._onModelChanged = function (oldValue, newValue) {
        ///<summary>Called when the model has changed</summary>
        ///<param name="oldValue" type="Any" optional="false">The old model</param>
        ///<param name="newValue" type="Any" optional="false">The new mode</param>
		
        if(oldValue !== newValue) {
            this.disposeOf(this.__woBag[modelRoutedEventKey]);
            delete this.__woBag[modelRoutedEventKey];
            
            if(newValue instanceof wipeout.events.routedEventModel) {
                var d1 = newValue.__triggerRoutedEventOnVM.register(this._onModelRoutedEvent, this);
                this.__woBag[modelRoutedEventKey] = this.registerDisposable(d1);
            }
        }
        
        this.onModelChanged(oldValue, newValue);
    };
        
    // virtual
    view.prototype.onModelChanged = function (oldValue, newValue) {
        ///<summary>Called when the model has changed</summary>
        ///<param name="oldValue" type="Any" optional="false">The old model</param>
        ///<param name="newValue" type="Any" optional="false">The new mode</param>        
    };
    
    view.prototype._onModelRoutedEvent = function (eventArgs) {
        ///<summary>When the model of this class fires a routed event, catch it and continue the traversal upwards</summary>
        ///<param name="eventArgs" type="wo.routedEventArgs" optional="false">The routed event args</param>
        
        if(!(eventArgs.routedEvent instanceof wipeout.events.routedEvent)) throw "Invaid routed event";
        
        this.triggerRoutedEvent(eventArgs.routedEvent, eventArgs.eventArgs);
    };

    return view;
});
