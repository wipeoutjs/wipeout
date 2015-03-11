
(function () {
	    
    wipeout.template.rendering.renderedContent.prototype.renderArray = function (array) {
        
        // if a previous request is pending, cancel it
        if (this.asynchronous) {
            this.asynchronous.cancel();
			delete this.asynchronous;
		}
                
        this.unRender();
        
		var ra = new wipeout.template.rendering.renderedArray(array, this);
        this.disposeOfBindings = ra.dispose.bind(ra);
		
		ra.render([{
			type: "splice",
			addedCount: array.length,
			removed: [],
			index: 0
		}]);
	};
}());