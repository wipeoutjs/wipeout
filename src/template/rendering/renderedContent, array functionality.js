
(function () {
    
	var renderedContent = wipeout.template.rendering.renderedContent;
	
	var mysteryItem = {};
    
    //TODO: this function is too big
    renderedContent.prototype.renderArray = function (array) {
        
        // if a previous request is pending, cancel it
        if (this.asynchronous) {
            this.asynchronous.cancel();
			delete this.asynchronous;
		}
                
        this.unRender();        
        var children = [], getChild;
        
        var itemsControl = this.parentRenderContext.$this instanceof wipeout.viewModels.itemsControl && array === this.parentRenderContext.$this.items ?
            this.parentRenderContext.$this :
            null;
        
        if (itemsControl)	//TODO there must be a better place to put this
            itemsControl.$getChild = getChild = function (i) { 
				if (arguments.length === 0) {
					var op = children.slice();
					for (var i = 0, ii = op.length; i < ii; i++)
						op[i] = op[i].renderedChild;
						
					return op;
				}
				
				return children[i] ? children[i].renderedChild : undefined; 
			};
        
        function remove(item) {                    
            if (itemsControl)
                itemsControl.onItemDeleted(item.renderedChild);
			
			delete item.renderedChild;
			delete item.forItem;

            item.dispose();
        };
		
		var render = (function (changes) {
			
			var removed = [];
			enumerateArr(changes, function (change) {
				if (change.type === "splice") {
					var args = new Array(change.addedCount);
					for (var i = 0; i < change.addedCount; i++) args[i] = mysteryItem;
					args.splice(0, 0, change.index, change.removed.length);
					
					removed.push.apply(removed, children.slice(change.index, change.index + change.removed.length));
					children.splice.apply(children, args);
				} else if (!isNaN(parseInt(change.name))) {
					if (children[change.name] !== mysteryItem)
						removed.push(children[change.name]);
					
					children[change.name] = mysteryItem;
				}
			});
			
			for (var k = removed.length - 1; k >= 0; k--)
				if (removed[k] === mysteryItem)
					removed.splice(1, k);
			
			// find added items
			for (var i = 0, ii = children.length; i < ii; i++) {
				if (children[i] !== mysteryItem) continue;
				
				// find if added item had been previously removed
				for (var k = 0, kk = removed.length; k < kk; k++) {
					if (removed[k].forItem === array[i]) {
						var item = removed.splice(k, 1)[0];
						if (i === 0)
							this.prepend(item);
						else
							children[i - 1].insertAfter(item);
						
						item.renderContext.$index.value = i;
						item.rename("item: " + i);
						children[i] = item;
						
						break;
					}
				}
				
				// item was moved
				if (k != kk) 
					continue;
				
				var placeholder = document.createElement("script");
				if (i === 0)
					this.prepend(placeholder);
				else
					children[i - 1].insertAfter(placeholder);

				children[i] = new renderedContent(placeholder, "item: " + i, this.parentRenderContext);
				var vm = itemsControl ? itemsControl._createItem(array[i]) : array[i];
				children[i].render(vm, i);
				children[i].forItem = array[i];
				if (itemsControl) {
					children[i].renderedChild = vm;
					itemsControl.onItemRendered(vm);
				}
			};
			
			enumerateArr(removed, remove);
			
		}).bind(this);
		
        if (array instanceof wipeout.base.array) {
			var changes;
            var arrayObserve = array.observe(render, null, {useRawChanges: true});
		}
        
        this.disposeOfBindings = (function () {
            if (arrayObserve) {
                arrayObserve.dispose();
                arrayObserve = null;
			}
			
            if (getChild && itemsControl.$getChild === getChild) {
                delete itemsControl.$getChild;
                getChild = null;
            }
			
			enumerateArr(children, remove);
			children.length = 0;
        }).bind(this);
		
		render([{
			type: "splice",
			addedCount: array.length,
			removed: [],
			index: 0
		}]);
	};
}());