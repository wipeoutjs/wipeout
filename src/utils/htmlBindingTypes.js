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
    };    
    
    //TODO: test
    utils.isSimpleBindingProperty = function (property) {
        return /^\s*[\$\w\((\s*)\.(\s*))]+\s*$/.test(property);
    };
    
    return utils;
});