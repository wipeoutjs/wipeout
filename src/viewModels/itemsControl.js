
Class("wipeout.viewModels.itemsControl", function () {
    
    var deafaultTemplateId;
    var staticConstructor = function() {
        if(deafaultTemplateId) return;
        
        deafaultTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate('<div itemscontrol></div>');
    };
    
    var itemsControl = wipeout.viewModels.contentControl.extend(function itemsControl(templateId, itemTemplateId, model) {
        ///<summary>Bind a list of models (itemSource) to a list of view models (items) and render accordingly</summary>
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
        this.itemSource = new wipeout.base.array();
        this.itemSource.observe(this.onItemSourceChanged, this);
        this.registerDisposable(this.itemSource);
        
        ///<Summary type="wo.view">An array of viewmodels, each corresponding to a model in the itemSource property</Summary>
        this.items = new wipeout.base.array();
        this.items.observe(this.onItemsChanged, this);
        this.registerDisposable(this.items);        

        this.observe("itemTemplateId", this.reDrawItems, this);
        
        this.registerRoutedEvent(itemsControl.removeItem, this._removeItem, this);
    });
    
    itemsControl.removeItem = wipeout.events.routedEvent();
    
    itemsControl.prototype._removeItem = function(e) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="e" type="wo.routedEventArgs" optional="false">The item to remove</param>
    
        if(this.itemSource.indexOf(e.data) !== -1) {
            this.removeItem(e.data);
            e.handled = true;
        }
    };
    
    itemsControl.prototype.removeItem = function(item) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="item" type="Any" optional="false">The item to remove</param>
    
        this.itemSource.remove(item);
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
    
    itemsControl.prototype._syncModelsAndViewModels = function() {
        ///<summary>Ensures that the itemsSource array and items array are in sync</summary>
                        
        if(this.itemSource.length !== this.items.length) {
            this.itemSource.length = this.items.length;
        }
        
        for(var i = 0, ii = this.items.length; i < ii; i++) {
            if(this.items[i].model !== this.itemSource[i]) {
                this.itemSource.replace(i, this.items[i].model);
            }
        }
    };

    itemsControl.prototype._modelsAndViewModelsAreSynched = function() {
        ///<summary>Returns whether all models have a corresponding view model at the correct index</summary>
        ///<returns type="Boolean"></returns>
        
        if(this.itemSource.length !== this.items.length)
            return false;
        
        for(var i = 0, ii = this.itemSource.length; i < ii; i++) {
            if(this.itemSource[i] !== this.items[i].model)
                return false;
        }
        
        return true;
    };

    itemsControl.prototype.onItemsChanged = function (removed, added) { 
        ///<summary>Runs onItemDeleted and onItemRendered on deleted and created items respectively</summary>
        ///<param name="removed" type="Array" generic0="wo.view" optional="false">A list of removed items</param>
        ///<param name="added" type="Array" generic0="wo.view" optional="false">A list of added items</param>
        
        enumerateArr(removed, function(change) {
            this.onItemDeleted(change);
        }, this);
        
        enumerateArr(added, function(change) {
            this.onItemRendered(change);
        }, this);
        
        this._syncModelsAndViewModels();
    };

    itemsControl.prototype.onItemSourceChanged = function (removed, added, indexes) { 
        ///<summary>Adds, removes and moves view models depending on changes to the models array</summary>
        ///<param name="removed" type="Array" generic0="wo.view" optional="false">A list of removed items</param>
        ///<param name="added" type="Array" generic0="wo.view" optional="false">A list of added items</param>
        ///<param name="moved" type="Array" generic0="wo.view" optional="false">The items moved</param>
        
        var items = wipeout.utils.obj.copyArray(this.items);
        this.items.length = this.itemSource.length;
        
        enumerateArr(indexes.added, function(item) {
            this.items.replace(item.index, this._createItem(item.value));
        }, this);
        
        enumerateArr(indexes.moved, function(item) {
            this.items.replace(item.to, items[item.from]);
        }, this);
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
        return new wipeout.viewModels.view(this.itemTemplateId, model);        
    };

    itemsControl.prototype.reDrawItems = function () {
        ///<summary>Destroys and re-draws all view models</summary>
        
        this.items.length = 0;
        for (var i = 0, ii = this.itemSource.length; i < ii; i++)
            this.items.push(this._createItem(this.itemSource[i]));
    };

    return itemsControl;
});