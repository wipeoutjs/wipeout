Class("wipeout.utils.htmlBindingTypes", function () {  
        
    function utils() {
    }
	
    utils.bindOneWay = function(bindFrom, bindFromName, bindTo, bindToName) {
        //TODO: it doesn't make sense to call out to another lib for this
        var callback = obsjs.utils.obj.createBindFunction(bindTo, bindToName);
        var pw = new obsjs.observeTypes.pathObserver(bindFrom, bindFromName, callback);
        pw.registerDisposable(callback);
		
        if (bindFrom instanceof wipeout.base.disposable)
            bindFrom.registerDisposable(pw);
        
        if (bindTo instanceof wipeout.base.disposable)
            bindTo.registerDisposable(pw);

        callback(null, wipeout.utils.obj.getObject(bindFromName, bindFrom));
		
		return pw;
    }
    
 /*   utils.getParser = function(forViewModel, propertyName, setter) {
        var globalParser = forViewModel instanceof wipeout.base.bindable ?
            forViewModel.getGlobalParser(propertyName) :
            null;
        
        // use parser, global parser or lazy create auto parser
        return setter.parser || 
            globalParser ||
            (setter.parser = wipeout.template.compiledInitializer.getAutoParser(setter.valueAsString()));
    }*/
    
    
    //TODO: test
    utils.isSimpleBindingProperty = function (property) {
        return /^\s*[\$\w\((\s*)\.(\s*))]+\s*$/.test(property);
    };
    
    return utils;
});