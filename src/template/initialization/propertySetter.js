
//TODO: rename
Class("wipeout.template.initialization.propertySetter", function () {
	
    var viewModelPropertyValue = wipeout.template.propertyValue.extend(function propertySetter (name, value, parser) {
        ///<summary>A setter for a view model property</summary>
        ///<param name="name" type="String">The name of the property</param>
        ///<param name="value" type="wipeout.wml.wmlElement|wipeout.wml.wmlAttribute">The setter value</param>
        ///<param name="parser" type="String|Function" optional="true">the parser or a pointer to it</param>
		
		this._super(name, value, parser);
	});
	
	viewModelPropertyValue.prototype.onPropertyChanged = function (callback, evaluateImmediately) {
        ///<summary>A setter for a view model property</summary>
        ///<param name="viewModel" type="Any">The view model which has the property</param>
        ///<param name="callback" type="Function">A callback to execute when the value changes</param>
        ///<param name="evaluateImmediately" type="Boolean">Execute the callback now</param>
        ///<returns type="Boolean">Whether the property could be subscribed to or not</returns>
		
		this.primed();
		
		var op = obsjs.tryObserve(this.propertyOwner, this.name, callback);
		if (op) this._caching.push(op);
		if (evaluateImmediately)
			callback(undefined, wipeout.utils.obj.getObject(this.name, this.propertyOwner));
		
		return !!op;
	};
	
	// override
	viewModelPropertyValue.prototype.value = function() {
        ///<summary>Get the value</summary>
        ///<returns type="String">The value</returns>
		
        return this.hasOwnProperty("_valueAsString") ?
            this._valueAsString :
            (this._valueAsString = this._super().serializeContent());
    };
	
	return viewModelPropertyValue;
});