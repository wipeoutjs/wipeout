Class("wipeout.htmlBindingTypes.bindingStrategy", function () {  
    
    var cache;
    return function bindingStrategy(viewModel, setter, renderContext) {
		///<summary>Set the $bindingStrategy of an object</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        
        if (!cache) {
            cache = [];
            for (var i in wipeout.settings.bindingStrategies)
                cache.push({
                    test: new RegExp("^(" + i + ")|" + wipeout.settings.bindingStrategies[i] + "$", "i"),
                    val: wipeout.settings.bindingStrategies[i]
                });
        }
        
        var val = setter.value(true).replace(/\s/g, ""), bs;
        for (var i = 0, ii = cache.length; i < ii; i++) {
            if (cache[i].test.test(val)) {
                viewModel.$bindingStrategy =  cache[i].val;
                return;
            }
        }
        
        throw "Invalid property value. Valid values are: onlyBindObservables (or 0), bindNonObservables (or 1) and createObservables (or 2)";
    }
});