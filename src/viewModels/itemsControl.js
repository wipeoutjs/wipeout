
Class("wipeout.viewModels.itemsControl", function () {
    
    var deafaultTemplateId;
    var staticConstructor = function() {
        if(deafaultTemplateId) return;
        
        deafaultTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate('{{$this.items}}');
    };
    
    var itemsControl = wipeout.viewModels.contentControl.extend(function itemsControl(templateId, itemTemplateId, model) {
        ///<summary>Bind a list of models (items) to a list of view models (items) and render accordingly</summary>
        ///<param name="templateId" type="String" optional="true">The template id. If not set, defaults to a div to render items</param>
        ///<param name="itemTemplateId" type="String" optional="true">The initial template id for each item</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        
        staticConstructor();
        this._super(templateId || deafaultTemplateId, model);

        ///<Summary type="ko.observable" generic0="String">The id of the template to render for each item</Summary>
        this.itemTemplateId = itemTemplateId || wipeout.viewModels.visual.getBlankTemplateId();

        ///<Summary type="ko.observable" generic0="String">The template which corresponds to the itemTemplateId for this object</Summary>
        this.itemTemplate = "";
        
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "itemTemplateId", "itemTemplate");
        
        ///<Summary type="wipeout.base.array">An array of models to render</Summary>
        this.items = new wipeout.base.array();
        this.registerDisposable(this.items);
        
        this.registerRoutedEvent(itemsControl.removeItem, this._removeItem, this);
    });
    
    itemsControl.removeItem = wipeout.events.routedEvent();
    
    itemsControl.prototype._removeItem = function(e) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="e" type="wo.routedEventArgs" optional="false">The item to remove</param>
    
        if(this.items.indexOf(e.data) !== -1) {
            this.removeItem(e.data);
            e.handled = true;
        }
    };
    
    itemsControl.prototype.removeItem = function(item) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="item" type="Any" optional="false">The item to remove</param>
    
        this.items.remove(item);
    };
    
    itemsControl.prototype._initialize = function(propertiesXml, parentBindingContext) {
        ///<summary>Takes an xml fragment and binding context and sets its properties accordingly</summary>
        ///<param name="propertiesXml" type="wipeout.template.templateElement" optional="false">An XML element containing property setters for the view</param>
        ///<param name="parentBindingContext" type="ko.bindingContext" optional="false">The binding context of the wipeout node just above this one</param>
    
        if(propertiesXml) {        
            var prop = propertiesXml.attributes["shareParentScope"] || propertiesXml.attributes["share-parent-scope"];
            if(prop && parseBool(prop.value))
                throw "A wo.itemsControl cannot share it's parents scope.";
        }
        
        this._super(propertiesXml, parentBindingContext);
    };
    
    //virtual
    itemsControl.prototype.onItemRendered = function (item) {
        ///<summary>Called after a new item items control is rendered</summary>
        ///<param name="item" type="wo.view" optional="false">The item rendered</param>
    };
    
    itemsControl.prototype.dispose = function () {
        ///<summary>Dispose of the items control and its items</summary>
        
        // will dispose of items
        this.items.length = 0;
        
        this._super();
    };    
    
    //virtual
    itemsControl.prototype.onItemDeleted = function (item) {
        ///<summary>Disposes of deleted items</summary> 
        ///<param name="item" type="wo.view" optional="false">The item deleted</param>  
        
        item.dispose();
    };

    itemsControl.prototype._createItem = function (model) {
        ///<summary>Defines how a view model should be created given a model. The default is to create a view and give it the itemTemplateId</summary>
        ///<param name="model" type="Any" optional="false">The model for the view to create</param>
        ///<returns type="wo.view">The newly created item</returns>
        
        var item = this.createItem(model);
        item.__woBag.createdByWipeout = true;
        return item;
    };

    // virtual
    itemsControl.prototype.createItem = function (model) {
        ///<summary>Defines how a view model should be created given a model. The default is to create a view and give it the itemTemplateId</summary>
        ///<param name="model" type="Any" optional="false">The model for the view to create</param>
        ///<returns type="wo.view">The newly created item</returns>
        var vm = new wipeout.viewModels.view(this.itemTemplateId, model);
        
        vm.registerDisposable(this.observe("itemTemplateId", function (oldVal, newVal) {
            vm.templateId = newVal;
        }, this));
        
        return vm;
    };

    return itemsControl;
});