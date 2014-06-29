Class("wipeout.utils.find", function () {
    
    var find = wipeout.base.object.extend(function(bindingContext) {
        this._super();

        this.bindingContext = bindingContext;
    }, "find");
    
    find.prototype.find = function(searchTerm, filters) {
        var temp = {};

        if(filters) {
            for(var i in filters)
                temp[i] = filters[i];
        }

        // destroy object ref
        filters = temp;            
        if(!filters.$number) {
            filters.$number = 0;
        }

        // shortcut for having constructor as search term
        if(searchTerm && searchTerm.constructor === Function) {
            filters.$instanceOf = searchTerm;
        // shortcut for having filters as search term
        } else if(searchTerm && searchTerm.constructor !== String) {
            for(var i in searchTerm)
                filters[i] = searchTerm[i];
        } else {
            filters.$ancestry = wipeout.utils.obj.trim(searchTerm);
        }     

        if(!filters.$number && filters.$n) {
            filters.$number = filters.$n;
        }     

        if(!filters.$instanceOf && filters.$i) {
            filters.$instanceOf = filters.$i;
        }    

        if(!filters.$instanceOf && filters.$instanceof) {
            filters.$instanceOf = filters.$instanceof;
        }

        if(!filters.$ancestry && filters.$a) {
            filters.$ancestry = filters.$a;
        }

        if(!filters.$type && filters.$t) {
            filters.$type = filters.$t;
        }
        
        var getModel = filters.$m || filters.$model;

        delete filters.$m;
        delete filters.$model;
        delete filters.$n;
        delete filters.$instanceof;
        delete filters.$i;
        delete filters.$a;
        delete filters.$t;

        return this._find(filters, getModel);
    };
    
    find.prototype._find = function(filters, getModel) {  
            
        if(!this.bindingContext ||!this.bindingContext.$parentContext)
            return null;
        
        var getItem = getModel ? 
            function(item) {
                return item && item.$data instanceof wo.view ? item.$data.model() : null;
            } : 
            function(item) { 
                return item ? item.$data : null;
            };

        var currentItem, currentContext = this.bindingContext;
        for (var index = filters.$number; index >= 0 && currentContext; index--) {
            var i = 0;

            currentContext = currentContext.$parentContext;

            // continue to loop until we find a binding context which matches the search term and filters
            while(!wipeout.utils.find.is(currentItem = getItem(currentContext), filters, i) && currentContext) {
                currentContext = currentContext.$parentContext;
                i++;
            }
        }

        return currentItem;
    };
    
    find.create = function(bindingContext) {
        var f = new wipeout.utils.find(bindingContext);

        return function(searchTerm, filters) {
            return f.find(searchTerm, filters);
        };
    };
    
    find.regex = {
        ancestors: /^(great)*(grand){0,1}parent$/,
        great: /great/g,
        grand: /grand/g
    };
    
    find.$type = function(currentItem, searchTerm, index) {
        return currentItem && currentItem.constructor === searchTerm;
    };
    
    find.$ancestry = function(currentItem, searchTerm, index) {
                
        searchTerm = (searchTerm || "").toLowerCase();

        // invalid search term which passes regex
        if(searchTerm.indexOf("greatparent") !== -1) return false;

        var total = 0;
        var g = searchTerm.match(wipeout.utils.find.regex.great);
        if(g)
            total += g.length;
        g = searchTerm.match(wipeout.utils.find.regex.grand);
        if(g)
            total += g.length;

        return total === index;
    };
    
    find.$instanceOf = function(currentItem, searchTerm, index) {
        if(!currentItem || !searchTerm || searchTerm.constructor !== Function)
            return false;

        return currentItem instanceof searchTerm;
    };
    
    find.is = function(item, filters, index) {
        if (!item)
            return false;
        
        for (var i in filters) {
            if (i === "$number") continue;

            if (i[0] === "$") {
                if(!wipeout.utils.find[i](item, filters[i], index))
                    return false;
            } else if (filters[i] !== item[i]) {
                return false;
            }
        }

        return true;
    };
    
    return find;
});