
Class("wipeout.template.propertyValue", function () {
	
	var propertyValue = orienteer.extend(function setter (name, value, parser) {
		///<summary>Base class for vm property setters and html attribute setters</summary>
        ///<param name="name" type="String">The name of the item to set</param>
        ///<param name="value" type="String">The value to set it at (before parsing and renderContext are applied)</param>
        ///<param name="parser" type="String|Function" optional="true">The parser or a pointer to it</param>
		
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
	
	propertyValue.prototype.value = function (useUnAltered) {
		///<summary>Get the value</summary>
        ///<param name="useUnAltered" type="Boolean" optional="true">If set to true, the returned value will be un altered, otherwise, it will be optimised for javascript.</param>
        ///<returns type="String">The value</returns>
        
        return useUnAltered ?
            (this.hasOwnProperty("_unAlteredCachedValue") ?
                this._unAlteredCachedValue : 
                (this._unAlteredCachedValue = this.getValue())) :
            (this.hasOwnProperty("_cachedValue") ?
                this._cachedValue : 
                (this._cachedValue = propertyValue.replace$model(this.getValue())));
	};
    
    propertyValue.replace$model = function (input) {
		///<summary>Replaces all instances of $model in a javascript string with $this.model</summary>
        ///<param name="input" type="String">The input</param>
        ///<returns type="String">The value</returns>
        
        input = wipeout.utils.jsParse.removeCommentsTokenStrings(input);
        
        // "$model", not followed by another character or a ":"
        var rx = /\$model(?![\w\$]|(\s*\:))/g, current, i, replace;
        while (current = rx.exec(input.output)) {
            replace = true;
            for (i = current.index - 1; i >= 0; i--) {
                if (/\s/.test(input.output[i]))
                    continue;
                
                if (input.output[i] === "." || (i === current.index - 1 && /[\w\$]/.test(input.output[i])))
                    replace = false;
                    
                break;
            }
            
            if (replace)
                input.output = input.output.substring(0, current.index + 1) + "this." + input.output.substring(current.index + 1);
        }
        
        if (/(^|\s)var\s+\$this\.model/.test(input.output))
            throw "You cannot define a $model variable in this scope. $model is reserved for the model of the curren view model.";
        
        return input.addTokens(input.output);
    };
	
	// virtual
	propertyValue.prototype.getValue = function () {
		///<summary>Get the value</summary>
        ///<returns type="String">The value</returns>
		
		return this._value;
	};
	
	propertyValue.prototype.buildGetter = function () {
		///<summary>Build a getter for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		if (!this._getter) {
			var val;
			var splitValue = wipeout.utils.jsParse.removeCommentsTokenStringsAndBrackets(val = this.value());
			var split = splitValue.output.split("=>");
			
			if (split.length > 2)
				throw "Invalid attribute value: " + val + ". You may only include 1 filter.";	//TODE
			
			if (split.length === 2) {
				split[1] = trim(split[1]);
				if (!wipeout.template.filters[split[1]])
					throw "Invalid filter: " + split[1];	//TODE
				
				if (wipeout.template.filters[split[1]].downward)
					val = "wipeout.template.filters[\"" + split[1] + "\"].downward(" + split[0] + ")";
				else
					val = split[0].split(",")[0];
			}
			
			this._getter = wipeout.template.context.buildGetter(splitValue.addTokens(val))
		}
		
		return this._getter;
	};
	
    //TODO: test
	propertyValue.prototype.buildPermanentGetter = function (renderContext, propertyOwner) {
		///<summary>Return a function which will return the value of this property whether the property is primed or not</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="propertyOwner" type="Any" optional="true">The owner of the propery. If null, the setter must be primed</param>
        ///<returns type="Function">A function with no arguments which returns the value</returns>
		
		var parser = this.getParser(propertyOwner);
		
		if (parser) 
            return (function () {
			     return parser(parser.useRawXmlValue ? this._value : this.value(true), this.name, renderContext)
            }).bind(this);
        
        var getter = this.buildGetter();
        return function () {
            return getter.apply(null, renderContext.asGetterArgs());
        };
	};
	
	propertyValue.prototype.get = function (renderContext, propertyOwner) {
		///<summary>Return the value of this setter when applied to a renderContext</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="propertyOwner" type="Any" optional="true">The owner of the propery. If null, the setter must be primed</param>
        ///<returns type="Any">The returned value</returns>
		
		var parser = this.getParser(propertyOwner);
		
		return parser ? 
			(parser(parser.useRawXmlValue ? this._value : this.value(true), this.name, renderContext)) : 
			this.buildGetter().apply(null, renderContext.asGetterArgs());
	};
	
	propertyValue.prototype.buildSetter = function () {
		///<summary>Build a setter for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		if (!this.hasOwnProperty("_setter")) {
			var attributeValue, getter;
			var splitValue = wipeout.utils.jsParse.removeCommentsTokenStringsAndBrackets(attributeValue = this.value());
			var split = splitValue.output.split("=>");
			
			if (split.length > 2)
				throw "Invalid attribute value: " + attributeValue + ". You may only include 1 filter.";	//TODE
			
			if (split.length === 2) {
				split[1] = trim(split[1]);
				if (!wipeout.template.filters[split[1]])
					throw "Invalid filter: " + split[1];	//TODE
				
				if (wipeout.template.filters[split[1]].upward) {
					getter = "wipeout.template.filters[\"" + split[1] + "\"].upward";
					split = split[0].split(/\s*\,\s*/);
					attributeValue = splitValue.addTokens(split[0]);
					split[0] = "arguments[5]";
					getter += "(" + split.join(", ") + ")";
				} else {
					attributeValue = splitValue.addTokens(split[0].split(",")[0]);
				}
			}
			
			var property = /\.\s*[\w\$]+\s*$/.exec(attributeValue);
			if (!property) {
				this._setter = null;
			} else {
				var getSetterRoot = wipeout.template.context.buildGetter(attributeValue.substring(0, attributeValue.length - property[0].length));
				property = property[0].replace(/(^\s*\.+\s*)|(\s*$)/g, "");
				if (getter) {
					getter = wipeout.template.context.buildGetter(splitValue.addTokens(getter));
					this._setter = function (renderContext, value) {
						var args = renderContext.asGetterArgs().slice();
						var part1 = getSetterRoot.apply(null, args);
						args.push(value);
						return part1 ? ((part1[property] = getter.apply(null, args)), true) : false;
					};
				} else {
					this._setter = function (renderContext, value) {
						var part1 = getSetterRoot.apply(null, renderContext.asGetterArgs());
						return part1 ? ((part1[property] = value), true) : false;
					};
				}
			}
		}
		
		return this._setter;
	};
	
	propertyValue.prototype.canSet = function (propertyOwner) {
		///<summary>Return whether this setter can set a value</summary>
        ///<param name="propertyOwner" type="Any" optional="true">The owner of the propery. If null, the setter must be primed</param>
        ///<returns type="Boolean">Whether the value could be set or not</returns>
		
		return !this.getParser(propertyOwner) && !!this.buildSetter();
	};
	
	propertyValue.prototype.getParser = function (propertyOwner) {
		///<summary>Return the parser for the </summary>
        ///<param name="propertyOwner" type="Any" optional="true">The owner of the propery. If null, the setter must be primed</param>
        ///<returns type="Function">The parser</returns>
        
		propertyOwner || (this.primed(), propertyOwner = this.propertyOwner);
		
		return this.parser || (propertyOwner instanceof wipeout.base.bindable && propertyOwner.getGlobalParser(this.name));
	};
	
	propertyValue.prototype.set = function (renderContext, value, propertyOwner) {
		///<summary>Return the value of this setter when applied to a renderContext</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="value" type="Any">The value to set</param>
        ///<param name="propertyOwner" type="Any" optional="true">The owner of the property. If null, the propertyValue must be primed</param>
        ///<returns type="Boolean">Whether the value could be set or not</returns>
		
		if (!this.canSet(propertyOwner))
			throw "You cannot set the value of: " + this.value() + ".";	//TODE
		
		return this.buildSetter()(renderContext, value);
	};
	
	propertyValue.prototype.watch = function (renderContext, callback, evaluateImmediately) {
		///<summary>When called within a wipeout binding function, will watch for a change in the value of the setter. Also handles all disposal in this case</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="callback" type="Function">The callback to invoke when the value changes</param>
        ///<param name="evaluateImmediately" type="Boolean">Invoke the callback now</param>
        ///<returns type="busybody.diposable">A dispose function to dispose prematurely</returns>
		
		this.primed();
		
		if (this.getParser() || /^\s*((true)|(false)|(\d+(\.\d+)?)|(\/(?!\/)))\s*$/.test(this.value())) {
			if (evaluateImmediately)
				callback(undefined, this.get(renderContext));
			
			return;
		}
		
        var watched;
        if (/^([\$\w\s\.]|(\[\d+\]))+$/.test(this.value())) {
            // the renderContext will not be observable, so will not work with
            // a path observer
            var split = wipeout.utils.obj.splitPropertyName(this.value());
            
			watched = new busybody.observeTypes.pathObserver(
                renderContext[split.splice(0, 1)[0]], 
                wipeout.utils.obj.joinPropertyName(split));
        } else {
            watched = renderContext.getComputed(this.buildGetter());
        }
		
		this._caching.push(watched);
		return watched.onValueChanged(callback, evaluateImmediately);
	};

	propertyValue.prototype.prime = function (propertyOwner, logic) {
		///<summary>Set up the setter to cache dispose functions and invoke logic which might create dispose functions</summary>
        ///<param name="propertyOwner" type="Any">The object which the propertyValue will be applied to</param>
        ///<param name="logic" type="Function">The logic to invoke</param>
        ///<returns type="Array" generic0="busybody.disposable">Dispose functions</returns>
		
		if (this._caching)
			throw "prime cannot be asynchronus or nested.";
		
		try {
			this._caching = [];
			this.propertyOwner = propertyOwner;
			logic();
			return this._caching;
		} finally {
			delete this._caching;
			delete this.propertyOwner;
		}
	};
	
	propertyValue.prototype.primed = function () {
		
		if (!this._caching)
			throw "The setter must be primed to make this call. Use the \"prime(...)\" function and pass in the logic to execute in a primed context.";
	};
	
	return propertyValue;
});