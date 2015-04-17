//TODO: rename to propertyValue
Class("wipeout.template.setter", function () {
	
	var setter1 = objjs.object.extend(function setter (name, value, parser) {
		///<summary>Base class for vm property setters and html attribute setters</summary>
        ///<param name="name" type="String">The name of the item to set</param>
        ///<param name="value" type="String">The value to set it at (before parsing and renderContext are applied)</param>
        ///<param name="parser" type="String|Function">The parser or a pointer to it</param>
		
		this._super();
	
		///<summary type="String">The name of the property</summary>
		this.name = name;
		
		///<summary type="String">The value of the property</summary>
		this._value = value;
        
        ///<summary type="Function">The parser if any</summary>
        this.parser = null;
		
		if (parser instanceof Function) {
			this.parser = parser;
		} else if (parser) {
            if (wipeout.template.initialization.parsers[parser])
                this.parser = wipeout.template.initialization.parsers[parser];
			else
				throw "Invalid parser: " + parser;	//TODE
		}
	});
	
	// virtual
	setter1.prototype.value = function () {
		///<summary>Get the value</summary>
        ///<returns type="String">The value</returns>
		
		return this._value;
	};
	
	setter1.prototype.buildGetter = function () {
		///<summary>Build a getter for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		if (!this._getter) {
			var val;
			var splitValue = wipeout.utils.jsParse.removeCommentsTokenStrings(val = this.value());
			var split = splitValue.output.split("=>");
			
			if (split.length > 2)
				throw "Invalid attribute value: " + val + ". You may only include 1 filter.";	//TODE
			
			if (split.length === 2)
				val = split[1] + "(" + split[0] + ")";
			
			this._getter = wipeout.template.context.buildGetter(splitValue.addTokens(val))
		}
		
		return this._getter;
	};
	
	setter1.prototype.get = function (renderContext) {
		///<summary>Return the value of this setter when applied to a renderContext</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Any">The returned value</returns>
		
		return this.buildGetter().apply(null, renderContext.asGetterArgs());
	};
	
	setter1.prototype.buildSetter = function () {
		///<summary>Build a setter for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		if (!this.hasOwnProperty("_setter")) {
			var val;
			var splitValue = wipeout.utils.jsParse.removeCommentsTokenStringsAndBrackets(val = this.value());
			var split = splitValue.output.split("=>");
			
			if (split.length > 2)
				throw "Invalid attribute value: " + val + ". You may only include 1 filter.";	//TODE
			
			if (split.length === 2)
				val = splitValue.addTokens(split[0].split(",")[0]);
			
			var property = /\.?\s*[\w\$]+\s*$/.exec(val);
			if (!property) {
				this._setter = null;
			} else {
				var getter = wipeout.template.context.buildGetter(val.substring(0, val.length - property[0].length));
				property = property[0].replace(/(^\s*\.+\s*)|(\s*$)/, "");
				this._setter = function (renderContext, value) {
					var part1 = getter.apply(null, renderContext.asGetterArgs());
					return part1 ? ((part1[property] = value), true) : false;
				};
			}
		}
		
		return this._setter;
	};
	
	setter1.prototype.canSet = function (propertyOwner) {
		///<summary>Return whether this setter can set a value</summary>
        ///<param name="propertyOwner" type="Any">The object (or Element) which this property is being applied to</param>
        ///<returns type="Boolean">Whether the value could be set or not</returns>
		
		return !this.getParser(propertyOwner) && !!this.buildSetter();
	};
	
	setter1.prototype.getParser = function (propertyOwner) {
		///<summary>Return the parser for the </summary>
        ///<param name="propertyOwner" type="Any">The object (or Element) which this property is being applied to</param>
        ///<returns type="Function">The parser</returns>
		
		return this.parser;
	};
	
	setter1.prototype.set = function (propertyOwner, renderContext, value) {
		///<summary>Return the value of this setter when applied to a renderContext</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="value" type="Any">The value to set</param>
        ///<returns type="Boolean">Whether the value could be set or not</returns>
		
		if (!this.canSet(propertyOwner))
			throw "You cannot set the value of: " + this.value() + ".";	//TODE
		
		return this.buildSetter()(renderContext, value);
	};
	
	setter1.prototype.watch = function (renderContext, callback, evaluateImmediately) {
		///<summary>When called within a wipeout binding function, will watch for a change in the value of the setter. Also handles all disposal in this case</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="callback" type="Function">The callback to invoke when the value changes</param>
        ///<param name="evaluateImmediately" type="Boolean">Invoke the callback now</param>
        ///<returns type="obsjs.diposable">A dispose function to dispose prematurely</returns>
		
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
		
		var watched = /^([\$\w\s\.]|(\[\d+\]))+$/.test(this.value()) ?
			new obsjs.observeTypes.pathObserver(renderContext, this.value()) :
			renderContext.getComputed(this.buildGetter());
		
		this._caching.push(watched);
		return watched.onValueChanged(callback, evaluateImmediately);
	};
	
	setter1.prototype.cacheAllWatched = function (logic) {
		///<summary>Set up the setter to cache dispose functions and invoke logic which might create dispose functions</summary>
        ///<param name="logic" type="Function">The logic to invoke</param>
        ///<returns type="Array" generic0="obsjs.disposable">Dispose functions</returns>
		
		if (this._caching)
			throw "cacheAllWatched cannot be asynchronus or nested.";
		
		try {
			this._caching = [];
			logic();
			return this._caching;
		} finally {
			delete this._caching;
		}
	};
	
	return setter1;
	
	/*TESTS
	
	
testUtils.testWithUtils("splitValue", "no filter", false, function(methods, classes, subject, invoker) {
    // arrange
	var input = "KJBKJBKJB";
	subject.getValue = function () { return input; };
	
	// act
	var output = invoker(input);
	
    // assert
    strictEqual(output.filter, "passthrough");
    strictEqual(output.inputs.length, 1);
    strictEqual(output.inputs[0], input);
});
	
testUtils.testWithUtils("splitValue", "filter and args", false, function(methods, classes, subject, invoker) {
    // arrange
	var input1 = "KJBKJBKJB", input2 = "dada'eterte'sdad", filter = "fdsfsdff";
	subject.getValue = function () { return input1 + ", " + input2 + " => " + filter; };
	
	// act
	var output = invoker();
	
    // assert
    strictEqual(output.filter, filter);
    strictEqual(output.inputs.length, 2);
    strictEqual(output.inputs[0], input1);
    strictEqual(output.inputs[1], input2);
});
	
	*/
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var setter = objjs.object.extend(function setter (name, value, parser) {
		///<summary>Base class for vm property setters and html attribute setters</summary>
        ///<param name="name" type="String">The name of the item to set</param>
        ///<param name="value" type="String">The value to set it at (before parsing and renderContext are applied)</param>
        ///<param name="parser" type="String|Function">The parser or a pointer to it</param>
		
		this._super();
	
		///<summary type="String">The name of the property</summary>
		this.name = name;
		
		///<summary type="String">The value of the property</summary>
		this._value = value;
        
        ///<summary type="Function">The parser if any</summary>
        this.parser = null;
		
		if (parser instanceof Function) {
			this.parser = parser;
		} else if (parser) {
            if (wipeout.template.initialization.parsers[parser])
                this.parser = wipeout.template.initialization.parsers[parser];
			else
				throw "Invalid parser: " + parser;	//TODE
		}
	});
	
	setter.prototype.build = function () {
		///<summary>Build a getter for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		return this._built || (this._built = wipeout.template.context.buildGetter(this.getValue()));
	};
	
    setter.isSimpleBindingProperty = function (property) {
		///<summary>Determine whether a logic string is a simple property chain</summary>
        ///<param name="property" type="String">The logic</param>
        ///<returns type="Boolean">The result</returns>
		
        return /^([\$\w\s\.]|(\[\d+\]))+$/.test(property);
    };
	
	setter.prototype.watch = function (renderContext, callback, evaluateImmediately) {
		///<summary>When called within a wipeout binding function, will watch for a change in the value of the setter. Also handles all disposal in this case</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="callback" type="Function">The callback to invoke when the value changes</param>
        ///<param name="evaluateImmediately" type="Boolean">Invoke the callback now</param>
        ///<returns type="obsjs.diposable">A dispose function to dispose prematurely</returns>
		
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
		
		var watched = setter.isSimpleBindingProperty(this.getValue()) ?
			new obsjs.observeTypes.pathObserver(renderContext, this.getValue()) :
			renderContext.getComputed(this.build());
		
		this._caching.push(watched);
		return watched.onValueChanged(callback, evaluateImmediately);
	};
	
	setter.prototype.execute = function (renderContext) {
		///<summary>Return the value of this setter when applied to a renderContext</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Any">The returned value</returns>
		
		return this.build().apply(null, renderContext.asGetterArgs());
	};
	
	setter.prototype.cacheAllWatched = function (logic) {
		///<summary>Set up the setter to cache dispose functions and invoke logic which might create dispose functions</summary>
        ///<param name="logic" type="Function">The logic to invoke</param>
        ///<returns type="Array" generic0="obsjs.disposable">Dispose functions</returns>
		
		if (this._caching)
			throw "cacheAllWatched cannot be asynchronus or nested.";
		
		try {
			this._caching = [];
			logic();
			return this._caching;
		} finally {
			delete this._caching;
		}
	};
	
	// virtual
	setter.prototype.getValue = function () {
		///<summary>Get the value</summary>
        ///<returns type="String">The value</returns>
		
		return this._value;
	};
	
	return setter;
});