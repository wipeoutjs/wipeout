 
Class("wipeout.viewModels.itemsControl", function () {
    
	var deafaultTemplateId;
	var defaultItemTemplateId;
    var itemsControl = wipeout.viewModels.contentControl.extend(function itemsControl(templateId, itemTemplateId, model) {
        ///<summary>Bind a list of models (items) to a list of view models (items) and render accordingly</summary>
        ///<param name="templateId" type="String" optional="true">The template id. If not set, defaults to a div to render items</param>
        ///<param name="itemTemplateId" type="String" optional="true">The initial template id for each item</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        
        this._super(templateId || 
					deafaultTemplateId ||
					(deafaultTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate('{{$this.items}}')), model);

        ///<Summary type="ko.observable" generic0="String">The id of the template to render for each item</Summary>
        this.itemTemplateId = itemTemplateId;

        ///<Summary type="ko.observable" generic0="String">The template which corresponds to the itemTemplateId for this object</Summary>
        this.itemTemplate = "";
        
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "itemTemplateId", "itemTemplate");
        
        ///<Summary type="busybody.array">An array of models to render</Summary>
        this.items = new busybody.array();
        this.registerDisposable(this.items);
        
        this.registerRoutedEvent(itemsControl.removeItem, this._removeItem, this);
        
        this.observe("itemTemplateId", function (oldVal, newVal) {
			enumerateArr(this.getItemViewModels(), function (vm) {
				if (vm.__createdByItemsControl)
					vm.templateId = newVal;
			});
        }, this);
    });
    
    itemsControl.addGlobalParser("itemTemplate", "template");
    itemsControl.addGlobalBindingType("itemTemplate", "templateProperty");
        
    itemsControl.removeItem = wipeout.events.routedEvent();
	
    itemsControl.prototype._removeItem = function(e) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="e" type="wo.routedEventArgs" optional="false">The item to remove</param>
    
        if(this.items.indexOf(e.data) !== -1) {
            this.removeItem(e.data);
            e.handled = true;
        }
    };
    
    itemsControl.prototype.getItemViewModels = function() {
        ///<summary>Get the child view models if any</summary>
        ///<returns type="Array">The items</returns>
    
        return this.$getChild ?
            this.$getChild() :
			[];
	};
    
    itemsControl.prototype.getItemViewModel = function(index) {
        ///<summary>Get the child view model at a given index</summary>
        ///<param name="index" type="Number" optional="false">The index of the view model to get</param>
        ///<returns type="Any">The view model</returns>
    
        return this.$getChild ?
            this.$getChild(index) :
            undefined;
    };
    
    itemsControl.prototype.removeItem = function(item) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="item" type="Any" optional="false">The item to remove</param>
    
        this.items.remove(item);
    };
    
    //virtual, TODV
    itemsControl.prototype.onItemRendered = function (item) {
        ///<summary>Called after a new item items control is rendered</summary>
        ///<param name="item" type="wo.view" optional="false">The item rendered</param>
    };
    
    //virtual, TODV
    itemsControl.prototype.onItemRemoved = function (item) {
        ///<summary>Disposes of deleted items</summary> 
        ///<param name="item" type="Any" optional="false">The item deleted</param>  
        
        item.dispose();
    };

    itemsControl.prototype._createItem = function (model) {
        ///<summary>Defines how a view model should be created given a model. The default is to create a view and give it the itemTemplateId</summary>
        ///<param name="model" type="Any" optional="false">The model for the view to create</param>
        ///<returns type="wo.view">The newly created item</returns>
        
        var item = this.createItem(model);
        return item;
    };

    // virtual
    itemsControl.prototype.createItem = function (model) {
        ///<summary>Defines how a view model should be created given a model. The default is to create a view and give it the itemTemplateId</summary>
        ///<param name="model" type="Any" optional="false">The model for the view to create</param>
        ///<returns type="wo.view">The newly created item</returns>
		
        var vm = new wipeout.viewModels.view(this.itemTemplateId || defaultItemTemplateId || (defaultItemTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate("{{$this.model}}")), model);
		vm.__createdByItemsControl = true;
		return vm;
    };

    return itemsControl;
});