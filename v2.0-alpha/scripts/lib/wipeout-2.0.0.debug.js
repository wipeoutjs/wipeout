// wipeout v2.0.0
// (c) Shane Connon 2015
// http://www.opensource.org/licenses/mit-license.php
(function () {

// busybody v0.1.0
// (c) Shane Connon 2015
// http://www.opensource.org/licenses/mit-license.php
(function () {

// orienteer v0.1.0
// (c) Shane Connon 2015
// http://www.opensource.org/licenses/mit-license.php
(function () {

function orienteer() {
	///<summary>The object class is the base class for all objects. It has base functionality for inheritance and parent methods</summary>
};

var cachedSuperMethods = {
	parents:[],
	children:[]
};

orienteer.clearVirtualCache = function(forMethod /*optional*/) {
	///<summary>Lookup results for _super methods are cached. This could cause problems in the rare cases when a class prototype is altered after one of its methods are called. Clearing the cache will solve this</summary>
	///<param name="forMethod" type="Function" optional="true">A method to clear from the cache</param>
	
	if(!forMethod) {
		cachedSuperMethods.parents.length = 0;
		cachedSuperMethods.children.length = 0;
		return;
	}
	
	for(var i = 0, ii = cachedSuperMethods.children.length; i < ii; i++) {
		if(cachedSuperMethods.children[i] === forMethod || cachedSuperMethods.parents[i] === forMethod) {
			cachedSuperMethods.children.splice(i, 1);
			cachedSuperMethods.parents.splice(i, 1);
		}
	}
};

// The virtual cache caches overridden methods for quick lookup later. It is not safe to use if two function prototypes which are not related share the same function, or function prototypes are modified after an application initilisation stage
orienteer.useVirtualCache = true;

orienteer.prototype._super = function() {        
	///<summary>Call the current method or constructor of the parent class with arguments</summary>
	///<returns type="Any">Whatever the overridden method returns</returns>
	
	var currentFunction = arguments.callee.caller;
	
	// try to find a cached version to skip lookup of parent class method
	var cached = null;
	if(orienteer.useVirtualCache) {
		var superIndex = cachedSuperMethods.children.indexOf(currentFunction);
		if(superIndex !== -1)
			cached = cachedSuperMethods.parents[superIndex];
	}
	
	if(!cached) {
		
		// compile prototype tree into array
		var inheritanceTree = [];
		var current = this.constructor.prototype;
		while(current) {
			inheritanceTree.push(current);
			current = Object.getPrototypeOf(current);
		}
		
		// reverse array so that parent classes come before child classes
		inheritanceTree.reverse();            
		
		// find the first instance of the current method in inheritance tree
		for(var i = 0, ii = inheritanceTree.length; i < ii; i++) {
			// if it is a constructor
			if(inheritanceTree[i] === currentFunction.prototype) {
				cached = inheritanceTree[i - 1].constructor;							
			} else {
				for(var method in inheritanceTree[i]) {
					if(inheritanceTree[i][method] === currentFunction) {
						for(var j = i - 1; j >= 0; j--) {
							if(inheritanceTree[j][method] !== currentFunction) {
								cached = inheritanceTree[j][method];
								break;
							}
						}
					}
					
					if(cached)
						break;
				}
			}
				
			if (cached) {
				if(orienteer.useVirtualCache) {
					// map the current method to the method it overrides
					cachedSuperMethods.children.push(currentFunction);
					cachedSuperMethods.parents.push(cached);
				}

				break;
			}
		}
		
		if(!cached)
			throw "Could not find method in parent class";
	}
			
	// execute parent class method
	return cached.apply(this, arguments);
};

var validFunctionCharacters = /^[a-zA-Z_][a-zA-Z_0-9]*$/;
orienteer.extend = function (childClass) {
	///<summary>Use prototype inheritance to inherit from this class. Supports "instanceof" checks</summary>
	///<param name="childClass" type="Function" optional="false">The constructor of a class to create. Name the constructor function to get better debugger information</param>
	///<returns type="Function">The newly created class</returns>
	
	// if the input is a lonely constructor, convert it into the object format
	if(childClass.constructor === Function) {
		var cc = childClass;
		childClass = {
			constructor: cc,
			statics: {}
		};
		
		for(var item in childClass.constructor)
			childClass.statics[i] = childClass.constructor[i];
		
		for(var item in childClass.constructor.prototype)
			childClass[i] = childClass.constructor.prototype[i];
		
	} else if (childClass.constructor === Object) {
		// in case the consumer forgot to specify a constructor, default to parent constructor
		childClass.constructor = function() {
			this._super.apply(this, arguments);
		};
	} else if(!childClass.constructor || childClass.constructor.constructor !== Function) {
		throw "the property \"constructor\" must be a function";
	}
	
	// static functions
	for (var p in this)
		if (this.hasOwnProperty(p) && this[p] && this[p].constructor === Function && this[p] !== orienteer.clearVirtualCache && this[p] !== orienteer.getInheritanceChain && childClass.constructor[p] === undefined)
			childClass.constructor[p] = this[p];
	 
	var prototypeTracker = function() { this.constructor = childClass.constructor; }     
	prototypeTracker.prototype = this.prototype;
	childClass.constructor.prototype = new prototypeTracker();
	
	for(var i in childClass) {
		if(i === "constructor") continue;
		if(i === "statics") {
			for(var j in childClass[i])
				childClass.constructor[j] = childClass[i][j];
			
			continue;
		}
		
		childClass.constructor.prototype[i] = childClass[i];
	}
	
	
	return childClass.constructor;
};

orienteer.getInheritanceChain = function(forClass) {
	var chain = [];
		
	while (forClass) {            
		chain.push(forClass);
		forClass = Object.getPrototypeOf(forClass.prototype);
		if(forClass)
			forClass = forClass.constructor
	}
	
	return chain;
};


    window.orienteer = orienteer;
}());

(function (orienteer) {
    var busybody = {};
    var useObjectObserve = busybody.useObjectObserve = Object.observe && (!window.hasOwnProperty("useObjectObserve") || window.useObjectObserve);

    
var enumerateArr = function(enumerate, action, context) {
    ///<summary>Enumerate through an array or object</summary>
    ///<param name="enumerate" type="Any">An item to enumerate over</param>
    ///<param name="action" type="Function">The callback to apply to each item</param>
    ///<param name="context" type="Any" optional="true">The context to apply to the callback</param>
    
    if (!enumerate) return;
    
    context = context || window;
    
    for(var i = 0, ii = enumerate.length; i < ii; i++)
        action.call(context, enumerate[i], i);
};
    
var enumerateObj = function(enumerate, action, context) {
    ///<summary>Enumerate through an array or object</summary>
    ///<param name="enumerate" type="Any">An item to enumerate over</param>
    ///<param name="action" type="Function">The callback to apply to each item</param>
    ///<param name="context" type="Any" optional="true">The context to apply to the callback</param>
    
    if (!enumerate) return;
    
    context = context || window;
        
    if(enumerate == null) return;

    for(var i in enumerate)
        action.call(context, enumerate[i], i);
};

var Class = function(classFullName, accessorFunction) {
    ///<summary>Create an busybody class</summary>
    ///<param name="classFullName" type="String">The name of the class</param>
    ///<param name="accessorFunction" type="Function">A function which returns the class</param>
    
    classFullName = classFullName.split(".");
    var namespace = classFullName.splice(0, classFullName.length - 1);
    
    var tmp = {};
    tmp[classFullName[classFullName.length - 1]] = accessorFunction();
    
    Extend(namespace.join("."), tmp);
    
    return tmp[classFullName[classFullName.length - 1]];
};

var Extend = function(namespace, extendWith) {
    ///<summary>Similar to $.extend but with a namespace string which must begin with "busybody"</summary>
    ///<param name="namespace" type="String">The namespace to add to</param>
    ///<param name="extendWith" type="Object">The object to add to the namespace</param>
    
    namespace = namespace.split(".");
    
    if(namespace[0] !== "busybody") throw "Root must be \"busybody\".";
    namespace.splice(0, 1);
    
    var current = busybody;
    enumerateArr(namespace, function(nsPart) {
        current = current[nsPart] || (current[nsPart] = {});
    });
    
    if(extendWith && extendWith instanceof Function) extendWith = extendWith();
    enumerateObj(extendWith, function(item, i) {
        current[i] = item;
    });
};
    
var _trimString = /^\s+|\s+$/g;
var trim = function(string) {
    ///<summary>Trims a string</summary>
    ///<param name="string" type="String">The string to trim</param>
    ///<returns type="String">The trimmed string</returns>
    
    return string ? string.replace(_trimString, '') : string;
};

Class("busybody.utils.obj", function () {
        
    var arrayMatch = /\[\s*\d\s*\]$/g;
    var splitPropertyName = function(propertyName) {
		///<summary>Split a path into strings and numbers</summary>
		///<param name="propertyName" type="String">The name</param>
		///<returns type="[String|Number]">The path</param>
		
        propertyName = propertyName.split(".");
        
        var tmp;
        for (var i = 0; i < propertyName.length; i++) {
            propertyName[i] = busybody.utils.obj.trim(propertyName[i]);
            var match = propertyName[i].match(arrayMatch);
            if (match && match.length) {
                if (tmp = busybody.utils.obj.trim(propertyName[i].replace(arrayMatch, ""))) {
                    propertyName[i] = busybody.utils.obj.trim(propertyName[i].replace(arrayMatch, ""));
                } else {
                    propertyName.splice(i, 1);
                    i--;
                }
                
                for (var j = 0, jj = match.length; j < jj; j++)
                    propertyName.splice(++i, 0, parseInt(match[j].match(/\d/)[0]));
            }
        }
        
        return propertyName;
    };
    
    var joinPropertyName = function (propertyName) {
		///<summary>Join a path</summary>
		///<param name="propertyName" type="[String|Number]">The path</param>
		///<returns type="String">The name</param>
		
        var output = [];
        enumerateArr(propertyName, function (item) {
            if (!isNaN(item))
                output.push("[" + item + "]");
            else if (output.length === 0)
                output.push(item);
            else
                output.push("." + item);
        });
        
        return output.join("");
    }
    
    var getObject = function(propertyName, context) {
        ///<summary>Get an object from string</summary>
        ///<param name="propertyName" type="String">A pointer to the object to get</param>
        ///<param name="context" type="Any" optional="true">The root context. Defaults to window</param>
        ///<returns type="Any">The object</returns>
        
        return _getObject(splitPropertyName(propertyName), context);
    };
    
    var getPartialObject = function(propertyName, context, index) {
        ///<summary>Get an object from part of a string</summary>
        ///<param name="propertyName" type="String">A pointer to the object to get</param>
        ///<param name="context" type="Any" optional="true">The root context. Defaults to window</param>
        ///<param name="index" type="Number" optional="true">Decide how many parts to evaluate. A value of 0 indicates evaluate all, a value less than 0 indicates that you do not evaluate the last elements, a value greater than 0 indicates that you only evaluate the first elements</param>
        ///<returns type="Any">The object</returns>
		
		var output = {};
		
		propertyName = splitPropertyName(propertyName);
		if (index <= 0)
			output.remainder = propertyName.splice(propertyName.length + index, index * -1);
		else
			output.remainder = propertyName.splice(index, propertyName.length - index);
		
		output.object = _getObject(propertyName, context, index);
		return output;
    };
    
    function _getObject(splitPropertyName, context) {
		
        if(!context) context = window;
        
        for (var i = 0, ii = splitPropertyName.length; i <ii; i++) {
            context = context[splitPropertyName[i]];
            if(context == null)
                return i === ii - 1 ? context : null;
        }
        
        return context;
    };
    
    var setObject = function(propertyName, context, value) {
		///<summary>Set an object path, if possible</summary>
		///<param name="propertyName" type="String">The property</param>
		///<param name="context" type="Object">The object</param>
		///<param name="value" type="Any">The value</param>
		
        propertyName = splitPropertyName(propertyName);
        if (propertyName.length > 1)
            context = _getObject(propertyName.splice(0, propertyName.length -1), context);
        
		if (context)
        	context[propertyName[0]] = value;
    };	

    function addWithDispose(callbackArray, item) {
		///<summary>Add an item to an array and return a disposable which will remove it</summary>
		///<param name="callbackArray" type="[]">The array</param>
		///<param name="item" type="Any">The item</param>
		///<returns type="busybody.disposable">The disposable</param>

        callbackArray.push(item);
        var dispose = new busybody.disposable(function () {
            if (!dispose) return;
            dispose = null;

            item = callbackArray.indexOf(item);
            if (item !== -1)
                callbackArray.splice(item, 1);
        });

        return dispose;
    }
        
    var obj = function obj() { };
    obj.trim = trim;
    obj.addWithDispose = addWithDispose;
    obj.enumerateArr = enumerateArr;
    obj.enumerateObj = enumerateObj;
    obj.getObject = getObject;
    obj.getPartialObject = getPartialObject;
    obj.setObject = setObject;
    obj.splitPropertyName = splitPropertyName;
    obj.joinPropertyName = joinPropertyName;
    
    return obj;
});


Class("busybody.disposable", function () {
    
	function init (disp) {
		if (!disp.$disposables) disp.$disposables = {};
	}
	
    var disposable = orienteer.extend(function disposable(disposableOrDisposeFunction) {
        ///<summary>An object which can be disposed</summary>
		///<param name="disposeableOrDisposeFunction" type="Object|Function">An initial dispose function</param>
        
        this._super();
        
        if (!disposableOrDisposeFunction)
            ;
        else if (disposableOrDisposeFunction instanceof Function)
            this.registerDisposeCallback(disposableOrDisposeFunction);
        else
            this.registerDisposable(disposableOrDisposeFunction);
    });
    
    disposable.prototype.disposeOf = function(key) {
        ///<summary>Dispose of an item registered as a disposable</summary>
        ///<param name="key" type="String" optional="false">The key of the item to dispose</param>
		
		if (key instanceof Array) {
			var result = false;
			enumerateArr(key, function (key) {
				result |= this.disposeOf(key);
			}, this);
			
			return result;
		}
		
        if(this.$disposables && this.$disposables[key]) {
            this.$disposables[key]();
            return delete this.$disposables[key];
        }
		
		return false;
    };
    
    disposable.prototype.disposeOfAll = function() {
        ///<summary>Dispose of all items registered as a disposable</summary>
		if (this.$disposables)
			for(var i in this.$disposables)
				this.disposeOf(i);
    };
    
    disposable.prototype.registerDisposeCallback = (function() {
        var i = 0;
        return function(disposeFunction) {
            ///<summary>Register a dispose function which will be called when this object is disposed of.</summary>
            ///<param name="disposeFunction" type="Function" optional="false">The function to call when on dispose</param>
            ///<returns type="String">A key to dispose off this object manually</returns>

            if(!disposeFunction || disposeFunction.constructor !== Function) throw "The dispose function must be a Function";

			init(this);
            var id = (++i).toString();            
            this.$disposables[id] = disposeFunction;            
            return id;
        };
    })();
    
    disposable.prototype.registerDisposable = function(disposableOrDisposableGetter) {
        ///<summary>An object with a dispose function to be disposed when this object is disposed of.</summary>
        ///<param name="disposableOrDisposableGetter" type="Function" optional="false">The function to dispose of on dispose, ar a function to get this object</param>
        ///<returns type="String">A key to dispose off this object manually</returns>
        
        if(!disposableOrDisposableGetter) return;
        if(disposableOrDisposableGetter.constructor === Function && !disposableOrDisposableGetter.dispose) disposableOrDisposableGetter = disposableOrDisposableGetter.call(this);        
        if(!disposableOrDisposableGetter || !(disposableOrDisposableGetter.dispose instanceof Function)) throw "The disposable object must have a dispose(...) function";

        return this.registerDisposeCallback(disposableOrDisposableGetter.dispose.bind(disposableOrDisposableGetter));
    };
    
    disposable.prototype.dispose = function() {
        ///<summary>Dispose of this disposable</summary>
        
        this.disposeOfAll();
    };
                                      
    return disposable;
});

// name is subject to change

Class("busybody.utils.executeCallbacks", function () {
	
	var executeCallbacks = busybody.disposable.extend(function executeCallbacks() {
		///<summary>Base class for objects with an execute(...) function which executes a list of callbacks</summary>
		
		if (this.constructor === executeCallbacks) throw "You cannot create an instance of an abstract class";
		
		this._super();
		
		this.callbacks = [];
	});
	
	executeCallbacks.prototype.addCallback = function (callback) {
		///<summary>Add a callback</summary>
		///<param name="callback" type="Function">The callback</param>
		///<param name="property" type="String">The property</param>
		///<returns type="busybody.disposable">A dispose object</param>
		
		var op = busybody.utils.obj.addWithDispose(this.callbacks, callback);
		this.registerDisposable(op);
		
		return op;
	};
        
    executeCallbacks.prototype._execute = function() {
		///<summary>Abstract. Execute and return argumets for the callbacks</summary>
		///<returns type="Object">Arguments for the callbacks in the form of { cancel: true | false, arguments: [] }</param>
		
		throw "Abstract methods must be implemented";
	};
	
    executeCallbacks.prototype.execute = function() {
		///<summary>Execute all callbacks</summary>
		
		var args = this._execute();
		
		if (args && !args.cancel)
			enumerateArr(this.callbacks.slice(), function (cb) {
				cb.apply(null, args.arguments || []);
			});
    };
    
    executeCallbacks.prototype.dispose = function () {
		///<summary>Dispose</summary>
		
		this._super();		
		this.callbacks.length = 0;
    };
	
	return executeCallbacks;
});


Class("busybody.observeTypes.observeTypesBase", function () {
	
	var observeTypesBase = busybody.utils.executeCallbacks.extend(function observeTypesBase() {
		///<summary>Base class for computed and pathObserve</summary>
		
		if (this.constructor === observeTypesBase) throw "You cannot create an instance of an abstract class";
		
		this._super();
	});
      
    observeTypesBase.prototype.getValue = function() {
		///<summary>Get the current value of the computed or pathObserver</summary>
		
		throw "Abstract methods must be implemented";
	};
        
    observeTypesBase.prototype._execute = function() {
		///<summary>Abstract. Execute and return argumets for the callbacks</summary>
		///<returns type="Object">Arguments for the callbacks in the form of { cancel: true | false, arguments: [oldVal, newVal] }</returns>
		
		var oldVal = this.val;
		this.val = this.getValue();
		
		return {
			cancel: this.val === oldVal,
			arguments: [oldVal, this.val]
		};
    };
	
	return observeTypesBase;
});


Class("busybody.observableBase", function () {
        
    var observableBase = busybody.disposable.extend(function observableBase(forObject) {
        ///<summary>An object whose properties can be subscribed to</summary>
		///<param name="forObject" type="Object" optional="true">Observe changes to another object</param>

        this._super();

        ///<summary type="[Object]">Current changes to be processed</summary>
        this.$changeBatch = [];
		
        ///<summary type="Object">The object to observe. If null, observe this</summary>
        this.$forObject = forObject;
		
        ///<summary type="Object">Dictionary of change callbacks</summary>
        this.$callbacks = {};
    });
    
	// this function is also used by arrayBase
    observableBase.prototype.registerChangeBatch = function (changes) {
		///<summary>Register a batch of changes to this object</summary>
		///<param name="changes" type="[Object]">The changes</param>
		
        if (!this.$changeBatch.length)
            setTimeout(this.processChangeBatch.bind(this));
        
        this.$changeBatch.push.apply(this.$changeBatch, changes);
    };
    
    observableBase.prototype.processChangeBatch = function () {
		///<summary>Process the current batch of changes</summary>
		
        var splitChanges = {};
        enumerateArr(this.$changeBatch, function(change) {
            if (!splitChanges[change.name])
                splitChanges[change.name] = [];

            splitChanges[change.name].push(change);
        });
        
        this.$changeBatch.length = 0;

        busybody.utils.observeCycleHandler.instance.execute(this.$forObject || this, (function () {
			var evaluateMultiple = [];
			enumerateObj(splitChanges, function (changes, name) {
				if (this.$callbacks[name])
					evaluateMultiple.push.apply(evaluateMultiple, observableBase.processChanges(this.$callbacks[name], changes));
			}, this);

			enumerateArr(evaluateMultiple, function (c) { c(); });
		}).bind(this));
    };

    observableBase.processChanges = function (callbacks, changes) {
		///<summary>Process changes</summary>
		///<param name="callbacks" type="[busybody.callbacks.chageCallback]">The callbacks</param>
		///<returns type="[Function]">A list of items to execute after this funciton returns</returns>
		
        var dispose = [];
        var evaluateMultiple = [];
        enumerateArr(callbacks, function (callback, i) {
            if (callback.evaluateOnEachChange) {
                for (var i = 0, ii = changes.length; i < ii; i++)
                    if (callback.evaluateSingle(changes, i))
                        dispose.push(i);
            } else {
                evaluateMultiple.push(function () {
                    if (callback.evaluateMultiple(changes))
                        dispose.push(i);
                });
            }
        });

        // reverse array so that removals before will not affect array enumeration
        dispose.sort(function (a,b) { return a < b;  })
        for (var i = 0, ii = dispose.length; i < ii; i++)
            callbacks.splice(dispose[i], 1);
        
        return evaluateMultiple;
    };
    
    observableBase.prototype.onNextPropertyChange = function (property, callback) {
		///<summary>Fire a callback once, the next property change</summary>
		///<param name="property" type="String">The property to observe</param>
		///<param name="callback" type="Function">The callback</param>
		
        throw "Abstract methods must be overridden";
    };
    
    observableBase.prototype.captureChanges = function (logic, callback, toProperty) {
		///<summary>Capture all of the changes to the property perpetrated by the logic</summary>
		///<param name="logic" type="Function">The function which will change the array</param>
		///<param name="callback" type="Function">The callback (function (changes) { })</param>
		///<param name="toProperty" type="String" optional="true">The property</param>
				
		if (toProperty && (toProperty = busybody.utils.obj.splitPropertyName(toProperty)).length > 1) {
			return busybody.captureChanges(
				busybody.utils.obj.getObject(toProperty.slice(0, toProperty.length - 1).join("."), this.$forObject || this), 
				logic, 
				callback, 
				toProperty[toProperty.length - 1]);
		}
		
		toProperty = toProperty && toProperty.length ? toProperty[0] : undefined;
		var cb = toProperty ? function (changes) {
			var ch = [];
			enumerateArr(changes, function (change) {
				if (change.name == toProperty)
					ch.push(change);
			});

			callback(ch);
		} : callback.bind(this);
		
		if (toProperty)
        	this._init(toProperty);
		
		return this._captureChanges(logic, cb);
    };
    
    observableBase.prototype._captureChanges = function (logic, callback, toProperty) {
		///<summary>Capture all of the changes to the property perpetrated by the logic</summary>
		///<param name="logic" type="Function">The function which will change the array</param>
		///<param name="callback" type="Function">The callback (function (changes) { })</param>
		///<param name="toProperty" type="String">The property</param>
		
        throw "Abstract methods must be overridden";
	};
    
    observableBase.prototype.bind = function (property, otherObject, otherPropoerty) {
		///<summary>Bind a property to another objects property</summary>
		///<param name="property" type="String">The property</param>
		///<param name="otherObject" type="Object">The other object</param>
		///<param name="otherProperty" type="String">The other property</param>
		
		return busybody.bind(this, property, otherObject, otherPropoerty);
    };

    observableBase.prototype.observeArray = function (property, callback, context, options) {
		///<summary>Observe an array property for changes</summary>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The callback</param>
		///<param name="context" type="Any">The "this" value in the callback</param>
		///<param name="options" type="Object" optional="true">See busybody.array.observe for options</param>
		///<returns type="busybody.disposable">A disposable</returns>
		
        var d2, d1 = this.observe(property, function (oldValue, newValue) {
            
            if (d2) {
                this.disposeOf(d2);
                d2 = null;
            }
            
            var change = {
                object: newValue || [],
                index: 0,
                addedCount: newValue instanceof Array ? newValue.length : 0,
                removed: oldValue instanceof Array ? oldValue : [],
                type: "splice"
            };
            
            //TODO: duplication of logic
            if (options && options.evaluateOnEachChange) {
                callback.call(context, change);
            } else {
                var cec = new busybody.utils.compiledArrayChange([change], 0, 1);
                callback.call(context, cec.getRemoved(), cec.getAdded(), cec.getIndexes());
            }
            
            if (newValue instanceof busybody.array)
                d2 = this.registerDisposable(newValue.observe(callback, context, options));
        }, this);
        
        var tmp;
        if ((tmp = busybody.utils.obj.getObject(property, this.$forObject || this)) instanceof busybody.array)
            d2 = this.registerDisposable(tmp.observe(callback, context, options));
        
        return new busybody.disposable(function () {
            if (d2) {
                this.disposeOf(d2);
                d2 = null;
            }
            
            if (d1) {
                d1.dispose();
                d1 = null;
            }
        });
    }

    observableBase.prototype.observe = function (property, callback, context, options) {
		///<summary>Observe changes to a property </summary>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The callback to execute</param>
		///<param name="context" type="Any" optional="true">The "this" in the callback</param>
		///<param name="options" type="Object" optional="true">Options for the callback</param>
		///<param name="options.useRawChanges" type="Boolean">Default: false. Use the change objects from the Object.observe as arguments</param>
		///<param name="options.evaluateOnEachChange" type="Boolean">Default: false. Evaluate once for each change rather than on an amalgamation of changes</param>
		///<param name="options.evaluateIfValueHasNotChanged" type="Boolean">Default: false. Evaluate if the oldValue and the newValue are the same</param>
		///<param name="options.activateImmediately" type="Boolean">Default: false. Activate the callback now, meaning it could get changes which were applied before the callback was created</param>
		
        if (/[\.\[]/.test(property)) {
            var pw = new busybody.observeTypes.pathObserver(this.$forObject || this, property, callback, context);
            this.registerDisposable(pw);
            return pw;
        }
        
        this._init(property);

        var cb = new busybody.callbacks.propertyCallback(callback, context, options);
        if (!this.$callbacks[property]) this.$callbacks[property] = [];
        this.$callbacks[property].push(cb);

		if (options && options.activateImmediately)
			cb.activate();
		else
			this.onNextPropertyChange(property, function (change) {
				cb.activate(change);
			});
        
        var dispose = {
            dispose: (function (allowPendingChanges) {

                if (!dispose) return;
                dispose = null;
                
                if (allowPendingChanges)
                    this.onNextPropertyChange(property, function (change) {
                        cb.deactivate(change);
                    });
                else
                    cb.deactivate();
            }).bind(this)
        };
        
        this.registerDisposable(dispose);
        
        return dispose;
    };

    observableBase.prototype._init = function (forProperty) {
		///<summary>Begin observing a property</summary>
		///<param name="forProperty" type="String">The property</param>
		
        throw "Abstract methods must be implemented";
    };

    observableBase.prototype.dispose = function () {
		///<summary>Dispose fo this</summary>
		
        this._super();
        
        delete this.$forObject;
        for (var i in this.$callbacks)
            delete this.$callbacks[i];
    };
    
    observableBase.prototype.computed = function (property, callback, options) {
		///<summary>Create a computed which bind's to a property. The context of the callback will be this observable.</summary>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The computed logic.</param>
		///<param name="options" type="Object" optional="true">See busybody.observeTypes.computed for options</param>
		///<returns type="busybody.observeTypes.computed">The computed</param>
        
        var computed = new busybody.observeTypes.computed(callback, this.$forObject || this, options);
        computed.bind(this.$forObject || this, property);
        this.registerDisposable(computed);
        return computed;        
    };
    
    observableBase.prototype.del = function (property) {
		///<summary>Delete a property and publish changes.</summary>
		///<param name="property" type="String">The property</param>
        
        delete (this.$forObject || this)[property];
    };
        
    observableBase.afterObserveCycle = function(callback) {
		///<summary>Execute a callback after each observe cycle.</summary>
		///<param name="callback" type="Function">The callback.</param>
		///<returns type="busybody.disposable">A dispose callback</param>
		
        return busybody.utils.observeCycleHandler.instance.afterObserveCycle(callback);
    };

    observableBase.beforeObserveCycle = function(callback) {
		///<summary>Execute a callback before each observe cycle.</summary>
		///<param name="callback" type="Function">The callback.</param>
		///<returns type="busybody.disposable">A dispose callback</param>
		
        return busybody.utils.observeCycleHandler.instance.beforeObserveCycle(callback);
    };

    observableBase.afterNextObserveCycle = function (callback, waitForNextCycleToStart) {
		///<summary>Execute a callback after the next observe cycle.</summary>
		///<param name="callback" type="Function">The callback.</param>
		///<param name="waitForNextCycleToStart" type="Boolean" options="true">If false and there is no observe cycle running, will execute the callback immediately.</param>
		///<returns type="busybody.disposable">A dispose callback</param>

        if (!waitForNextCycleToStart && busybody.utils.observeCycleHandler.instance.length === 0) {
            callback();
            return;
        }

        var dispose = busybody.utils.observeCycleHandler.instance.afterObserveCycle(function () {
            dispose.dispose();
            callback();
        });

        return dispose;
    };

    observableBase.beforeNextObserveCycle = function (callback) {
		///<summary>Execute a callback before the next observe cycle.</summary>
		///<param name="callback" type="Function">The callback.</param>
		///<returns type="busybody.disposable">A dispose callback</param>

        var dispose = busybody.utils.observeCycleHandler.instance.beforeObserveCycle(function () {
            dispose.dispose();
            callback();
        });

        return dispose;
    };
    
    return observableBase;
});


Class("busybody.callbacks.changeCallback", function () {
        
    var changeCallback = orienteer.extend(function changeCallback(evaluateOnEachChange) {
		///<summary>Base class for change callback handlers</summary>
		///<param name="evaluateOnEachChange" type="Boolean">Default: false. Evaluate once for each change rather than on an amalgamation of changes</param>
		
        this._super();
        
		///<summary type="Boolean">Default: false. Evaluate once for each change rather than on an amalgamation of changes</summary>
        this.evaluateOnEachChange = evaluateOnEachChange;
    });
    
    // remove this callback flag
    changeCallback.dispose = {};
    
    changeCallback.prototype.activate = function (activatingChange) {
		///<summary>Activate this callback</summary>
		///<param name="activatingChange" type="Object" optional="true">The first change to execute on</param>
		
        if (this._activated || this._activatingChange)
            throw "This callback has been activated";
        
		if (!arguments.length)
			this._activated = true;
		else if (activatingChange == null)
			throw "Invalid change";
		else
        	this._activatingChange = activatingChange;
    };
    
    changeCallback.prototype.deactivate = function (deactivatingChange) {
		///<summary>Deactivate this callback</summary>
		///<param name="deactivatingChange" type="Object" optional="true">The first change to deactivate on</param>
		
        if (this._deactivatingChange)
            throw "This callback has a deactivate pending";
        
        if (!arguments.length)
            this._activated = false;
        else if (deactivatingChange == null)
			throw "Invalid change";
		else
            this._deactivatingChange = deactivatingChange;
    };

    changeCallback.prototype.evaluateSingle = function (changes, changeIndex) {
		///<summary>Evaluate a single change</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="index" type="Number">The index of the change to execute</param>
		///<returns type="Any">The return value of the callback</param>
        
        if (!this.evaluateOnEachChange) return;

        if (this._activated === false || (this.hasOwnProperty("_deactivatingChange") && this._deactivatingChange === changes[changeIndex])) {
            this._activated = false;
            return changeCallback.dispose;
        }

        if (!this.hasOwnProperty("_activated")) {
            if (this.hasOwnProperty("_activatingChange") && this._activatingChange === changes[changeIndex]) {
                this._activated = true;
                delete this._activatingChange;
            } else
                return;
        }
        
        this._evaluateSingle(changes, changeIndex);
    };
    
    changeCallback.prototype._evaluateSingle = function (changes, changeIndex) {
		///<summary>Abstract. Evaluate a single change</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="index" type="Number">The index of the change to execute</param>
		///<returns type="Any">The return value of the callback</param>
		
        throw "Abstract methods must be implemented";
    };

    changeCallback.prototype.evaluateMultiple = function (changes) {
		///<summary>Evaluate on batch of changes</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<returns type="Any">The return value of the callback</param>
		
        if (this.evaluateOnEachChange || !changes.length) return;

        if (this._activated === false) return changeCallback.dispose;
        
        var beginAt = 0, endAt = changes.length, output = undefined;
        if (!this.hasOwnProperty("_activated")) {
            beginAt = changes.indexOf(this._activatingChange);
            if (beginAt !== -1) {            
                this._activated = true;
                delete this._activatingChange;
            }
            
            // if == -1 case later on
        }

        if (this._deactivatingChange) {
            endAt = changes.indexOf(this._deactivatingChange);
            if (endAt === -1) {
                endAt = changes.length;                
            } else {
                output = changeCallback.dispose;
                this._activated = false;
                delete this._deactivatingChange;
            }
        }
                
        if (beginAt !== -1 && beginAt < endAt) {
            this._evaluateMultiple(changes, beginAt, endAt);
        }
        
        return output;
    };
    
    changeCallback.prototype._evaluateMultiple = function (changes, beginAt, endAt) {
		///<summary>Evaluate on batch of changes</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="beginAt" type="Number">The index of the first change to execute</param>
		///<param name="endAt" type="Number">The index of the change after the last change to execute</param>
		///<returns type="Any">The return value of the callback</param>
		
        throw "Abstract methods must be implemented";
    };
    
    return changeCallback;
});

Class("busybody.arrayBase", function () {
        
    var arrayBase = orienteer.extend.call(Array, function arrayBase (initialValues) {
		///<summary>A base for arrays using or not using Object.observe</summary>
		///<param name="initialValues" type="[Any]">Initial values for the array</param>
        
        Array.call(this);
        
        if (arguments.length)
            if (!(arguments[0] instanceof Array))
                throw "The initial values must be an array";
        
        this.$disposables = [];
        this.$boundArrays = [];
        this.$callbacks = [];
        this.$changeBatch = [];
        this.$length = initialValues ? initialValues.length : 0;    
        
        if (initialValues)
            for(var i = 0, ii = initialValues.length; i < ii; i++)
                this[i] = initialValues[i]; // doing it this way as it will not publish changes
    });
    
    arrayBase.prototype._super = orienteer.prototype._super;
    arrayBase.extend = orienteer.extend;
    
    arrayBase.isValidArrayChange = function (change) {
		///<summary>Returns whether the change is to the array elements or an array property</summary>
		///<param name="change" type="Object">The change</param>
		///<returns type="Boolean">Result</returns>
		
        return change.type === "splice" || !isNaN(parseInt(change.name));
    };
         
    arrayBase.prototype.onNextArrayChange = function (callback) {
		///<summary>Fire a callback once, the next array change</summary>
		///<param name="callback" type="Function">The callback</param>
        
        throw "Abstract methods must be implemented";
    };
         
    arrayBase.prototype.processChangeBatch = function () {
		///<summary>Process the current batch of changes</summary>
        
        var changeBatch = this.$changeBatch.slice();
        this.$changeBatch.length = 0;

        busybody.utils.observeCycleHandler.instance.execute(this, (function () {
        	enumerateArr(busybody.observableBase.processChanges(this.$callbacks, changeBatch), function (c) { c(); });
		}).bind(this));
    };
    
    arrayBase.prototype.registerChangeBatch = function (changes) {
		///<summary>Register a batch of changes to this array</summary>
		///<param name="changes" type="[Object]">The changes</param>
        
        // not interested in property changes
        for (var i = changes.length - 1; i >= 0; i--)
            if (!arrayBase.isValidArrayChange(changes[i]))
                changes.splice(i, 1);
        
        return busybody.observableBase.prototype.registerChangeBatch.call(this, changes);
    };
            
    function changeIndex(index) {
        if (typeof index === "number" && index % 1 === 0) {
            return index;
        } else if (index === null) {
            return 0;
        } else if (typeof index === "boolean") {
            return index ? 1 : 0;
        } else if (typeof index === "string" && !isNaN(index = parseFloat(index)) && index % 1 === 0) {
            return index;
        }

        return undefined;
    }

    Object.defineProperty(arrayBase.prototype, "length", {
        set: function(v) {
            if ((v = changeIndex(v)) === undefined) 
                throw RangeError("Invalid array length");

            if (v === this.$length)
                return;

            if(!this.__alteringArray) {
                if(v > this.$length) {
                    var args = new Array(v - this.length + 2);
                    args[0] = this.length;
                    args[1] = 0;
                    this.splice.apply(this, args);
                } else if(v < this.$length) {
                    this.splice(v, this.length - v);
                }
            }
			
            this.$length = v;
        },
        get: function() {
            return this.$length;
        }
    });

    arrayBase.prototype._init = function () {
		///<summary>Begin observing</summary>
		
        throw "Abstract methods must be implemented";
    };
    
    arrayBase.prototype.observe = function (callback, context, options) {
		///<summary>Observe for array changes</summary>
		///<param name="callback" type="Function">The callback</param>
		///<param name="context" type="Any">The "this" value in the callback</param>
		///<param name="options" type="Object" optional="true">Options on when the callback is executed and what it's args will be</param>
		///<param name="options.useRawChanges" type="Boolean">Default: false. Use the change objects from the Array.observe as arguments</param>
		///<param name="options.evaluateOnEachChange" type="Boolean">Default: false. Evaluate once for each change rather than on an amalgamation of changes</param>
		///<returns type="busybody.disposable">A disposable</returns>
		
        if (typeof arguments[0] === "string") {			
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 0, this);
            return busybody.observe.apply(null, args);
        }
		
		return this.addCallback(new busybody.callbacks.arrayCallback(callback, context, options));
    };
	
	arrayBase.prototype.disposableFor = function (changeCallback) {
		///<summary>Create an object to dispose of a changeCallback</summary>
		///<param name="changeCallback" type="busybody.callbacks.arrayCallback">The callback</param>
		///<returns type="Object">A disposable</returns>
		
		var dispose = {
			dispose: (function (allowPendingChanges) {

				if (!dispose) return;
				dispose = null;

				if (allowPendingChanges)
					this.onNextArrayChange(function (change) {
						changeCallback.deactivate(change);
					});
				else
					changeCallback.deactivate();
			}).bind(this)
		};
		
		return dispose;
	};
    
	var boundArrayStopKey = "busybody-do-not-apply-to";
    arrayBase.prototype.alteringArray = function(method, args) {
		///<summary>Execute logic which will alter this array. Apply changes to any bound arrays.</summary>
		///<param name="method" type="String">A method pointer which will alter the array</param>
		///<param name="args" type="[]">The arguments to the method</param>
				
        if (this.__alteringArray)
            throw "Calls to alteringArray must be synchronus and not nested.";
			
		try {
			this.__alteringArray = true;
			
			enumerateArr(this.$boundArrays, function (array) {
				if (array[boundArrayStopKey])
					throw "Circular reference in array bindings found";
				
				if (this[boundArrayStopKey] === array) return;
								
				array[boundArrayStopKey] = this;
				array[method].apply(array, args);
			}, this);
			
			return Array.prototype[method].apply(this, args);
		} finally {
			this.__alteringArray = false;
			enumerateArr(this.$boundArrays, function (array) {
				delete array[boundArrayStopKey];
			});
		}
    };

    arrayBase.copyAll = function (from, to, convert) {
		///<summary>Copy the contents of one array to another</summary>
		///<param name="from" type="[]">The from array</param>
		///<param name="to" type="[]">The to array</param>
		///<param name="convert" type="Function">A function to convert values before copy</param>
        
        var args;
        if (convert) {
            args = [];
            enumerateArr(from, function (item) {
                args.push(convert(item));
            });
        } else {
            args = from.slice();
        }
        
        args.splice(0, 0, 0, to.length);
        to.splice.apply(to, args);
    };
    
    arrayBase.prototype.bind = function(anotherArray) {
		///<summary>Bind arrays</summary>
		///<param name="anotherArray" type="[]">The other array</param>
		///<returns type="busybody.disposable">A disposable</returns>
        
        if (!anotherArray || this.$boundArrays.indexOf(anotherArray) !== -1) return;
		
		this.$boundArrays.push(anotherArray);
        
        if (!(anotherArray instanceof busybody.array) || anotherArray.$boundArrays.indexOf(this) === -1)
            arrayBase.copyAll(this, anotherArray);
		
		return new busybody.disposable((function () {
			if (!anotherArray) return;
			var i;
			if ((i = this.$boundArrays.indexOf(anotherArray)) !== -1)
				this.$boundArrays.splice(i, 1);
			
			anotherArray = null;
		}).bind(this));
    };
	
	arrayBase.prototype.addCallback = function (callback) {
		///<summary>Add an array callback</summary>
		///<param name="callback" type="busybody.callbacks.arrayCallback">The callback</param>
		///<returns type="busybody.disposable">A disposable</returns>
		
        this._init();

        this.$callbacks.push(callback);

        this.onNextArrayChange(function (change) {
            callback.activate(change);
        });
        
        var dispose = this.disposableFor(callback);
        
        this.$disposables.push(dispose);
        
        return dispose;
	};
    
    arrayBase.prototype.dispose = function() {
		///<summary>Dispose of the array</summary>
		
        enumerateArr(this.$disposables, function (d) {
            d.dispose();
        });
        
        this.$disposables.length = 0;        
        this.$boundArrays.length = 0;
        this.$callbacks.length = 0;
    };
    
    return arrayBase;
});

useObjectObserve ?
Class("busybody.array", function () {
    
    var array = busybody.arrayBase.extend(function array (initialValues) {
		///<summary>An observable array</summary>
		///<param name="initialValues" type="[Any]">Initial values for the array</param>
		
		if (this === busybody)
			return new array(initialValues);
		
        this._super.apply(this, arguments);
    });
         
    array.prototype.onNextArrayChange = function (callback) {
		///<summary>Fire a callback once, the next array change</summary>
		///<param name="callback" type="Function">The callback</param>

        var cb = (function (changes) {
            if (!cb) return;
            for (var i = 0, ii = changes.length; i < ii; i++) {
                if (busybody.arrayBase.isValidArrayChange(changes[i])) {    
                    Array.unobserve(this, cb);
                    cb = null;
                    callback(changes[i]);
                    return;
                }
            }
        }).bind(this);

        Array.observe(this, cb);
    };
    
    array.prototype.captureArrayChanges = function (logic, callback) {
		///<summary>Capture all of the changes to the array perpetrated by the logic</summary>
		///<param name="logic" type="Function">The function which will change the array</param>
		///<param name="callback" type="Function">The callback (function (changes) { })</param>
        
        var cb = function (changes) {
            changes = changes.slice();
            for (var i = changes.length - 1; i >= 0; i--)
                if (!busybody.arrayBase.isValidArrayChange(changes[i]))
                    changes.splice(i, 1);

            callback(changes);
        };
        
        Array.observe(this, cb);
        logic();
        Array.unobserve(this, cb);
    };

    array.prototype._init = function () {
		///<summary>Begin observing</summary>
		
        if (this.__subscription) return;
        
        this.__subscription = this.registerChangeBatch.bind(this);
        Array.observe(this, this.__subscription);
    };
    
    array.prototype.dispose = function () {
		///<summary>Dispose of this</summary>
		
        this._super();        
        
        if (this.__subscription) {
            Array.unobserve(this, this.__subscription);
            delete this.__subscription;
        }
    };
		///<summary>Capture all of the changes to the array perpetrated by the logic</summary>
		///<param name="logic" type="Function">The function which will change the array</param>
		///<param name="callback" type="Function">The callback (function (changes) { })</param>
    
    return array;
}) :
Class("busybody.array", function () {
    
    var array = busybody.arrayBase.extend(function array (initialValues) {
		///<summary>An observable array</summary>
		///<param name="initialValues" type="[Any]">Initial values for the array</param>
		
		if (this === busybody)
			return new array(initialValues);
        
        this._super.apply(this, arguments);
        
        this.$onNextArrayChanges = [];
        this.$captureCallbacks = [];
    }); 
    
    array.prototype.captureArrayChanges = function (logic, callback) {
		///<summary>Capture all of the changes to the array perpetrated by the logic</summary>
		///<param name="logic" type="Function">The function which will change the array</param>
		///<param name="callback" type="Function">The callback (function (changes) { })</param>
        
        var cb = function (changes) {
            changes = changes.slice();
            for (var i = changes.length - 1; i >= 0; i--)
                if (!busybody.arrayBase.isValidArrayChange(changes[i]))
                    changes.splice(i, 1);

            callback(changes);
        };
        
        this.$captureCallbacks.push(cb);
        logic();
        this.$captureCallbacks.splice(this.$captureCallbacks.indexOf(cb), 1);
    };
    
    array.prototype.registerChangeBatch = function (changes) {
		///<summary>Register a batch of changes to this array</summary>
		///<param name="changes" type="[Object]">The changes</param>
		
        for (var i = 0, ii = changes.length; i < ii; i++) {
            if (busybody.arrayBase.isValidArrayChange(changes[i])) {
                enumerateArr(this.$onNextArrayChanges.splice(0, this.$onNextArrayChanges.length), function (cb) {
                    cb(changes[i]);
                });
                
                break;
            }
        }
        
        enumerateArr(this.$captureCallbacks, function (cb) {
            cb(changes);
        });
        
        return this._super(changes);
    };
         
    array.prototype.onNextArrayChange = function (callback) {
		///<summary>Fire a callback once, the next array change</summary>
		///<param name="callback" type="Function">The callback</param>

        this.$onNextArrayChanges.push(callback);
    };

    array.prototype._init = function () {
		///<summary>Begin observing</summary>
		
        // unneeded
    };
    
    return array;
});

(function () {
    
    var array = busybody.array;
    
    array.prototype.replace = function(index, replacement) {
		///<summary>Replace an element in the array and notify the change handler</summary>
		///<param name="index" type="Number">The index</param>
		///<param name="replacement" type="Any">The replacement</param>
		///<returns type="Any">The replacement</returns>
		
		this.splice(index, index >= this.length ? 0 : 1, replacement);
        return replacement;
    };

    array.prototype.pop = function() {
		///<summary>Remove and return the last element of the array</summary>
		///<returns type="Any">The value</returns>

        if (!useObjectObserve)
            if (this.length)
                this.registerChangeBatch([{
                    addedCount: 0,
                    index: this.length - 1,
                    object: this,
                    removed: [this[this.length - 1]],
                    type: "splice"
                }]);

        return this.alteringArray("pop");
    };

    array.prototype.shift = function() {
		///<summary>Remove and return the first element in the array</summary>
		///<returns type="Any">The value</returns>

        if (!useObjectObserve)
            if (this.length)
                this.registerChangeBatch([{
                    addedCount: 0,
                    index: 0,
                    object: this,
                    removed: [this[0]],
                    type: "splice"
                }]);

        return this.alteringArray("shift");
    };

    array.prototype.remove = function(item) {
		///<summary>Remove an item from the array and reduce the length by 1</summary>
		///<param name="item" type="Any">The item</param>
		///<returns type="Boolean">Whether the array contained the element or not</returns>

        var i;
        if ((i = this.indexOf(item)) !== -1) {
            this.splice(i, 1);
			return true;
		}
		
		return false;
    };

    array.prototype.push = function() {
		///<summary>Add all of the arguments to the end of this array</summary>
		///<returns type="Number">The new length</returns>

        if (!useObjectObserve)
            this.registerChangeBatch([{
                addedCount: arguments.length,
                index: this.length,
                object: this,
                removed: [],
                type: "splice"
            }]);

        return this.alteringArray("push", arguments);
    };

    array.prototype.reverse = function() {
		///<summary>Reverse the contents of this array</summary>

		var length = this.length;
		if (length < 2) return;
		
        if (!useObjectObserve) {
                
            var half = Math.floor(length / 2), cb = [], i2;
            for (var i = 0; i < half; i++) {
            
                cb.push({
                    name: i.toString(),
                    object: this,
                    oldValue: this[i],
                    type: "update"
                });
				
				i2 = length - i - 1;
                cb.push({
                    name: i2.toString(),
                    object: this,
                    oldValue: this[i2],
                    type: "update"
                });
            }
			
            this.registerChangeBatch(cb);
        }
        
        return this.alteringArray("reverse");
    };

    array.prototype.sort = function(sortFunction) {
		///<summary>Sort the elements in the array</summary>
		///<param name="sortFunction" type="Function">A function to compare items</param>
		///<returns type="[]">this</returns>
		
        if (!useObjectObserve) {
                
			var copy = this.slice(), cb = [];
        	var output = this.alteringArray("sort", arguments);
			
			for (var i = 0, ii = copy.length; i < ii; i++)
				if (copy[i] !== this[i])
					cb.push({
						name: i.toString(),
						object: this,
						oldValue: copy[i],
						type: "update"
					});
			
            this.registerChangeBatch(cb);			
			return output;
        }
        
        return this.alteringArray("sort", arguments);
    };

    array.prototype.splice = function(index, removeCount, addItems) {
		///<summary>Add and remove items from an array</summary>
		///<param name="index" type="Number">The point in the array to begin</param>
		///<param name="removeCount" type="Number">The number of items to remove</param>
		///<param name="addItems" type="Any" optional="true">All other arguments will be added to the array</param>
		
        if (!useObjectObserve) {
            var removed = [];
            for(var i = index, ii = removeCount + index > this.length ? this.length : removeCount + index; 
                i < ii; 
                i++)
                removed.push(this[i]);

            this.registerChangeBatch([{
                addedCount: arguments.length - 2,
                index: index,
                object: this,
                removed: removed,
                type: "splice"
            }]);
        }

        return this.alteringArray("splice", arguments);
    };

    //TODO
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
}());


Class("busybody.callbacks.arrayCallback", function () {
        
    var arrayCallback = busybody.callbacks.changeCallback.extend(function arrayCallback(callback, context, options) {
		///<summary>Evaluate array changes</summary>
		///<param name="callback" type="Function">The callback to execute</param>
		///<param name="context" type="Any" optional="true">The "this" in the callback</param>
		///<param name="options" type="Object" optional="true">Options for the callback</param>
		///<param name="options.useRawChanges" type="Boolean">Default: false. Use the change objects from the Array.observe as arguments</param>
		///<param name="options.evaluateOnEachChange" type="Boolean">Default: false. Evaluate once for each change rather than on an amalgamation of changes</param>
		
        this._super(options && options.evaluateOnEachChange);
        
		///<summary type="Boolean">Use the change objects from the Array.observe as arguments</summary>
		this.useRawChanges = options && options.useRawChanges;
		
		///<summary type="Function">The callback to execute</summary>
        this.callback = callback;
		
		///<summary type="Any" optional="true">The "this" in the callback</summary>
        this.context = context;
    });

    arrayCallback.prototype._evaluateSingle = function (changes, index) {
		///<summary>Evaluate a single change</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="index" type="Number">The index of the change to execute</param>
		///<returns type="Any">The return value of the callback</param>

        this.callback.call(this.context, changes[index]);
    };

    arrayCallback.prototype._evaluateMultiple = function (changes, beginAt, endAt) {
		///<summary>Evaluate on batch of changes</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="beginAt" type="Number">The index of the first change to execute</param>
		///<param name="endAt" type="Number">The index of the change after the last change to execute</param>
		///<returns type="Any">The return value of the callback</param>
		
		if (this.useRawChanges) {
			this.callback.call(this.context, changes.slice(beginAt, endAt));
			return;
		}
                
        if (!changes.compiled)
            changes.compiled = [];
        
        var result;
        for (var i = 0, ii = changes.compiled.length; i < ii; i++) {
            if (changes.compiled[i].areEqual(beginAt, endAt)) {
                result = changes.compiled[i];
                break;
            }
        }
        
        if (!result)
            changes.compiled.push(result = new busybody.utils.compiledArrayChange(changes, beginAt, endAt));
        
        this._evaluateArrayMultiple(result);
    };

    arrayCallback.prototype._evaluateArrayMultiple = function (result) {
		///<summary>Evalue the callback</summary>
		///<param name="result" type="busybody.utils.compiledArrayChange">Inputs for the callback</param>
		///<returns type="Any">The return value of the callback</param>
        
        this.callback.call(this.context, result.getRemoved(), result.getAdded(), result.getIndexes());
    };
    
    return arrayCallback;
});


Class("busybody.callbacks.propertyCallback", function () {
        
    var propertyCallback = busybody.callbacks.changeCallback.extend(function propertyCallback(callback, context, options) {
		///<summary>Evaluate property changes</summary>
		///<param name="callback" type="Function">The callback to execute</param>
		///<param name="context" type="Any" optional="true">The "this" in the callback</param>
		///<param name="options" type="Object" optional="true">Options for the callback</param>
		///<param name="options.useRawChanges" type="Boolean">Default: false. Use the change objects from the Array.observe as arguments</param>
		///<param name="options.evaluateOnEachChange" type="Boolean">Default: false. Evaluate once for each change rather than on an amalgamation of changes</param>
		///<param name="options.evaluateIfValueHasNotChanged" type="Boolean">Default: false. Evaluate if the oldValue and the newValue are the same</param>
		
        this._super(options && options.evaluateOnEachChange);
        
		///<summary type="Function">The callback to execute</summary>
        this.callback = callback;
		
		///<summary type="Any" optional="true">The "this" in the callback</summary>
        this.context = context;
        this.evaluateIfValueHasNotChanged = options && options.evaluateIfValueHasNotChanged;
		
		///<summary type="Boolean">Default: false. Evaluate if the oldValue and the newValue are the same</summary>
		this.useRawChanges = options && options.useRawChanges;
    });

    propertyCallback.prototype._evaluateSingle = function (changes, index) {
		///<summary>Evaluate a single change</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="index" type="Number">The index of the change to execute</param>
		///<returns type="Any">The return value of the callback</param>

        var change = changes[index], 
            nextChange = changes[index + 1], 
            newVal = nextChange ? nextChange.oldValue : change.object[change.name];
        
		if (this.useRawChanges)
            this.callback.call(this.context, change);
        else if (this.evaluateIfValueHasNotChanged || newVal !== change.oldValue)
            this.callback.call(this.context, change.oldValue, newVal);
    };

    propertyCallback.prototype._evaluateMultiple = function (changes, beginAt, endAt) {
		///<summary>Evaluate on batch of changes</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="beginAt" type="Number">The index of the first change to execute</param>
		///<param name="endAt" type="Number">The index of the change after the last change to execute</param>
		///<returns type="Any">The return value of the callback</param>
		
		var newVal = changes[endAt] ? changes[endAt].oldValue : changes[0].object[changes[0].name];
        
		if (this.useRawChanges)
            this.callback.call(this.context, changes.slice(beginAt, endAt));
        else if (this.evaluateIfValueHasNotChanged || newVal !== changes[beginAt].oldValue)
            this.callback.call(this.context, changes[beginAt].oldValue, newVal);
    };
    
    return propertyCallback;
});

    
var observable = useObjectObserve ?
    Class("busybody.observable", function () {
        var observable = busybody.observableBase.extend(function observable(forObject) {
			///<summary>An object whose properties can be subscribed to</summary>
			///<param name="forObject" type="Object" optional="true">Observe changes to another object</param>
			
            this._super(forObject);
        });

        observable.prototype.onNextPropertyChange = function (property, callback) {
			///<summary>Fire a callback once, the next property change</summary>
			///<param name="property" type="String">The property to observe</param>
			///<param name="callback" type="Function">The callback</param>

            var cb = (function (changes) {
                if (!cb) return;
                for (var i = 0, ii = changes.length; i < ii; i++) {
                    if (changes[i].name == property) {	// in this case numbers and strings are the same
                        var _cb = cb;
                        Object.unobserve(this.$forObject || this, _cb);
                        cb = null;
                        callback(changes[i]);
                        return;
                    }
                }
            }).bind(this);

            Object.observe(this.$forObject || this, cb);
        };

        observable.prototype._captureChanges = function (logic, callback) {
			///<summary>Capture all of the changes to the property perpetrated by the logic</summary>
			///<param name="logic" type="Function">The function which will change the array</param>
			///<param name="callback" type="Function">The callback (function (changes) { })</param>
			///<param name="toProperty" type="String">The property</param>
			
			Object.observe(this.$forObject || this, callback);
			logic();
			Object.unobserve(this.$forObject || this, callback);
        };

        observable.prototype._init = function () {
			///<summary>Begin observing a property</summary>
			///<param name="forProperty" type="String">The property</param>
			
            if (this.__subscribeCallback) return;

            this.__subscribeCallback = this.registerChangeBatch.bind(this);
            Object.observe(this.$forObject || this, this.__subscribeCallback);
        };

        observable.prototype.dispose = function () {
			///<summary>Dispose</summary>
			
            this._super();

            if (this.__subscribeCallback) {
                Object.unobserve(this.$forObject || this, this.__subscribeCallback);
                delete this.__subscribeCallback;
            }
        };

        return observable;
    }) :
    Class("busybody.observable", function () {
        var observable = busybody.observableBase.extend(function observable(forObject) {
			///<summary>An object whose properties can be subscribed to</summary>
			///<param name="forObject" type="Object" optional="true">Observe changes to another object</param>
			
            this._super(forObject);

            this.$observed = {};
            this.$onNextPropertyChanges = {};
            this.$captureCallbacks = [];
        });

        observable.prototype.onNextPropertyChange = function (property, callback) {
			///<summary>Fire a callback once, the next property change</summary>
			///<param name="property" type="String">The property to observe</param>
			///<param name="callback" type="Function">The callback</param>

            (this.$onNextPropertyChanges[property] || (this.$onNextPropertyChanges[property] = [])).push(callback);
        };

        observable.prototype._captureChanges = function (logic, callback) {
			///<summary>Capture all of the changes to the property perpetrated by the logic</summary>
			///<param name="logic" type="Function">The function which will change the array</param>
			///<param name="callback" type="Function">The callback (function (changes) { })</param>
			///<param name="toProperty" type="String">The property</param>

            this.$captureCallbacks.push(callback);
            logic();
            this.$captureCallbacks.splice(this.$captureCallbacks.indexOf(callback), 1);
        };

		//TODO: prototype
        function getObserver(forObject) { return forObject.$observer || forObject; }
        observable.prototype._init = function (forProperty) {
			///<summary>Begin observing a property</summary>
			///<param name="forProperty" type="String">The property</param>

            if (this.$observed.hasOwnProperty(forProperty)) return;

            if ((this.$forObject || this).hasOwnProperty(forProperty))
                this.$observed[forProperty] = (this.$forObject || this)[forProperty];

            Object.defineProperty(this.$forObject || this, forProperty, {
                get: function() {
                    return getObserver(this).$observed[forProperty];
                },
                set: function (value) {

                    var obs = getObserver(this);
                    var change = {
                        type: obs.$observed.hasOwnProperty(forProperty) ? "update" : "add",
                        name: forProperty,
                        object: this,
                        oldValue: obs.$observed[forProperty]
                    };
                    obs.$observed[forProperty] = value;
                    if (obs.$onNextPropertyChanges[forProperty]) {
                        var callbacks = obs.$onNextPropertyChanges[forProperty];
                        delete obs.$onNextPropertyChanges[forProperty];
                        setTimeout(function () {
                            enumerateArr(callbacks, function (a) {
                                a(change);
                            });
                        });
                    }

                    obs.addChange(change);

                },
                enumerable: true,
                configurable: true
            });
        };
        
        observable.prototype.addChange = function (change) {
			///<summary>Add a change to the batch</summary>
			///<param name="change" type="Object">The change</param>
            
            if (!this.__changeToken) {
                this.__changeToken = [];
                setTimeout((function () {
                    var ct = this.__changeToken;
                    delete this.__changeToken;                    
                    this.registerChangeBatch(ct);
                }).bind(this));
            }
            
            this.__changeToken.push(change);
            enumerateArr(this.$captureCallbacks, function (cb) {
                cb([change]);
            });          
        };
    
        observable.prototype.del = function (property) {
			///<summary>Delete a property and publish changes.</summary>
			///<param name="property" type="String">The property</param>

            (this.$forObject || this)[property] = undefined;
            this._super(property);
        }

        observable.prototype.dispose = function () {
			///<summary>Dispose.</summary>
			
            this._super();
            for (var i in this.$onNextPropertyChanges)
                delete this.$onNextPropertyChanges[i];
        };

        return observable;
    });

//TODO: look into esprima and falafel

Class("busybody.observeTypes.computed", function () {
    
    var WITH = /\s*with\s*\(/g;
    var GET_ARGUMENT_NAMES = /([^\s,]+)/g;
    var STRIP_INLINE_COMMENTS = /\/\/.*$/mg;  
    var STRIP_BLOCK_COMMENTS = /\/\*[\s\S]*?\*\//mg;
    var GET_ITEMS = "((\\s*\\.\\s*([\\w\\$]*))|(\\s*\\[\\s*\\d\\s*\\]))+"; // ".propertyName" -or- "[2]"
    var completeArg = {};
	
    var computed = busybody.observeTypes.observeTypesBase.extend(function computed(callback, context, options) {
		///<summary>A value defined by the return value of a function. If configured correctly, a change in a value within the function will trigger a re-execution of the function</summary>
		///<param name="callback" type="Function">The logic which returns the computed value</param>
		///<param name="context" type="Any">The "this" value in the callback</param>
		///<param name="options" type="Object" optional="true">Options on how the computed is composed</param>
		///<param name="options.watchVariables" type="Object">Default: null. A dictionary of variables in the callback which are to be watched</param>
		///<param name="options.observeArrayElements" type="Boolean">Default: false. If set to true, the computed will attempt to watch values within any array watch variables. This is useful if the computed is an aggregate function. The default is false because it is expensive computationally</param>
		///<param name="options.allowWith" type="Boolean">Default: false. If set to true, "with (...)" statements are allowed in the computed function. Although variables accessed within the with statement cannot be observed</param>
		///<param name="options.delayExecution" type="Boolean">Default: false. If set to true, the computed will not be activated until it's execute function is called or a value within the computed changes</param>
        
        this._super();
        
        options = options || {};
		
		///<summary type="[Any]">A list of arguments to be applied to the callback function</summary>
        this.arguments = []; 
		if (options.observeArrayElements)
			this.possibleArrays = [];
        
		///<summary type="[Function]">A list of callbacks which will be called when the computed value changes</summary>
		this.callbacks = [];
		
		///<summary type="String">The computed logic as a string with comments and strings removed</summary>
        this.callbackString = computed.stripFunction(callback);
		
		///<summary type="Function">The computed logic</summary>
        this.callbackFunction = callback;
		
		///<summary type="Any">The "this" in the computed logic</summary>
        this.context = context;
        
        if (!options.allowWith && computed.testForWith(this.callbackString))
                throw "You cannot use the \"with\" keyword in computed functions by default. To allow \"with\", use the allowWith flag on the options argument of the constructor, however, properties of the variable within the \"with\" statement cannot be monitored for change.";
                
        // get all argument names
        var args = this.callbackString.slice(
            this.callbackString.indexOf('(') + 1, this.callbackString.indexOf(')')).match(GET_ARGUMENT_NAMES) || [];
        
        // get all watch variables which are also arguments
        if (options.watchVariables && args.length) {            
            var tmp;
            for (var i in options.watchVariables) {
                // if variable is an argument, add it to args
                if ((tmp = args.indexOf(i)) !== -1) {
                    this.arguments[tmp] = options.watchVariables[i];
                    args[tmp] = completeArg;
                }
            }
        }
        
        // checking that all args have been set
        enumerateArr(args, function(arg) {
            if (arg !== completeArg)
                throw "Argument \"" + arg + "\" must be added as a watch variable.";
        });
        
        // watch each watch variable
        this.watchVariable("this", context, options.observeArrayElements);
        if (options.watchVariables) {
            for (var i in options.watchVariables) {                
                this.watchVariable(i, options.watchVariables[i], options.observeArrayElements);
            }
        }
        
		if (!options.delayExecution)
        	this.execute();
    });
    
    computed.testForWith = function (input) {
		///<summary>Determine if a function string contains a "with (...)" call</summary>
		///<param name="input" type="String">The input</param>
		///<returns type="Boolean">The result</param>
		
        WITH.lastIndex = 0;
        
        while (WITH.exec(input)) {
            
            if (!/[\.\w\$]/.test(input[WITH.lastIndex - 1]))
                return true;
        }
        
        return false;
    };
        
    computed.prototype.rebuildArrays = function() {
		///<summary>Re-subscribe to all possible arrays</summary>
		
		enumerateArr(this.possibleArrays, function (possibleArray) {
			if (possibleArray.disposeKeys && possibleArray.disposeKeys.length) {
				this.disposeOf(possibleArray.disposeKeys);
				possibleArray.disposeKeys.length = 0;
			}	
			
			var array = possibleArray.path.length ? 
				busybody.utils.obj.getObject(possibleArray.path, possibleArray.root) : 
				possibleArray.root;
			
			if (array instanceof Array) {
				possibleArray.disposeKeys = possibleArray.disposeKeys || [];
				enumerateArr(array, function (item) {
					enumerateArr(possibleArray.subPaths, function (subPath) {
						possibleArray.disposeKeys.push(this.addPathWatchFor(item, subPath));
					}, this);
				}, this);
			}
		}, this);
	};
        
	// abstract
    computed.prototype.getValue = function() {
		///<summary>Execute the computed function</summary>
		///<returns type="Any">The result</param>
		
		if (this.possibleArrays)
			this.rebuildArrays();
		
		return this.callbackFunction.apply(this.context, this.arguments);
    };
    
    computed.prototype.bind = function (object, property) {
		///<summary>Bind the value of this computed to the property of an object</summary>
		///<param name="object" type="Object">The object</param>
		///<param name="property" type="String">The property</param>
		///<returns type="busybody.disposable">A dispose object</param>
		
        var callback = computed.createBindFunction(object, property);
		var output = this.onValueChanged(callback, true);
        output.registerDisposable(callback);
		
        return output;
    };
    
    computed.prototype.onValueChanged = function (callback, executeImmediately) {
		///<summary>Execute a callback when the value of the computed changes</summary>
		///<param name="callback" type="Function">The callback: function (oldValue, newValue) { }</param>
		///<param name="executeImmediately" type="Boolean">If set to true the callback will be executed immediately with undefined as the oldValue</param>
		///<returns type="busybody.disposable">A dispose object to remove the callback</param>
              
		var output = this.addCallback(callback);		
        if (executeImmediately)
            callback(undefined, this.val);
		
        return output;
    };
        
	//TODO: somehow retain "this.prop['val']"
    computed.stripFunction = function(input) {
        input = input
            .toString()
            .replace(STRIP_INLINE_COMMENTS, "")
            .replace(STRIP_BLOCK_COMMENTS, "");
        
        var regex = /["']/g;
        
        // leading "
        while (regex.exec(input)) {
            
            var r = input[regex.lastIndex - 1] === "'" ? /'/g : /"/g;
            r.lastIndex = regex.lastIndex;
            
            // trailing "
            while (r.exec(input)) {
                
                var backslashes = 0;
                for (var i = r.lastIndex - 2; input[i] === "\\"; i--)
                    backslashes++;

                if (backslashes % 2 === 0) {
                    input = input.substr(0, regex.lastIndex - 1) + "#" + input.substr(r.lastIndex);
                    break;
                }
            }
        }
        
        return input;
    };
    
    computed.prototype.examineVariable = function(variableName, complexExamination) {
		///<summary>Find all property paths of a given variable</summary>
		///<param name="variableName" type="String">The variable name</param>
		///<param name="complexExamination" type="Boolean">If set to true, the result will include the indexes of the property path as well as the actual text of the property paths</param>
		///<returns type="[Object]">The results</param>
		
		variableName = trim(variableName);
		if (!/^[\$\w]+$/.test(variableName))
			throw "Invalid variable name. Variable names can only contain 0-9, a-z, A-Z, _ and $";
		
        var match, 
            output = [], 
			r = variableName.replace("$", "\\$"),
            regex = new RegExp((complexExamination ? "(" : "") + r + GET_ITEMS + (complexExamination ? ")|" + r : ""), "g"),
			foundVariables = [], 
			foundVariable, 
			index,
			i;
        
        // find all instances of the variableName
        while ((match = regex.exec(this.callbackString)) !== null) {
			index = regex.lastIndex - match[0].length;
			
			// if the variable has been found before and we do not need to find each instance
			if ((i = foundVariables.indexOf(foundVariable = match[0].replace(/\s/g, ""))) !== -1 && !complexExamination)
				continue;

			if (index > 0) {
				// determine whether the instance is part of a bigger variable name
				// do not need to check trailing char as this is filtered by the regex
				if (this.callbackString[index - 1].search(/[\w\$]/) !== -1)  //TODO test (another char before and after)
					continue;

				// determine whether the instance is a property rather than a variable
				for (var j = index - 1; j >= 0; j--) { // TODO: test
					if (this.callbackString[j] === ".") {
						foundVariable = null;
						break;
					} else if (this.callbackString[j].search(/\s/) !== 0) {
						break;
					}
				}
			}
			
			if (foundVariable === null) 
				continue;
			
			// if this is the first time the var has been found
			if (i === -1) {
				foundVariables.push(foundVariable);
				i = output.length;
				output.push({
					variableName: foundVariable,
					complexResults: []
				});
			}
				
			// if we need to record the exact instance
			if (complexExamination) {
				output[i].complexResults.push({
					name: match[0],
					index: index
				});
			}
        }
		
		return output;
	};
    
    computed.prototype.watchVariable = function(variableName, variable, observeArrayElements) {
		///<summary>Create subscriptions to all of the property paths to a specific variable</summary>
		///<param name="variableName" type="String">The variable name</param>
		///<param name="variable" type="Any">The instance of the variable</param>
		///<param name="observeArrayElements" type="Boolean">If set to true, each find will also be treated as a possible array and subscribed to. This is a more expensive process computationally</param>
		
		// find all instances
		var found = this.examineVariable(variableName, observeArrayElements), tmp;

		var arrProps;
        enumerateArr(found, function (item) {
            
			// if there is a path, i.e. variable.property, subscribe to it
            tmp = busybody.utils.obj.splitPropertyName(item.variableName);
			if (tmp.length > 1)
				this.addPathWatchFor(variable, busybody.utils.obj.joinPropertyName(tmp.slice(1)));
			
			// if we are looking for array elements, do more examination for this
			if (observeArrayElements) {
				var possibleArray;
				enumerateArr(item.complexResults, function (found) {
					if (arrProps = this.examineArrayProperties(found.name, found.index)) {
						if (!possibleArray)
							this.possibleArrays.push(possibleArray = {
								root: variable,
								path: busybody.utils.obj.joinPropertyName(tmp.slice(1)),
								subPaths: [arrProps]
							});
						else
							possibleArray.subPaths.push(arrProps);
					}
				}, this);
			}
        }, this);
    };
	
	var getArrayItems = new RegExp("^\\s*\\[\\s*[\\w\\$]+\\s*\\]\\s*" + GET_ITEMS);
	computed.prototype.examineArrayProperties = function (pathName, index) {
		///<summary>Discover whether a property path may be an indexed array</summary>
		///<param name="pathName" type="String">The property path</param>
		///<param name="index" type="Number">The location of the property path</param>
		///<returns type="String">The second half of the possible indexed array property, if any</returns>
		
		var found;
		if (found = getArrayItems.exec(this.callbackString.substr(index + pathName.length))) {
			found = found[0].substr(found[0].indexOf("]") + 1).replace(/\s/g, "");
			return (found[0] === "." ? found.substring(1) : found);
		}
	};
	
    computed.prototype.addPathWatchFor = function(variable, path) {
		///<summary>Add a path watch object, triggering an execute(...) when something chages</summary>
		///<param name="variable" type="Object">The path root</param>
		///<param name="path" type="String">The path</param>
		///<returns type="String">A disposable key. The path can be disposed by calling this.disposeOf(key)</param>
		
		var path = new busybody.observeTypes.pathObserver(variable, path, this.execute, this);
		
		var dispose;
		var te = this.execute.bind(this);
		path.onValueChanged(function(oldVal, newVal) {
			if (dispose) {
				dispose.dispose();
				dispose = null;
			}

			if (newVal instanceof busybody.array)
				dispose = newVal.observe(te);
		}, true);
		
		return this.registerDisposable(path);
	};
	
	computed.createBindFunction = function (bindToObject, bindToProperty) {
		///<summary>Create a functino which will bind the result of the computed to either an object property or an array</summary>
		///<param name="bindToObject" type="Object">The object root</param>
		///<param name="bindToProperty" type="String">The path</param>
		///<returns type="Function">The bind function (function (oldValue, newValue) { }). The function has a dispose property which needs to be called to disposse of any array subscriptions</param>
		
        var arrayDisposeCallback;
        var output = function (oldValue, newValue) {
			
            var existingVal = busybody.utils.obj.getObject(bindToProperty, bindToObject);
            if (newValue === existingVal)
                return;
			
            output.dispose();
			
			if (newValue instanceof Array || existingVal instanceof Array)
				arrayDisposeCallback = busybody.tryBindArrays(newValue, existingVal);
            else
				busybody.utils.obj.setObject(bindToProperty, bindToObject, newValue);
        };
        
        output.dispose = function () {
            if (arrayDisposeCallback) {
                arrayDisposeCallback.dispose();
                arrayDisposeCallback = null;
            }
        };
        
        return output;
    };
    
    return computed;
});

// name is subject to change

Class("busybody.observeTypes.pathObserver", function () {
        
    var pathObserver = busybody.observeTypes.observeTypesBase.extend(function pathObserver (forObject, property, callback, context) {
        ///<summary>Observe a property for change. Should be "call()"ed with this being a "watched"</summary>
        ///<param name="forObject" type="busybody.observable" optional="false">The object to watch</param>
        ///<param name="property" type="String" optional="false">The property</param>
        ///<param name="callback" type="Function" optional="true">A callback for property change</param>
        ///<param name="context" type="Any" optional="true">The context of the callback</param>
		
        this._super();
        
		///<summary type="busybody.observable">The object to observe</summary>
        this.forObject = forObject;
		
		///<summary type="String">The path to observe</summary>
        this.property = property;
        
		///<summary type="[String]">The path split into parts</summary>
        this.path = busybody.utils.obj.splitPropertyName(property);
        
		///<summary type="[busybody.observable]">The subscriptions</summary>
        this.__pathDisposables = new Array(this.path.length);
        this.execute();
        
        this.buildObservableChain();
		
		if (callback)
			this.onValueChanged(callback.bind(context || forObject), false);
    });
    
    pathObserver.prototype.onValueChanged = function (callback, evaluateImmediately) {
		///<summary>Add a new callback</summary>
		///<param name="callback" type="Function">The callback</param>
		///<param name="evaluateImmediately" type="Boolean" optional="true">If true, execute the callback now</param>
		///<returns type="busybody.disposable">A disposable to remove the callback</param>
              
		var output = this.addCallback(callback);		
        if (evaluateImmediately)
            callback(undefined, this.val);
		
        return output;
    };
    
    pathObserver.prototype.buildObservableChain = function (begin) {
		///<summary>Rebuild the observable chain</summary>
		///<param name="begin" type="Number" optional="true">The first element to rebuild</param>
		
        begin = begin || 0;
        
        // dispose of anything in the path after the change
        for (var i = begin; i < this.path.length; i++) {
            if (this.__pathDisposables[i]) {
                this.__pathDisposables[i].dispose();
                this.__pathDisposables[i] = null;
            }
        }

        var current = this.forObject, _this = this;
        
        // get item at index "begin"
        for (i = 0; current && i < begin; i++) {
            current = current[this.path[i]];
        }
        
        // get the last item in the path subscribing to changes along the way
        for (; current && i < this.path.length - 1; i++) {
            if ((busybody.canObserve(current) || current instanceof busybody.array)) {
                
                var args = [current, (function (i) {
                    return function(oldVal, newVal) {
                        _this.buildObservableChain(i);
						_this.execute();
                    };
                }(i))];
                
                if (isNaN(this.path[i])) {
                    args.splice(1, 0, this.path[i]);
                }
                
                this.__pathDisposables[i] = busybody.tryObserve.apply(null, args);
            }

            current = current[this.path[i]];
        }
        
        // observe last item in path
        if (busybody.canObserve(current))
            this.__pathDisposables[i] = busybody.tryObserve(current, this.path[i], function (oldVal, newVal) {
                this.execute();
            }, this);
    };
        
    pathObserver.prototype.getValue = function() {
		///<summary>Evaluate the path observer</summary>
		///<returns type="Any">The value. Returns null rather than a TypeError</param>
		
        var current = this.forObject;
        
        // get item at index "begin"
        for (var i = 0, ii = this.path.length; current != null && i < ii; i++) {
            current = current[this.path[i]];
        }
		
		return i === ii ? current : null;
    };
	
    pathObserver.prototype.dispose = function () {
		///<summary>Dispose of this path observer</summary>
		
        this._super();
        
        for (var i = 0, ii = this.__pathDisposables.length; i < ii && this.__pathDisposables[i]; i++)
            if (this.__pathDisposables[i])
                this.__pathDisposables[i].dispose();

        this.__pathDisposables.length = 0;
    };
                                      
    return pathObserver;
});

// name is subject to change

Class("busybody.utils.compiledArrayChange", function () {
    
    function compiledArrayChange(changes, beginAt, endAt) {
		///<summary>Helper for compiling array change batches</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="beginAt" type="Number">The index of the first change to process</param>
		///<param name="endAt" type="Number">The index of the change after the last change to process</param>
		
        this.beginAt = beginAt;
        this.endAt = endAt;
        this.changes = [];
        
        this.build(changes);
    }
    
    compiledArrayChange.prototype.buildIndexes = function () {
		///<summary>Evaluate the indexes in the batch</summary>
		
        if (this.indexes)
            return;
        
        var tmp, tmp2;
        
        var movedFrom = [],         // an item which was moved
            movedFromIndex = [],    // it's index
            movedTo = [],           // an item which was moved, the items index within this array is the same as the current index in the original array 
            addedIndexes = [],      // indexes of added items. Corresponds to this.added
            removedIndexes = [],    // indexes of removed items. Corresponds to this.removed
            moved = [];             // moved items
        
        // populate addedIndexes and movedTo
        var added = this.added.slice();
        enumerateArr(this.finalArray, function(item, i) {
            if (i >= this.beginArray.length || item !== this.beginArray[i]) {                
                if ((tmp = added.indexOf(item)) !== -1) {
                    addedIndexes.push({
                        value: item,
                        index: i
                    });
                    added.splice(tmp, 1);
                } else {
                    movedTo[i] = item;
                }              
            }
        }, this);
        
        // populate removedIndexes and movedFrom and movedFromIndexes
        var removed = this.removed.slice();
        enumerateArr(this.beginArray, function(item, i) {
            if (i >= this.finalArray.length || item !== this.finalArray[i]) {                
                if ((tmp = removed.indexOf(item)) !== -1) {
                    removedIndexes.push({
                        value: item,
                        index: i
                    });
                    removed.splice(tmp, 1);
                } else {
                    movedFrom.push(item);
                    movedFromIndex.push(i);
                }              
            }
        }, this);
        
        // use movedFrom, movedFromIndexes and movedTo to populate moved 
        var emptyPlaceholder = {};
        while (movedFrom.length) {
            tmp = movedFrom.shift();            
            tmp2 = movedTo.indexOf(tmp);
            movedTo[tmp2] = emptyPlaceholder;   // emptyPlaceholder stops this index from being found again by indexOf
            
            moved.push({
                value: tmp,
                from: movedFromIndex.shift(),
                to: tmp2              
            });
        }
        
        this.indexes = {
            moved: moved,
            added: addedIndexes,
            removed: removedIndexes
        };
    };
    
    //TODO: build based on shifts and adds
    
    compiledArrayChange.prototype.build = function (changes) {  
		///<summary>Evaluate the batch</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		
        this.removed = [];
        this.added = [];
        if (!changes.length || this.beginAt >= this.endAt) {
            this.indexes = {added:[], removed:[], moved:[]};
            return;
        }
        
        var array = changes[0].object.slice(), current, args, tmp, tmp2;
        for (var i = changes.length - 1; i >= this.beginAt; i--) {
            
            // operate on splices only
            current = changes[i].type === "splice" ? changes[i] : {
                addedCount: 1,
                index: parseInt(changes[i].name),
                removed: [changes[i].oldValue]
            };
            
            // begin to register changes after 
            if (i < this.endAt) {
                
                // this is the array after all changes
                if (!this.finalArray)
                    this.finalArray = array.slice();
                
                // add a removed or remmove from added items
                tmp2 = 0;
                enumerateArr(current.removed, function (removed) {
                    if ((tmp = this.added.indexOf(removed)) === -1) {
                        this.removed.splice(tmp2, 0, removed);
                        tmp2++;
                    } else {
                        this.added.splice(tmp, 1);
                    }
                }, this);

                // add an added or remmove from removed items
                tmp2 = 0;
                enumerateArr(array.slice(current.index, current.index + current.addedCount), function (added) {
                    if ((tmp = this.removed.indexOf(added)) === -1) {
                        this.added.splice(tmp2, 0, added);
                        tmp2++;
                    } else {
                        this.removed.splice(tmp, 1);
                    }
                }, this);
                
                this.changes.splice(0, 0, {
                    index: current.index,
                    added: array.slice(current.index, current.index + current.addedCount),
                    removed: current.removed,
                    change: changes[i]
                });
            }
            
            args = current.removed.slice();
            args.splice(0, 0, current.index, current.addedCount);
            array.splice.apply(array, args);
        }
        
        // this is the array before all changes
        this.beginArray = array.slice();
    };
    
    compiledArrayChange.prototype.areEqual = function (beginAt, endAt) {
		///<summary>Determine if two compiledArrayChanges are the same based on the first and last index</summary>
		///<param name="changes" type="[Object]">A list of all changes in the batch</param>
		///<param name="beginAt" type="Number">The index of the first change to execute</param>
		///<param name="endAt" type="Number">The index of the change after the last change to execute</param>
		///<returns type="Boolean">The result</param>
		
        return this.beginAt === beginAt && this.endAt === endAt;
    };
    
    compiledArrayChange.prototype.getRemoved = function () {
		///<summary>Get items removed in this batch</summary>
		///<returns type="[Any]">The items</param>
		
        return this.removed.slice();
    };
    
    compiledArrayChange.prototype.getAdded = function () {
		///<summary>Get items added in this batch</summary>
		///<returns type="[Any]">The items</param>
		
        return this.added.slice();
    };
    
    compiledArrayChange.prototype.getIndexes = function () {
		///<summary>Get detailed batch info</summary>
		///<returns type="Object">The items</param>
		
        if (!this.indexes)
            this.buildIndexes();        
        
        return { 
            added: this.indexes.added.slice(),
            removed: this.indexes.removed.slice(),
            moved: this.indexes.moved.slice()
        };
    };
    
    return compiledArrayChange;    
});

// name is subject to change
//TODO: before/after observe cycle for specific object
Class("busybody.utils.observeCycleHandler", function () {
        
    var observeCycleHandler = busybody.observable.extend(function observeCycleHandler () {
		///<summary>Control observe cycles</summary>
		
        this._super();
        
		///<summary type="[Function]">Callbacks to execute before</summary>
        this.$afterObserveCycles = [];
		
		///<summary type="[Function]">Callbacks to execute after</summary>
        this.$beforeObserveCycles = [];
		
		///<summary type="Number">Current active cycles</summary>
        this.length = 0;
        
        this.observe("length", function (oldVal, newVal) {
            if (newVal === 0)
                enumerateArr(this.$afterObserveCycles.slice(), ex);
        }, this, {
			evaluateOnEachChange: false, 
			evaluateIfValueHasNotChanged: true
		});
    });
	
    observeCycleHandler.prototype.execute = function (forObject, executionLogic) {
		///<summary>Execute an obsder cycle</summary>
		///<param name="forObject" type="Any">The object</param>
		///<param name="executionLogic" type="FUnction">The logic</param>
		
		try {
			this.before(forObject);
			executionLogic();
		} finally {
        	this.after(forObject);
		}
	};

    function ex(callback) { callback(); }
    observeCycleHandler.prototype.before = function (forObject) {
		///<summary>Signal an observe cycle for an object has begun</summary>
		///<param name="forObject" type="Any">The object</param>
		
        if (forObject === this) return;
        
        if (this.length === 0)
            enumerateArr(this.$beforeObserveCycles.slice(), ex);
            
        this.length++;
    };
    
    observeCycleHandler.prototype.clear = function () {
		///<summary>Signal all observe cycles have ended</summary>
		
        if (this.length > 0) this.length = 0;
    };

    observeCycleHandler.prototype.after = function (forObject) {
		///<summary>Signal an observe cycle for an object has ended</summary>
		///<param name="forObject" type="Any">The object</param>
		
        if (forObject === this || this.length <= 0) return;
        
        this.length--;
    };

    observeCycleHandler.prototype.afterObserveCycle = function (callback) {
		///<summary>Execute after each observe cycle</summary>
		///<param name="callback" type="Function">The callback to execute</param>
		///<returns type="busybody.disposable">The dispose callback</param>

        return busybody.utils.obj.addWithDispose(this.$afterObserveCycles, callback);
    };

    observeCycleHandler.prototype.beforeObserveCycle = function (callback) {
		///<summary>Execute before each observe cycle</summary>
		///<param name="callback" type="Function">The callback to execute</param>
		///<returns type="busybody.disposable">The dispose callback</param>

        return busybody.utils.obj.addWithDispose(this.$beforeObserveCycles, callback);
    };

    observeCycleHandler.prototype.dispose = function () {
		///<summary>Dispose of this</summary>

		this._super();
		
        this.$afterObserveCycles.length = 0;
        this.$beforeObserveCycles.length = 0;
    };
    
    observeCycleHandler.instance = new observeCycleHandler();
    
    return observeCycleHandler;
});

    
    busybody.getObserver = function (object) {
		///<summary>Get the observer for an object, if any. The object's observer might be iself</summary>
		///<param name="object" type="Object">The object</param>
		///<returns type="busybody.observable">The observer</returns>
                
        return object == null || object instanceof busybody.observableBase ?
            object :
            (object.$observer instanceof busybody.observableBase ? object.$observer : null);
    };
    
    busybody.captureArrayChanges = function (forObject, logic, callback) {
		///<summary>Capture all of the changes to an array perpetrated by the logic</summary>
		///<param name="forObject" type="busybody.array">The array</param>
		///<param name="logic" type="Function">The function which will change the array</param>
		///<param name="callback" type="Function">The callback (function (changes) { })</param>
		
        if (!(forObject instanceof busybody.array))
            throw "Only busybody.array objects can have changes captured";
        
        return forObject.captureArrayChanges(logic, callback);
    };
    
    busybody.captureChanges = function (forObject, logic, callback, property) {
		///<summary>Capture all of the changes to the property perpetrated by the logic</summary>
		///<param name="forObject" type="Object">The object</param>
		///<param name="logic" type="Function">The function which will change the array</param>
		///<param name="callback" type="Function">The callback (function (changes) { })</param>
		///<param name="property" type="String" optional="true">The property</param>
		
        forObject = busybody.getObserver(forObject);
        
		if (forObject)
        	return forObject.captureChanges(logic, callback, property);
		else
			logic();
    };

    busybody.makeObservable = function (object) {
		///<summary>Make an object observable</summary>
		///<param name="object" type="Object">The object</param>
		///<returns type="Object">The object</returns>
		
        if (!arguments.length)
            object = {};
        
		if (object instanceof busybody.array) {
			if (busybody.getObserver(object)) 
				return object;
		} else if (busybody.canObserve(object)) {
			return object;
		}
        
        if (object.$observer) throw "The $observer property is reserved";

        Object.defineProperty(object, "$observer", {
            enumerable: false,
            configurable: false,
            value: new busybody.observable(object),
            writable: false
        });
        
        return object;
    };

    busybody.observe = function (object, property, callback, context, options) {
		///<summary>Observe changes to a property </summary>
		///<param name="object" type="Object">The object</param>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The callback to execute</param>
		///<param name="context" type="Any" optional="true">The "this" in the callback</param>
		///<param name="options" type="Object" optional="true">See busybody.observable.observe for options</param>
		
        busybody.makeObservable(object);
        return busybody.tryObserve(object, property, callback, context, options);
    };

    busybody.tryObserve = function (object, property, callback, context, options) {
		///<summary>Observe changes to a property if possible. If "object" is not observable, return</summary>
		///<param name="object" type="Object">The object</param>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The callback to execute</param>
		///<param name="context" type="Any" optional="true">The "this" in the callback</param>
		///<param name="options" type="Object" optional="true">See busybody.observable.observe for options</param>
        
        if (object instanceof busybody.array) {
			if (property instanceof Function)
            	return object.observe(arguments[1], arguments[2], arguments[3]);    // property names are misleading in this case
			if (property === "length")
				property = "$length";
			
			busybody.makeObservable(object);	//TODO: test
		}
        
        var target = busybody.getObserver(object);
        
        if (target)
            return target.observe(property, callback, context, options);
        
        return false;
    };

    busybody.computed = function (object, property, callback, options) {
		///<summary>Create a computed which bind's to a property. The context of the callback will be the object.</summary>
		///<param name="object" type="Object">The object</param>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The computed logic.</param>
		///<param name="options" type="Object" optional="true">See busybody.observeTypes.computed for options</param>
		///<returns type="busybody.observeTypes.computed">The computed</param>
        
		return busybody.getObserver(busybody.makeObservable(object)).computed(property, callback, options);
    };

    busybody.observeArray = function (object, property, callback, context, options) {
		///<summary>Observe an array property of an object for changes</summary>
		///<param name="object" type="Object">The object</param>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The callback</param>
		///<param name="context" type="Any">The "this" value in the callback</param>
		///<param name="options" type="Object" optional="true">See busybody.array.observe for options</param>
		///<returns type="busybody.disposable">A disposable</returns>
		
        busybody.makeObservable(object);
        return busybody.tryObserveArray(object, property, callback, context, options);
    };
    
    busybody.tryObserveArray = function (object, property, callback, context, options) {
		///<summary>Observe an array property of an object for changes if possible. If "object" is not observable, return</summary>
		///<param name="object" type="Object">The object</param>
		///<param name="property" type="String">The property</param>
		///<param name="callback" type="Function">The callback</param>
		///<param name="context" type="Any">The "this" value in the callback</param>
		///<param name="options" type="Object" optional="true">See busybody.array.observe for options</param>
		///<returns type="busybody.disposable">A disposable</returns>
                
        var target = busybody.getObserver(object);
        
        if (target)
            return target.observeArray(property, callback, context, options);
        
        return false;
    };

	busybody.tryBindArrays = function (array1, array2, twoWay) {
		///<summary>Try to bind the values of 2 arrays together</summary>
		///<param name="array1" type="busybody.array">The first array</param>
		///<param name="array2" type="busybody.array">The second array</param>
		///<param name="twoWay" type="Boolean" optional="true">Bind the first array to the second array also</param>
		///<returns type="busybody.disposable">A disposable</returns>
		
		if ((!(array1 instanceof Array) && array1 != null) ||
		   (!(array2 instanceof Array) && array2 != null))
			throw "You cannot bind a value to an array. Arrays can only be bound to other arrays.";

		if (array1 == null && array2 == null)
			return;
		
		var output;
		if (array1 == null) {
			array2.length = 0;
		} else if (array2 != null) {
			if (array1 instanceof busybody.array)
				output = array1.bind(array2);
			else
				busybody.array.copyAll(array1, array2);
		}
		
		if (twoWay) {
			var op2 = busybody.tryBindArrays(array2, array1);
			if (op2) {
				if (output)
					output.registerDisposable(op2);
				else
					output = op2;
			}
		}
			
		return output;
	};
	
	var index = (function () {
		var i = 0;
		return function () {
			return "ch-" + (++i);
		};
	}());

	function createBindingEvaluator (object1, property1, object2, property2) {
		
		return function (changes) {
			
			var observer1 = busybody.getObserver(object1);
			if (changes && observer1.$bindingChanges)
				for (var i in observer1.$bindingChanges)
					if (object2 === observer1.$bindingChanges[i].fromObject
						&& changes[changes.length - 1] === observer1.$bindingChanges[i].change)
						return;
			
			busybody.captureChanges(object2, function () {
				busybody.utils.obj.setObject(property2, object2, busybody.utils.obj.getObject(property1, object1));
			}, function (changes) {
				var observer2 = busybody.makeObservable(object2);
				enumerateArr(changes, function (change) {
					
					var observer2 = busybody.getObserver(object2);
					if (observer2) {
						if (!observer2.$bindingChanges)
							observer2.$bindingChanges = {};

						var i = index();
						observer2.$bindingChanges[i] = {change: change, fromObject: object1};
						setTimeout(function () {
							delete observer2.$bindingChanges[i];
							for (var j in observer2.$bindingChanges)
								return;

							delete observer2.$bindingChanges;
						}, 100);
					}
				});
			});
		};
	}

	busybody.tryBind = function (object1, property1, object2, property2, twoWay, doNotSet) {
		///<summary>Try to bind the values of 2 properties together</summary>
		///<param name="object1" type="Object">The first object</param>
		///<param name="property1" type="String">The first property</param>
		///<param name="object2" type="Object">The second object</param>
		///<param name="property2" type="String">The second property</param>
		///<param name="twoWay" type="Boolean">Attempt to bind 2 ways</param>
		///<param name="doNotSet" type="Boolean">Do not set the value of the second property to the value of the first property</param>
		///<returns type="busybody.disposable">A disposable</returns>
		
		// store all parts which need to be disposed
		var disposable = new busybody.disposable();
				
		var dispKey, evaluator;
		function ev () {
			
			if (dispKey) {
				disposable.disposseOf(dispKey);
				disp = null;
			}
			
			var obj1 = busybody.utils.obj.getObject(property1, object1);
			var obj2 = busybody.utils.obj.getObject(property2, object2);
			
			// if arrays are invloved, bind arrays
			if (obj1 instanceof Array || obj2 instanceof Array) {
				dispKey = disposable.registerDisposable(busybody.tryBindArrays(obj1, obj2));
			} else {
				if (!doNotSet)
					(evaluator || (evaluator = createBindingEvaluator(object1, property1, object2, property2))).apply(this, arguments);
				else
					doNotSet = undefined;	// doNotSet is for first time only
			}
		}
		
		disposable.registerDisposable(busybody.tryObserve(object1, property1, ev, null, {useRawChanges: true}));
		
		ev();
		
		if (twoWay)
			disposable.registerDisposable(busybody.tryBind(object2, property2, object1, property1, false, true));
		
		return disposable;
	};
    
    busybody.bind = function (object1, property1, object2, property2, twoWay) {
		///<summary>Bind the values of 2 properties together</summary>
		///<param name="object1" type="Object">The first object</param>
		///<param name="property1" type="String">The first property</param>
		///<param name="object2" type="Object">The second object</param>
		///<param name="property2" type="String">The second property</param>
		///<param name="twoWay" type="Boolean">Attempt to bind 2 ways</param>
		///<returns type="busybody.disposable">A disposable</returns>
		
		busybody.makeObservable(object1);
		busybody.makeObservable(object2);
		
		return busybody.tryBind(object1, property1, object2, property2, twoWay);
    };

    busybody.canObserve = function (object) {
		///<summary>Determine if an object can be observed. You can use busybody.makeObservable(...) to make objects observable</summary>
		///<param name="object" type="Object">The object</param>
		///<returns type="Boolean">The result</returns>
        
			//TODO: test array bit
        return object instanceof busybody.array || !!busybody.getObserver(object);
    }; 

    busybody.del = function (object, property) {
		///<summary>Delete a value from an observable</summary>
		///<param name="object" type="Object">The object</param>
		///<param name="property" type="String">The value</param>
        
        var target = busybody.getObserver(object);
        
        if (target)
            return target.del(property);
		else
			delete target[property];
    };
    
    busybody.dispose = function (object) {
		///<summary>Dispose of an object which is observable</summary>
		///<param name="object" type="Object">The object</param>
		
        var target = busybody.getObserver(object);
        
        if (target)
            return target.dispose();
    };

    window.busybody = busybody;
}(window.orienteer));

}());

;
(function (orienteer, busybody) {
    
    window.wipeout = {};
    


//"use strict"; - cannot use strict right now. any functions defined in strict mode are not accesable via arguments.callee.caller, which is used by _super

var ajax = function (options) {
    ///<summary>Perform an ajax request</summary>
    ///<param name="options" type="Object">Configure the request</param>
    ///<returns type="XMLHttpRequest">The ajax request object</returns>
    
    var xmlhttp = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            // 0 for non web srever response (e.g. file system)
            if ((xmlhttp.status == 200 || xmlhttp.status == 0) && options.success) {
                options.success(xmlhttp);
            } else if (options.error) {
                options.error(xmlhttp);
            }
        }
    };

    xmlhttp.open(options.type || "GET", options.url || document.location.href, options.async !== undefined ? options.async : true);
    xmlhttp.send();
    
    return xmlhttp;
};
    
var enumerateArr = function(enumerate, action, context) {
    ///<summary>Enumerate through an array or object</summary>
    ///<param name="enumerate" type="Any">An item to enumerate over</param>
    ///<param name="action" type="Function">The callback to apply to each item</param>
    ///<param name="context" type="Any" optional="true">The context to apply to the callback</param>
    
    if (!enumerate) return;
    
    context = context || window;
    
    for(var i = 0, ii = enumerate.length; i < ii; i++)
        action.call(context, enumerate[i], i);
};
    
var enumerateObj = function(enumerate, action, context) {
    ///<summary>Enumerate through an array or object</summary>
    ///<param name="enumerate" type="Any">An item to enumerate over</param>
    ///<param name="action" type="Function">The callback to apply to each item</param>
    ///<param name="context" type="Any" optional="true">The context to apply to the callback</param>
    
    if (!enumerate) return;
    
    context = context || window;
        
    if(enumerate == null) return;

    for(var i in enumerate)
        action.call(context, enumerate[i], i);
};

var Class = function(classFullName, accessorFunction) {
    ///<summary>Create a wipeout class</summary>
    ///<param name="classFullName" type="String">The name of the class</param>
    ///<param name="accessorFunction" type="Function">A function which returns the class</param>
    
	var current = window;
    classFullName = splitPropertyName(classFullName);
    
    if (classFullName[0] === "wipeout") {
		current = wipeout;
    	classFullName.splice(0, 1);
		if (!classFullName.length)
			throw 'Cannot override the "wipeout" variable';
	}
	
	for (var i = 0, ii = classFullName.length - 1; i < ii; i++)
		current = current[classFullName[i]] || (current[classFullName[i]] = {});
	
	return current[classFullName[classFullName.length - 1]] = accessorFunction();
};

//TODM: the "test" property
var HtmlAttr = function(attributeName, accessorFunction) {
	///<summary>Create a wipeout html attribute</summary>
	///<param name="attributeName" type="String">The name of the attribute</param>
	///<param name="accessorFunction" type="Function">A function which returns the attribute handler</param>
	
	Class("wipeout.template.rendering.htmlAttributes." + "wo-" + attributeName, accessorFunction);
	accessorFunction = function () {
		return wipeout.template.rendering.htmlAttributes["wo-" + attributeName];
	};
	
	if (wipeout.template.rendering.htmlAttributes["wo-" + attributeName].test instanceof Function)
		Class("wipeout.template.rendering.dynamicHtmlAttributes." + "wo-" + attributeName, accessorFunction);
	
	return Class("wipeout.template.rendering.htmlAttributes." + "data-wo-" + attributeName, accessorFunction);
};
    
var _trimString = /^\s+|\s+$/g;
var trim = function(string) {
    ///<summary>Trims a string</summary>
    ///<param name="string" type="String">The string to trim</param>
    ///<returns type="String">The trimmed string</returns>
    
    return string ? string.replace(_trimString, '') : string;
};

var trimToLower = function(string) {
    ///<summary>Trims a string and converts it to lower case</summary>
    ///<param name="string" type="String">The string to trim</param>
    ///<returns type="String">The trimmed string</returns>
    
    return string ? trim(string).toLowerCase() : string;
};

var parseBool = function(input) {
    ///<summary>Parses a String into a Boolean</summary>
    ///<param name="input" type="String">The string to parse</param>
    ///<returns type="Boolean">The parsed boolean</returns>
    
    if(input == null) return false;
        
    input = trimToLower(input);
    
    return !!(input && input !== "false" && input !== "0");
};

var camelCase = function(input) {
    ///<summary>Converts a string from "first-second" to "firstSecond"</summary>
    ///<param name="constructorString" type="String">The string to convert</param>
    ///<returns type="String">The camel cased string</returns>
    
    if(!input) return input;
    
    var minus = /\-/, i;
    while ((i = input.search(minus)) !== -1) {
        if (i === input.length - 1) {
            return input.substr(0, i);
        } else {
            input = input.substr(0, i) + input[i + 1].toUpperCase() + input.substr(i + 2);
        }
    }
    
    return input;
};

var splitPropertyName = (function () {
	
	var arrayMatch = /\[\s*\d\s*\]$/g;
	return function(propertyName) {
        ///<summary>Split a property path into its component parts</summary>
        ///<param name="propertyName" type="String">the property</param>
        ///<returns type="Array">An array of strings and numbers</returns>
		
		propertyName = propertyName.split(".");

		var tmp;
		for (var i = 0; i < propertyName.length; i++) {
			propertyName[i] = trim(propertyName[i]);
			var match = propertyName[i].match(arrayMatch);
			if (match && match.length) {
				if (tmp = trim(propertyName[i].replace(arrayMatch, ""))) {
					propertyName[i] = trim(propertyName[i].replace(arrayMatch, ""));
				} else {
					propertyName.splice(i, 1);
					i--;
				}

				for (var j = 0, jj = match.length; j < jj; j++)
					propertyName.splice(++i, 0, parseInt(match[j].match(/\d/)[0]));
			}
		}

		return propertyName;
	};
}());

Class("wipeout.utils.obj", function () {
            
    var joinPropertyName = function (propertyName) {
        ///<summary>Join an array of strings and numbers into a property path</summary>
        ///<param name="propertyName" type="Array">the name</param>
        ///<returns type="String">The name</returns>
		
        var output = [];
        enumerateArr(propertyName, function (item) {
            if (!isNaN(item))
                output.push("[" + item + "]");
            else if (output.length === 0)
                output.push(item);
            else
                output.push("." + item);
        });
        
        return output.join("");
    }
    
    var getObject = function(propertyName, context) {
        ///<summary>Get an object from string</summary>
        ///<param name="propertyName" type="String">A pointer to the object to get</param>
        ///<param name="context" type="Any" optional="true">The root context. Defaults to window</param>
        ///<returns type="Any">The object</returns>
        
        return _getObject(splitPropertyName(propertyName), context);
    };
    
    var _getObject = function(splitPropertyName, context) {
        ///<summary>Get an object from string</summary>
        ///<param name="splitPropertyName" type="Array">The property name split into parts, including numbers for array parts</param>
        ///<param name="context" type="Any" optional="true">The root context. Defaults to window</param>
        ///<returns type="Any">The object</returns>
        if(!context) context = window;
        
        for (var i = 0, ii = splitPropertyName.length; i <ii; i++) {
            context = context[splitPropertyName[i]];
            if(context == null)
                return i === ii - 1 ? context : null;
        }
        
        return context;
    };
    
    var setObject = function(propertyName, context, value) {
        ///<summary>Set an object</summary>
        ///<param name="propertyName" type="String">The property name</param>
        ///<param name="context" type="Any">The root</param>
        ///<param name="value" type="Any">The value</param>
        ///<returns type="Any">The value</returns>
		
        propertyName = splitPropertyName(propertyName);
        if (propertyName.length > 1)
            context = _getObject(propertyName.splice(0, propertyName.length -1), context);
        
		if (context)
        	return context[propertyName[0]] = value;
    };

    var copyArray = function(input) {
        ///<summary>Make a deep copy of an array</summary>
        ///<param name="input" type="Array">The array to copy</param>
        ///<returns type="Array">The copied array</returns>
        
        if (input instanceof Array)
            return input.slice();
        
        var output = [];
        for(var i = 0, ii = input.length; i < ii; i++) {
            output.push(input[i]);
        }
        
        return output;
    };
    
    var random = function(max) {
        ///<summary>Random int generator</summary>
        ///<param name="max" type="Number">The maximum value</param>
        ///<returns type="Number">A random number</returns>
        return Math.floor(Math.random() * max);
    };
    
    var extend = function(extend, extendWith) {
        ///<summary>The same as jQuery.extend</summary>
        ///<param name="extend" type="Object"></param>
        ///<param name="extendWith" type="Object"></param>
		
        if(extendWith && extend)
            for(var i in extendWith)
                extend[i] = extendWith[i];
        
        return extend;
    };
    
    var obj = function obj() { };
    obj.extend = extend;
    obj.camelCase = camelCase;
    obj.ajax = ajax;
    obj.parseBool = parseBool;
    obj.trimToLower = trimToLower;
    obj.trim = trim;
    obj.enumerateArr = enumerateArr;
    obj.enumerateObj = enumerateObj;
    obj.getObject = getObject;
    obj.setObject = setObject;
    obj.splitPropertyName = splitPropertyName;
    obj.joinPropertyName = joinPropertyName;
    obj.copyArray = copyArray;
    obj.random = random;
    return obj;
});

Class("wipeout.settings", function() {
    function settings (settings) {
        enumerateObj(wipeout.settings, function(a,i) {
            delete wipeout.settings[i];
        });
        
        enumerateObj(settings, function(setting, i) {
            wipeout.settings[i] = setting;
        });        
    }

    settings.asynchronousTemplates = true;
    settings.displayWarnings = true;
    settings.useElementClassName = false;
	
    return settings;
});

Class("wipeout.htmlBindingTypes.viewModelId", function () {  
	
    return function viewModelId (viewModel, setter, renderContext) {
		///<summary>Binding specifically fo the id property of a view model</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">Dispose of the binding</returns>
		
		// if $this !== vm then $this is the parent, otherwise $parent is the parent
		var parent = renderContext.$this === viewModel ? renderContext.$parent : renderContext.$this;
		
		if (parent instanceof wipeout.viewModels.view)
			parent.templateItems[setter.value()] = viewModel;
		
		var output = wipeout.htmlBindingTypes.nb(viewModel, setter, renderContext) || new busybody.disposable();
		output.registerDisposeCallback(function () {		
			if (parent instanceof wipeout.viewModels.view &&
			   parent.templateItems[setter.value()] === viewModel)
				delete parent.templateItems[setter.value()];
		});
		
		return output;
    }
});

Class("wipeout.htmlBindingTypes.shareParentScope", function () {  
    
    return function shareParentScope(viewModel, setter, renderContext) {
		///<summary>Do not bind, only set</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		var val = setter.value();
		if (/^\s*[Tt][Rr][Uu][Ee]\s*$/.test(val))
			viewModel[setter.name] = true;
		else if (/^\s*[Ff][Aa][Ll][Ss][Ee]\s*$/.test(val))
			viewModel[setter.name] = false;
		else
			throw setter.name + " must be either \"true\" or \"false\". Dynamic values are not valid for this property.";	//TODE
    }
});


Class("wipeout.template.initialization.parsers", function () {
    
	function parsers () { }
	
    parsers["json"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for JSON data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Object">A json parsed object</returns>
		
		return JSON.parse(value);
	};
	
	parsers["string"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for string data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument, un parsed</returns>
		
		return value;
	};
	
	parsers["bool"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for boolean data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as boolean</returns>
		
		var tmp = trimToLower(value);
		return tmp ? tmp !== "false" && tmp !== "0" : false;
	};
	
	parsers["int"] = function (value, propertyName, renderContext) {
		return parseInt(trim(value));
	};
	
	parsers["float"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for int data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as an int</returns>
		
		return parseFloat(trim(value));
	};
	
	parsers["regexp"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for float data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as a float</returns>
		
		return new RegExp(trim(value));
	};
	
	parsers["date"] = function (value, propertyName, renderContext) {
        ///<summary>A parser for date data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument parsed as a date</returns>
		
		return new Date(trim(value));
	};
	
	parsers["template"] = function (value) {
        ///<summary>A parser for xml temlpate data</summary>
        ///<param name="value" type="String">The value to parse</param>
        ///<param name="propertyName" type="String">The name of the property which the parsed value will be applied to</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="String">The value argument un parsed</returns>
		
		return value;
	};
    
    //TODM
    parsers.template.useRawXmlValue = true;
    
    parsers.j = parsers["json"];
    parsers.s = parsers["string"];
    parsers.b = parsers["bool"];
    parsers.i = parsers["int"];
    parsers.f = parsers["float"];
    parsers.r = parsers["regexp"];
    parsers.d = parsers["date"];
	
	return parsers;
});


Class("wipeout.template.initialization.compiledInitializer", function () {
	    
    compiledInitializer.getPropertyFlags = function(name) {
		///<summary>Seperate name from flags by "--"</summary>
        ///<param name="name" type="String">The combined name and flags</param>
        ///<returns type="Object">The name and flags</returns>
        
        var op = wipeout.template.rendering.compiledTemplate.getPropertyFlags(name);
		op.name = wipeout.utils.obj.camelCase(op.name);
		return op;
    };
    
	function compiledInitializer(template) {
		///<summary>Given a piece of template xml, compile all of the setters for a view model</summary>
        ///<param name="template" type="wipeout.wml.wmlElement">The xml</param>
        
		///<summary type="Object">Cached setters from the template</summary>
        this.setters = {};
		
        // add attribute properties
        enumerateObj(template.attributes, this.addAttribute, this);
        
        // add element properties
        enumerateArr(template, this.addElement, this);
        
        if(!this.setters.model) {
            this.setters.model = compiledInitializer.modelSetter ||
				(compiledInitializer.modelSetter = compiledInitializer.createPropertyValue("model", new wipeout.wml.wmlAttribute("$parent ? $parent.model : null")));
        }
    };
    
    compiledInitializer.prototype.addElement = function (element) {
		///<summary>Create and cache all of the setters from an element and its children if applicable</summary>
        ///<param name="element" type="wipeout.wml.wmlElement">The element</param>
		
        if (element.nodeType !== 1) return;
        
        var name = wipeout.utils.viewModels.getElementName(element);
		name = compiledInitializer.getPropertyFlags(name).name;
        if (this.setters.hasOwnProperty(name)) throw "The property \"" + name + "\" has been set more than once.";
        
        for (var val in element.attributes) {
            if (val === "value" || val.indexOf("value--") === 0) {
                enumerateArr(element, function(child) {
                    if (child.nodeType !== 3 || !child.serialize().match(/^\s*$/))
                        throw "You cannot set the value both in attributes and with elements." //TODE
                });
				
                this.setters[name] = compiledInitializer.createPropertyValue(name, element.attributes[val], compiledInitializer.getPropertyFlags(val).flags);
                return;
            }
        }
        
        var p = element.attributes.parser || element.attributes.parsers;
        if (!p && element._parentElement && element._parentElement.name) {
            var parent = wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element._parentElement.name))
            if (parent && parent.getGlobalParser)
                p = parent.getGlobalParser(name);
        }
            
        if (!p) {                
            for (var i = 0, ii = element.length; i < ii; i++) {
                if (element[i].nodeType === 1) {
					var vm = wipeout.utils.viewModels.getViewModelConstructor(element[i]);
					if (!vm)
						throw "Cannot create an instance of element: \"" + element[i].name + "\"";
					
                    this.setters[name] = compiledInitializer.createPropertyValue(name, {
						xml: element[i],
						constructor: vm.constructor
                    }, ["templateElementSetter"]);

                    return;
                }
            }
        }

        if (p && p.constructor === Function) {
            this.setters[name] = compiledInitializer.createPropertyValue(name, element);
            this.setters[name].parser = p;
        } else if (p) {
            this.setters[name] = compiledInitializer.createPropertyValue(name, element, compiledInitializer.getPropertyFlags("--" + p.value).flags);
        } else {
            this.setters[name] = compiledInitializer.createPropertyValue(name, element);
        }
    };
    
	var wipeoutBindingType = "$wipeout_binding_type";
    compiledInitializer.createPropertyValue = function (name, wml, flags) {
		///<summary>Create a property setter with a parser and binding type</summary>
        ///<param name="name" type="String">The name</param>
        ///<param name="wml" type="wipeout.wml.wmlElement">The content</param>
        ///<param name="flags" type="[String]">Parsers and binding types</param>
		///<returns type="wipeout.template.initialization.viewModelPropertyValue">The setter</returns>
		
		var parser, bindingType;
		if (flags) {
			for (var i = 0, ii = flags.length; i < ii; i++) {
				if (wipeout.htmlBindingTypes[flags[i]]) {
					if (bindingType)
						throw "The binding type has already been set for this element"; //TODE
						
					bindingType = flags[i];
				} else if (wipeout.template.initialization.parsers[flags[i]]) {
					if (parser)
						throw "The parser has already been set for this element"; //TODE
						
					parser = flags[i];
				}
			}
		}
		
		var output = new wipeout.template.initialization.viewModelPropertyValue(name, wml, parser);
		output[wipeoutBindingType] = bindingType;
		
		return output;
	};
    
    compiledInitializer.prototype.addAttribute = function (attribute, name) {
		///<summary>Add a setter from a wml attribute</summary>
        ///<param name="attribute" type="wipeout.wml.wmlAttribute">The element</param>
        ///<param name="name" type="String">The element name</param>
        
        // spit name and flags
        name = compiledInitializer.getPropertyFlags(name);
        if (this.setters[name.name]) throw "The property \"" + name.name + "\" has been set more than once.";

        this.setters[name.name] = compiledInitializer.createPropertyValue(name.name, attribute, name.flags);
    };
    
    compiledInitializer.prototype.initialize = function (viewModel, renderContext, property) {
		///<summary>Initialize a view model with the cached setter in this compiledInitializer</summary>
        ///<param name="viewModel" type="Any">The view model</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="property" type="String" optional="true">Initialize one property only (if possible)</param>
        ///<returns type="Function">Dispose of initialization</returns>
		
		var disposal;
		if (property) {
			disposal = this.applyToViewModel(property, viewModel, renderContext);
		} else {
			// only auto set model if model wasn't already set
			disposal = this.setters.model === compiledInitializer.modelSetter && viewModel.model != null ?
				[] :
				this.applyToViewModel("model", viewModel, renderContext);

			for (var name in this.setters)
				if (name !== "model")
					disposal.push.apply(disposal, this.applyToViewModel(name, viewModel, renderContext));
		}
		
		return function () {
			enumerateArr(disposal.splice(0, disposal.length), function (d) {
				if (d)
					d.dispose();
			});
		}
    };
    
    compiledInitializer.prototype.applyToViewModel = function (name, viewModel, renderContext) {
        ///<summary>Apply this setter to a view model</summary>
        ///<param name="name" type="String">The name of the property to apply</param>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Array">An array of disposables</returns>
		
		if (!this.setters[name])
			return [];
		
		var bindingType = compiledInitializer.getBindingType(this.setters[name], viewModel);
		
		if (!wipeout.htmlBindingTypes[bindingType]) throw "Invalid binding type :\"" + bindingType + "\" for property: \"" + name + "\".";
		
		var op = [];
		op.push.apply(op, this.setters[name].prime(viewModel, (function () {
			var o = wipeout.htmlBindingTypes[bindingType](viewModel, this.setters[name], renderContext)
			if (o && o.dispose instanceof Function)
				op.push(o);
			else if (o instanceof Function)
				op.push({ dispose: o });
		}).bind(this)));
		
		return op;
	};
		
	compiledInitializer.getBindingType = function (setter, viewModel) {
        ///<summary>Get the binding type or global binding type</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<returns type="String">the binding type</returns>
		
		return setter[wipeoutBindingType] || 
				(viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBindingType(setter.name)) || 
				"ow";
	};
        
    return compiledInitializer;
});

Class("wipeout.utils.dictionary", function () {

    var dictionary = orienteer.extend(function dictionary() {
        ///<summary>A simple javascript dictionary</summary>
		
        this.__keyArray = [], this.__valueArray = [];
    });
    
    dictionary.prototype.add = function (key, value) {
        ///<summary>Add or replace an item to the dictionary</summary>
        ///<param name="key" type="Any">The key</param>
        ///<param name="value" type="Any">The value</param>
        ///<returns type="Any">The value</returns>
		
        var i = this.__keyArray.indexOf(key);
        i === -1 ? (this.__keyArray.push(key), this.__valueArray.push(value)) : this.__valueArray[i] = value;

        return value;
    };
    
    dictionary.prototype.length = function () {
        ///<summary>Get the length of the dictionary</summary>
        ///<returns type="Number">The length</returns>
		
        return this.__keyArray.length;
    };
    
    dictionary.prototype.keys = function () {
        ///<summary>Get all of the keys in the dictionary</summary>
        ///<returns type="Array">The keys</returns>
		
        return this.keys_unsafe().slice();
    };
    
    dictionary.prototype.keys_unsafe = function () {
        ///<summary>Get all of the keys in the dictionary. DO NOT MODIFY THIS ARRAY</summary>
        ///<returns type="Array">The keys</returns>
		
        return this.__keyArray;
    };
    
    dictionary.prototype.remove = function (key) {
        ///<summary>Remove a value from the dictionary</summary>
        ///<param name="key" type="Any">The key</param>
        ///<returns type="Boolean">Success</returns>
		
        var i;
        if ((i = this.__keyArray.indexOf(key)) !== -1) {
            this.__valueArray.splice(i, 1);
            this.__keyArray.splice(i, 1);
            
            return true;
        }
        
        return false;
    };
    
    dictionary.prototype.value = function (key) {
        ///<summary>Get a value from the dictionary</summary>
        ///<param name="key" type="Any">The key</param>
        ///<returns type="Any">The value</returns>
		
        return this.__valueArray[this.__keyArray.indexOf(key)];
    };
    
    return dictionary;
});


Class("wipeout.base.bindable", function () {
	
    var bindable = busybody.observable.extend(function bindable() {
        ///<summary>An object which interacts with the wipeout template parser and defines parsers and bindings for specific properties</summary>
        
        this._super();
    });
    
    var parserPrefix = "__wipeoutGlobalParser_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalParser = function (forProperty, parser) {
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="parser" type="String|Function">The parser. Either a parser function (function (value, propertyName, renderContext) { }) or a pointer to a wipeout parser (wo.parsers)</param>
		 
		if (typeof parser === "string")
			parser = wipeout.template.initialization.parsers[parser];
		
        if (!(parser instanceof Function))
			//TODE
			throw "Invalid parser. Parsers must be either a string which points to wipeout parser, or a function which will parse the data";
             
        var parserName = parserPrefix + forProperty;
        if (this.prototype.hasOwnProperty(parserName)) {
			if (this.prototype[parserName] === parser)
				return;
			
            throw "A global parser has already been defined for this property";
		}
            
        this.prototype[parserName] = parser;
    };
	
	bindable.prototype.addGlobalParser = function (forProperty, parser) {
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="parser" type="String|Function">The parser. Either a parser function (function (value, propertyName, renderContext) { }) or a pointer to a wipeout parser (wo.parsers)</param>
		
		return bindable.addGlobalParser.apply(this.constructor, arguments);
	};
    
    var bindingPrefix = "__wipeoutGlobalBinding_";
    
    // assuming this static function will be passed on via inheritance
    bindable.addGlobalBindingType = function (forProperty, bindingType) {
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="bindingType" type="String">The binding type. A pointer to a wipeout binding (wo.bindings)</param> wo.bindings</param>
		
        if (typeof bindingType !== "string" || !wipeout.htmlBindingTypes[bindingType])
            //TODE
            throw "Invalid binding type. Binding types must be a string which points to wipeout binding type";
             
        var bindingName = bindingPrefix + forProperty;
        if (this.prototype.hasOwnProperty(bindingName)) {
			if (this.prototype[bindingName] === bindingType)
				return;
			
            throw "A global binding has already been defined for this property";
		}
            
        this.prototype[bindingName] = bindingType;
    };
	
	bindable.prototype.addGlobalBindingType = function (forProperty, parser) {
		///<summary>Add a global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<param name="bindingType" type="String">The binding type. A pointer to a wipeout binding (wo.bindings)</param> wo.bindings</param>
		
		return bindable.addGlobalBindingType.apply(this.constructor, arguments);
	};
    
    bindable.prototype.getGlobalParser = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="Function">The parser</returns>
        
        return this[parserPrefix + forProperty];
    };
    
    bindable.prototype.getGlobalBindingType = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="String">A pointer to the binding type (wo.bindings)</returns>
        
        return this[bindingPrefix + forProperty];
    };
    
    bindable.getGlobalParser = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="Function">The parser</returns>
        
        return this.prototype[parserPrefix + forProperty];
    };
    
    bindable.getGlobalBindingType = function (forProperty) {
		///<summary>Get the global parser for this property</summary>
        ///<param name="forProperty" type="String">The property to add a parser for</param>
        ///<returns type="String">A pointer to the binding type (wo.bindings)</returns>
        
        return this.prototype[bindingPrefix + forProperty];
    };
	
    return bindable;
});


Class("wipeout.viewModels.view", function () {
    
    var view = wipeout.base.bindable.extend(function view (templateId, model /*optional*/) {        
        ///<summary>Extends on the view class to provide expected MVVM functionality, such as a model and bindings</summary>  
        ///<param name="templateId" type="String" optional="true">An initial template id</param>
        ///<param name="model" type="Any" optional="true">An initial model</param>

        this._super();

        ///<Summary type="Boolean">Specifies whether this object should be used as a binding context. If true, the binding context of this object will be it's parent. Default is false</Summary>
        this.shareParentScope = false;

        ///<Summary type="Object">Dictionary of items created within the current template. The items can be views or html elements</Summary>
        this.templateItems = {};

        ///<Summary type="String">The id of the template of the view, giving it an appearance</Summary>
        this.templateId = templateId;
        
        this.observe("model", this._onModelChanged, this, {activateImmediately: true});
		
        ///<Summary type="ko.observable" generic0="Any">The model of view. If not set, it will default to the model of its parent view</Summary>
        this.model = model == null ? null : model;

        ///<Summary type="Object">A bag to put objects needed for the lifecycle of this object and its properties</Summary>
        this.$routedEventSubscriptions = [];
		
        ///<Summary type="wipeout.events.event">Trigger to tell the overlying renderedContent the the template has changed</Summary>
		this.$synchronusTemplateChange = new wipeout.events.event();
		
        ///<Summary type="[busybody.observeTypes.computed]">A list of computeds which will be force evaluated on onInitialized</Summary>
		this.$initComputeds = [];
    });
	
    view.addGlobalBindingType("shareParentScope", "shareParentScope");
	
	view.prototype.initComputed = function (property, callback, options) {
		if (!options)
			options = {delayExecution: true};
		else
			options.delayExecution = true
		
		var op = this.computed(property, callback, options);
		
		if (op)
			(this.$initComputeds || (this.$initComputeds = [])).push(op);
		
		return op;
	};
	
    view.addGlobalParser("id", "string");
    view.addGlobalBindingType("id", "viewModelId");
    
    view.prototype.getParent = function() {
        ///<summary>Get the parent view of this view</summary> 
        ///<returns type="Any">The parent view model</returns>
        
		var renderContext = this.getRenderContext();
		if (!renderContext)
			return null;
					
        return renderContext.$this === this ? renderContext.$parent : renderContext.$this;
    };
    
    view.prototype.getParents = function() {
        ///<summary>Get all parent views of this view</summary> 
        ///<returns type="Array" generic0="wo.view">The parent view model</returns>
        
		var renderContext = this.getRenderContext();
		if (!renderContext)
			return [];
						
		var op = renderContext.$parents.slice();	
		if (renderContext.$this !== this)	// if share parent scope
			op.splice(0, 0, renderContext.$this);
		
		return op;
    };
    
    view.prototype.getRenderContext = function() {
        ///<summary>Get the render context of this view</summary> 
        ///<returns type="wipeout.template.context">The render context</returns>
        
		return (this.$domRoot && this.$domRoot.renderContext) || null;
    };
        
    view.prototype._onModelChanged = function (oldValue, newValue) {
        ///<summary>Called when the model has changed</summary>
        ///<param name="oldValue" type="Any" optional="false">The old model</param>
        ///<param name="newValue" type="Any" optional="false">The new mode</param>
        
        if(oldValue !== newValue)
			this.onModelChanged(newValue);
	};
	
    view.prototype.onModelChanged = function (newValue) {
        ///<summary>Called when the model has changed</summary>
        ///<param name="newValue" type="Any" optional="false">The new mode</param>
		
		this.disposeOf(this.$modelRoutedEventKey);
		this.$modelRoutedEventKey = null;

		if(newValue instanceof wipeout.events.routedEventModel) {
			var d1 = newValue.__triggerRoutedEventOnVM.register(this._onModelRoutedEvent, this);
			this.$modelRoutedEventKey = this.registerDisposable(d1);
		}
    };
    
    view.prototype._onModelRoutedEvent = function (eventArgs) {
        ///<summary>When the model of this class fires a routed event, catch it and continue the traversal upwards</summary>
        ///<param name="eventArgs" type="wo.routedEventArgs" optional="false">The routed event args</param>
        
        if(!(eventArgs.routedEvent instanceof wipeout.events.routedEvent)) throw "Invaid routed event";
        
        this.triggerRoutedEvent(eventArgs.routedEvent, eventArgs.eventArgs);
    };
	
	view.prototype.dispose = function () {
        ///<summary>Dispose of this view</summary>
		
		this._super();
		
		// dispose of routed event subscriptions
		enumerateArr(this.$routedEventSubscriptions.splice(0, this.$routedEventSubscriptions.length), function(event) {
			event.dispose();
		});
	};
	
	//TODM
	view.prototype.synchronusTemplateChange = function (templateId) {
        ///<summary>Tell the overlying renderedContent the the template has changed</summary>    
        ///<param name="templateId" type="String" optional="true">Set the template id also</param>
		
		if (arguments.length)
			this.templateId = templateId;
		
		this.$synchronusTemplateChange.trigger();
	};
	
    view.visualGraph = function (rootElement, displayFunction) {
        ///<summary>Compiles a tree of all view elements in a block of html, starting at the rootElement</summary>    
        ///<param name="rootElement" type="HTMLNode" optional="false">The root node of the view tree</param>
        ///<param name="displayFunction" type="Function" optional="true">A function to convert view models found into a custom type</param>
        ///<returns type="Array" generic0="Object">The view graph</returns>

        throw "TODO";
        
        /*if (!rootElement)
            return [];

        displayFunction = displayFunction || function() { return typeof arguments[0]; };

        var output = [];
        wipeout.utils.obj.enumerateArr(wipeout.utils.html.getAllChildren(rootElement), function (child) {
            wipeout.utils.obj.enumerateArr(visual.visualGraph(child), output.push, output);
        });

        var vm = wipeout.utils.domData.get(rootElement, wipeout.bindings.wipeout.utils.wipeoutKey);        
        if (vm) {
            return [{ viewModel: vm, display: displayFunction(vm), children: output}];
        }

        return output;*/
    };
    
    // virtual
    view.prototype.onRendered = function (oldValues, newValues) {
        ///<summary>Triggered each time after a template is rendered</summary>   
        ///<param name="oldValues" type="Array" generic0="HTMLNode" optional="false">A list of HTMLNodes removed</param>
        ///<param name="newValues" type="Array" generic0="HTMLNode" optional="false">A list of HTMLNodes rendered</param>
    };
    
    // virtual
    view.prototype.onUnrendered = function () {
        ///<summary>Triggered just before a view is un rendered</summary>    
    };
    
    // virtual
    view.prototype.onApplicationInitialized = function () {
        ///<summary>Triggered after the entire application has been initialized. Will only be triggered on the viewModel created directly by the wipeout binding</summary>    
    };
	
    function ex (comp) { comp.execute(); }
	
    // virtual
    view.prototype.onInitialized = function() {
        ///<summary>Called by the template engine after a view is created and all of its properties are set</summary>
		
		enumerateArr(this.$initComputeds, ex);
		this.$initComputeds = null;
    };

    return view;
});



Class("wipeout.events.routedEvent", function () {
    
    var routedEvent = function routedEvent() {
        ///<summary>A routed event is triggered on a view and travels up to ancestor views all the way to the root of the application</summary>
        
        // allow for non use of the new key word
        if(!(this instanceof routedEvent))
           return new routedEvent();
    };

    routedEvent.prototype.trigger = function(triggerOnView, eventArgs) {
        ///<summary>Trigger a routed event on a view</summary>
        ///<param name="triggerOnView" type="wo.view" optional="false">The view where the routed event starts</param>
        ///<param name="eventArgs" type="Any" optional="true">The event args to bubble up with the routed event</param>
        
        triggerOnView.triggerRoutedEvent(this, new wipeout.events.routedEventArgs(eventArgs, triggerOnView));
    };
    
    routedEvent.prototype.unRegister = function (callback, triggerOnView, context /* optional */) {
        ///<summary>Unregister a routed event on a view</summary>
        ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
        ///<param name="triggerOnView" type="wo.view" optional="false">The view passed into the register function</param>
        ///<param name="context" type="Any" optional="true">The original context passed into the register function</param>
        ///<returns type="Boolean">Whether the event registration was found or not</returns>         
        return triggerOnView.unRegisterRoutedEvent(this, callback, context);
    };
    
    routedEvent.prototype.register = function(callback, triggerOnView, context /* optional */) {
        ///<summary>Register a routed event on a view</summary>
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="triggerOnView" type="wo.view" optional="false">The view registered to the routed event</param>
        ///<param name="context" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         
        
        return triggerOnView.registerRoutedEvent(this, callback, context);
    };
    
    return routedEvent;
});

Class("wipeout.events.routedEventArgs", function () {
    
    var routedEventArgs = function routedEventArgs(eventArgs, originator) { 
        ///<summary>Arguments passed to routed event handlers. Set handled to true to stop routed event propogation</summary>
        ///<param name="eventArgs" type="Any" optional="true">The inner event args</param>
        ///<param name="originator" type="Any" optional="false">A pointer to event raise object</param>
        
        ///<Summary type="Boolean">Signals whether the routed event has been handled and should not propagate any further</Summary>
        this.handled = false;
        
        ///<Summary type="Any">The original event args used when the routedEvent has been triggered</Summary>
        this.data = eventArgs;
        
        ///<Summary type="Any">The object which triggered the event</Summary>
        this.originator = originator;
    };
    
    return routedEventArgs;
});
    

Class("wipeout.events.routedEventRegistration", function () {
    
    var routedEventRegistration = function routedEventRegistration(routedEvent) {  
        ///<summary>Holds routed event registration details</summary>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        
        ///<Summary type="wo.routedEvent">The routed event</Summary>
        this.routedEvent = routedEvent;
        
        ///<Summary type="wo.event">An inner event to handler triggering callbacks</Summary>
        this.event = new wipeout.events.event();        
    };
    
    routedEventRegistration.prototype.dispose = function() {
        ///<summary>Dispose of the callbacks associated with this registration</summary>
        this.event.dispose();
    };
    
    return routedEventRegistration;
});


Class("wipeout.template.rendering.renderedContent", function () {
    
    var renderedContent = busybody.disposable.extend(function renderedContent (element, name, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="name" type="String">The content of the rendered comment tags</param>
        ///<param name="parentRenderContext" type="wipeout.template.context" optional="true">The render context of the parent view model</param>
                        
		this._super();
		
        name = wipeout.utils.obj.trim(name);
        
        this.parentRenderContext = parentRenderContext;
        
		//TODV: if: debug, else this.openingTag = document.createComment(" " + name + " ");   
        //this.openingTag = document.createElement("script");
		
        // create opening and closing tags and link to this
		///<summary type="Comment">The opening tag</summary>
        this.openingTag = document.createComment(" " + name + " ");
        this.openingTag.wipeoutOpening = this;
		///<summary type="Comment">The closing tag</summary>
        this.closingTag = document.createComment(" /" + name + " ");
        this.closingTag.wipeoutClosing = this;
        
        // add this to DOM and remove placeholder
        element.parentNode.insertBefore(this.openingTag, element);
        element.parentNode.insertBefore(this.closingTag, element);
        element.parentNode.removeChild(element);
    });
	
	renderedContent.prototype.rename = function (name) {
		///<summary>Rename the opeining and closing tags</summary>
        ///<param name="name" type="String">The new name</param>
		
		this.openingTag.nodeValue = " " + name + " ";
		this.closingTag.nodeValue = " /" + name + " ";
	};
	    
    renderedContent.prototype.renderArray = function (array) {
		///<summary>Render an array</summary>
        ///<param name="array" type="Array">The array to render</param>
        
        // if a previous request is pending, cancel it
        if (this.asynchronous) {
            this.asynchronous.cancel();
			delete this.asynchronous;
		}
                
        this.unRender();
        
		var ra = new wipeout.template.rendering.renderedArray(array, this);
        this.disposeOfBindings = ra.dispose.bind(ra);
		
        if (array instanceof busybody.array)
            ra.registerDisposable(array.observe(ra.render, ra, {useRawChanges: true}));
		
		ra.render([{
			type: "splice",
			addedCount: array.length,
			removed: [],
			index: 0
		}]);
	};
	
    renderedContent.prototype.render = function (object, arrayIndex) {
		///<summary>Render a view model</summary>
        ///<param name="object" type="Any">The The view model</param>
        ///<param name="arrayIndex" type="Number" optional="true">The array index if the item is part of an array</param>
		
        if (object instanceof Array) {
            this.renderArray(object);
            return;
        }
        
        this.unRender();
		
		this.viewModel = object;
        
        if (this.viewModel == null)
            return;
		
		this.renderContext = this.parentRenderContext ? 
			this.parentRenderContext.contextFor(this.viewModel, arrayIndex) :
			new wipeout.template.context(this.viewModel, null, arrayIndex);
        
        if (this.viewModel instanceof wipeout.viewModels.view) {
			this.templateChangeKey = this.registerDisposable(
				this.viewModel.$synchronusTemplateChange.register(this.templateHasChanged, this));
			
            this.viewModel.$domRoot = this;
            this.templateObserved = this.viewModel.observe("templateId", this._template, this, {activateImmediately: true});
			
            if (this.viewModel.templateId)
                this.template(this.viewModel.templateId);
        } else {
            this.appendHtml(this.viewModel.toString());
        }
    };
	
	renderedContent.prototype.templateHasChanged = function () {
        ///<summary>Re-template the view model</summary>
		
		this.template(this.viewModel.templateId);
	};
    
    renderedContent.prototype._template = function(oldTemplateId, templateId) {
        ///<summary>Render the view model with the given template</summary>
        ///<param name="oldTemplateId" type="String">The previous value (unused)</param>
        ///<param name="templateId" type="String">A pointer to the template to apply</param>
		
        this.template(templateId);
    };
	
	renderedContent.prototype.unRender = function(leaveDeadChildNodes) {
		///<summary>Dispose of all items created during the rendering process</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, the un-render will not lear down the DOM. This is a performance optimization</param>
		
        this.unTemplate(leaveDeadChildNodes);
        
		if (this.templateObserved) {
			this.templateObserved.dispose();
			delete this.templateObserved;
		}
		
		if (this.templateChangeKey) {
			this.disposeOf(this.templateChangeKey);
			delete this.templateChangeKey;
		}
		
        if (this.viewModel instanceof wipeout.viewModels.view)
            delete this.viewModel.$domRoot;
		
		delete this.renderContext;
		delete this.viewModel;
    };
	
	renderedContent.prototype.unTemplate = function(leaveDeadChildNodes) {
        ///<summary>Remove a view model's template, leaving it blank</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
		delete this.currentTemplate;
		
        // dispose of bindings
        if (this.disposeOfBindings) {
            this.disposeOfBindings();
            delete this.disposeOfBindings;
        }

        // TODV: test and implement - http://stackoverflow.com/questions/3785258/how-to-remove-dom-elements-without-memory-leaks
        // remove all children
        if(!leaveDeadChildNodes) {
			var ns;
            while ((ns = this.openingTag.nextSibling) && ns !== this.closingTag) {
				//TODV: benchmark test, is this necessary (does it help with memory leaks) and des it take much time?
				if (ns.elementType === 1)
					ns.innerHTML = "";
				
                ns.parentNode.removeChild(this.openingTag.nextSibling);
			}
		}
    };
    
    renderedContent.prototype.template = function(templateId) {
        ///<summary>Render the view model with the given template</summary>
        ///<param name="templateId" type="String">A pointer to the template to apply</param>
        		
        // if a previous request is pending, cancel it
        if (this.asynchronous)
            this.asynchronous.cancel();
		
		if (this.currentTemplate === templateId) return;
        
        // remove old template
        if (this.__initialTemplate)
            this.unTemplate();
				
		if (!templateId) return;
        		
        this.asynchronous = wipeout.template.engine.instance.compileTemplate(templateId, (function (template) {
            delete this.asynchronous;
            
            // remove loading placeholder
            if (element) {
                element.parentNode.removeChild(element);
                element = null;
            }
            
			this.currentTemplate = templateId;
			
			// add html and execute to add dynamic content
            this.disposeOfBindings = template.quickBuild(this.appendHtml.bind(this), this.renderContext);
            this.__initialTemplate = true;
            
            this.viewModel.onRendered();
        }).bind(this));
        
        if (this.asynchronous) {            
            var element = wipeout.utils.html.createTemplatePlaceholder(this.viewModel);
            this.closingTag.parentNode.insertBefore(element, this.closingTag);
        }
    };
    
    renderedContent.prototype.dispose = function(leaveDeadChildNodes) {
        ///<summary>Dispose of this view model and viewModel element, removing it from the DOM</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
		this._super();
		
		if (!this.closingTag) return;
		
        this.unRender(leaveDeadChildNodes);
        
        if (!leaveDeadChildNodes && !this.detatched) {
			this.closingTag.parentNode.removeChild(this.closingTag);
			this.openingTag.parentNode.removeChild(this.openingTag);
		}
		
		delete this.detatched;
		
		delete this.closingTag.wipeoutClosing;
		delete this.openingTag.wipeoutOpening;
		
		delete this.closingTag;
		delete this.openingTag;
    };
	
    renderedContent.prototype.appendHtml = function (html) {
		///<summary>Append a html string to this renderContext</summary>
        ///<param name="html" type="String">The current html</param>
		
		if (this.openingTag && this.openingTag.nodeType === 1) {
			this.openingTag.insertAdjacentHTML('afterend', html);
		} else {
        	//TODV: see todv in constructor
			var scr = document.createElement("script");
			this.closingTag.parentNode.insertBefore(scr, this.closingTag);
			scr.insertAdjacentHTML('afterend', html);
			scr.parentNode.removeChild(scr);
		}
    };
    
    renderedContent.getParentElement = function(forHtmlElement) {
		///<summary>Get the parent element of a html element, keeping in mind that it might be a wipeout opeing comment</summary>
        ///<param name="forHtmlElement" type="Element">The element</param>
        ///<returns type="Node">The parent element</returns>
		
        var current = forHtmlElement.wipeoutClosing ? forHtmlElement.wipeoutClosing.openingTag : forHtmlElement;
        while (current = current.previousSibling) {
            if (current.wipeoutClosing)
                current = current.wipeoutClosing.openingTag;
            else if (current.wipeoutOpening)
                return current;
        }
        
        return forHtmlElement.parentNode;
    };
    
    return renderedContent;    
});


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
	
	// virtual
	propertyValue.prototype.value = function () {
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
				
				if (wipeout.template.filters[split[1]].parentToChild)	//TODM (parentToChild). TODO: rename parentToChild
					val = "wipeout.template.filters[\"" + split[1] + "\"].parentToChild(" + split[0] + ")";
				else
					val = split[0].split(",")[0];
			}
			
			this._getter = wipeout.template.context.buildGetter(splitValue.addTokens(val))
		}
		
		return this._getter;
	};
	
	propertyValue.prototype.get = function (renderContext, propertyOwner) {
		///<summary>Return the value of this setter when applied to a renderContext</summary>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<param name="propertyOwner" type="Any" optional="true">The owner of the propery. If null, the setter must be primed</param>
        ///<returns type="Any">The returned value</returns>
		
		var parser = this.getParser(propertyOwner);
		
		return parser ? 
			(parser(parser.useRawXmlValue ? this._value : this.value(), this.name, renderContext)) : 
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
				
				if (wipeout.template.filters[split[1]].childToParent) {	//TODM (childToParent). TODO: rename childToParent
					getter = "wipeout.template.filters[\"" + split[1] + "\"].childToParent";
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
				property = property[0].replace(/(^\s*\.+\s*)|(\s*$)/, "");
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
		
		var watched = /^([\$\w\s\.]|(\[\d+\]))+$/.test(this.value()) ?
			new busybody.observeTypes.pathObserver(renderContext, this.value().replace(/^\s*\$model\./, "$this.model.").replace(/^\s*\$model\s*$/, "$this.model")) :	//TODO: this is non standard
			renderContext.getComputed(this.buildGetter());
		
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
});


Class("wipeout.debug", function () { 
    var jQ = function() {
        if(!window.jQuery)
            throw "This debug tool requires jQuery";
    };
    
    return {
        renderedItems: function(rootNode /*optional*/, renderedItemType /*optional*/) {
            
            var values = [], vm;
            var recursive = function(node) {
                if(node) {
                    switch(node.nodeType) {
                        case 1:
                            enumerateArr(node.childNodes, recursive);
                        case 8:
                            if((vm = wipeout.utils.html.getViewModel(node)) &&
                               values.indexOf(vm) === -1 &&
                              (!renderedItemType || vm.constructor === renderedItemType)) {
                                values.push(vm);
                            }
                    }
                }
            };
            
            recursive(rootNode || document.getElementsByTagName("body")[0]);
            return values;
        }
    }
});


Class("wipeout.events.eventRegistration", function () {
    
    return busybody.disposable.extend(function eventRegistration(callback, context, dispose) {
        ///<summary>On object containing event registration details</summary>
        ///<param name="callback" type="Any" optional="false">The event logic</param>
        ///<param name="context" type="Any" optional="true">The context of the event logic</param>
        ///<param name="dispose" type="Function" optional="false">A dispose function</param>
        ///<param name="priority" type="Number">The event priorty. The lower the priority number the sooner the callback will be triggered.</param>
        this._super();    
               
        ///<Summary type="Function">The callback to use when the event is triggered</Summary>
        this.callback = callback;
        
        ///<Summary type="Any">The context to usse with the callback when the event is triggered</Summary>
        this.context = context;                
        
        this.registerDisposeCallback(dispose);
    });
});

Class("wipeout.events.event", function () {
    
    var event = function event() {
        ///<summary>Defines a new event with register and trigger functinality</summary>
        
        // allow for non use of the new key word
        if(!(this instanceof event))
           return new event();
        
        ///<Summary type="Array" generic0="wipeout.events.eventRegistration">Array of callbacks to fire when event is triggered</Summary>
        this._registrations = [];
    };

    event.prototype.trigger = function(eventArgs) {
        ///<summary>Trigger the event, passing the eventArgs to each subscriber</summary>
        ///<param name="eventArgs" type="Any" optional="true">The arguments to pass to event handlers</param>
        
        for(var i = 0, ii = this._registrations.length; i < ii; i++) {
            if(eventArgs instanceof wipeout.events.routedEventArgs && eventArgs.handled) return;
            
            this._registrations[i].callback.call(this._registrations[i].context, eventArgs);
        }
    };
    
    event.prototype.unRegister = function (callback, context /* optional */) {
        ///<summary>Un subscribe to an event. The callback and context must be the same as those passed in the original registration</summary>
        ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
        ///<param name="context" type="Any" optional="true">The original context passed into the register function</param>
        
        context = context == null ? window : context;
        for(var i = 0; i < this._registrations.length; i++) {
            if(this._registrations[i].callback === callback && this._registrations[i].context === context) {
                this._registrations.splice(i, 1);
                i--;
            }
        }
    }
    
    event.prototype.dispose = function() {
        ///<summary>Dispose of the event</summary>
        this._registrations.length = 0;
    }
    
    //TODO refactor, with disposable
    event.prototype.register = function(callback, context, priority) {
        ///<summary>Subscribe to an event</summary>
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="context" type="Any" optional="true">The context "this" to use within the calback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty. The lower the priority number the sooner the callback will be triggered. The default is 0</param>
        ///<returns type="wo.eventRegistration">An object with the details of the registration, including a dispose() function</returns>
        
        if(!(callback instanceof Function))
            throw "Invalid event callback";
        
        if(priority && !(priority instanceof Number))
            throw "Invalid event priority";
        
        var reg = this._registrations;
        var evnt = { 
            priority: priority || 0,
            callback: callback, 
            context: context == null ? window : context,
            dispose: function() {
                if (!evnt) return;
                
                var index = reg.indexOf(evnt);
                if(index >= 0)
                    reg.splice(index, 1);
                
                evnt = null;
            }
        };
        
        for(var i = 0, ii = this._registrations.length; i < ii; i++) {
            if(evnt.priority < this._registrations[i].priority) {
                this._registrations.splice(i, 0, evnt);
                break;
            }
        }
        
        if(i === ii)
            this._registrations.push(evnt);
        
        return new wipeout.events.eventRegistration(evnt.callback, evnt.context, evnt.dispose, evnt.priority);
    };
    
    return event;
});


Class("wipeout.events.routedEventModel", function () {
    
    
    var routedEventModel = orienteer.extend(function routedEventModel() {
        ///<summary>The base class for models if they wish to invoke routed events on their viewModel</summary>
        
		this._super();
		
        ///<Summary type="wo.event">The event which will trigger a routed event on the owning view</Summary>
        this.__triggerRoutedEventOnVM = new wipeout.events.event();
        
        ///<Summary type="Array" generic0="wo.routedEventRegistration">A placeholder for event subscriptions on this model</Summary>
        this.__routedEventSubscriptions = [];
    });
        
    routedEventModel.prototype.triggerRoutedEvent = function(routedEvent, eventArgs) {
        ///<summary>Trigger a routed event which will propogate to any view models where this object is it's model and continue to bubble from there</summary>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to trigger</param>
        ///<param name="eventArgs" type="Any" optional="true">The routed event args</param>
        
        // Used by wo.model to acertain when a routed event should be fired
        this.__triggerRoutedEventOnVM.trigger({routedEvent: routedEvent, eventArgs: eventArgs});
    };        
        
    routedEventModel.prototype.routedEventTriggered = function(routedEvent, eventArgs) {
        ///<summary>Called by the owning view model when a routed event is fired</summary>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to trigger</param>
        ///<param name="eventArgs" type="Any" optional="true">The routed event args</param>
                
        for(var i = 0, ii = this.__routedEventSubscriptions.length; i < ii; i++) {
            if(eventArgs.handled) return;
            if(this.__routedEventSubscriptions[i].routedEvent === routedEvent) {
                this.__routedEventSubscriptions[i].event.trigger(eventArgs);
            }
        }
    };        
    
    routedEventModel.prototype.registerRoutedEvent = function(routedEvent, callback, callbackContext, priority) {
        ///<summary>Register for a routed event</summary>   
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="callbackContext" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty. Event priority does not affect event bubbling order</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         

        var rev;
        for(var i = 0, ii = this.__routedEventSubscriptions.length; i < ii; i++) {
            if(this.__routedEventSubscriptions[i].routedEvent === routedEvent) {
                rev = this.__routedEventSubscriptions[i];
                break;
            }
        }

        if(!rev) {
            rev = new wipeout.events.routedEventRegistration(routedEvent);
            this.__routedEventSubscriptions.push(rev);
        }

        return rev.event.register(callback, callbackContext, priority);
    };
    
    routedEventModel.prototype.unRegisterRoutedEvent = function(routedEvent, callback, callbackContext) {  
        ///<summary>Unregister from a routed event. The callback and callback context must be the same as those passed in during registration</summary>  
        ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to un register from</param>
        ///<param name="callbackContext" type="Any" optional="true">The original context passed into the register function</param>
        ///<returns type="Boolean">Whether the event registration was found or not</returns>         

        for(var i = 0, ii = this.__routedEventSubscriptions.length; i < ii; i++) {
            if(this.__routedEventSubscriptions[i].routedEvent === routedEvent) {
                this.__routedEventSubscriptions[i].event.unRegister(callback, callbackContext);
                return true;
            }
        }  

        return false;
    };
    
    return routedEventModel;
});

Class("wipeout.htmlBindingTypes.ifTemplateProperty", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function ifTemplateProperty(viewModel, setter, renderContext) {
		///<summary>Set {property}Id rather than {property}. This makes setting templates faster</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		var op = wipeout.htmlBindingTypes.templateProperty(viewModel, setter, renderContext);
		if (viewModel instanceof wipeout.viewModels["if"])
			viewModel.reEvaluate();
		
		return op;
    }
});

Class("wipeout.htmlBindingTypes.nb", function () {  
    
    return function nb(viewModel, setter, renderContext) {
		///<summary>Do not bind, only set</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
        viewModel[setter.name] = setter.get(renderContext);
    }
});

Class("wipeout.htmlBindingTypes.ow", function () {  
		
	return function ow (viewModel, setter, renderContext) {
		///<summary>Bind for parent property to child property</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		setter.watch(renderContext, function (oldVal, newVal) {
			viewModel[setter.name] = newVal;
		}, true);
    };
});

Class("wipeout.htmlBindingTypes.owts", function () {  
    
    return function owts (viewModel, setter, renderContext) {
		///<summary>Bind from child property to parent property</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">Dispose of the binding</returns>
		
		if (!setter.canSet())
            throw "Setter \"" + setter.value() + "\" cannot be set.";	//TODE
		
		setter.onPropertyChanged(function (oldVal, newVal) {
			setter.set(renderContext, newVal, viewModel);
		}, true);
    };
});

Class("wipeout.htmlBindingTypes.setTemplateToTemplateId", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function templateProperty(viewModel, setter, renderContext) {
		///<summary>Binding specifically for setTemplate property. Sets templateId directly</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		viewModel.templateId = wipeout.viewModels.contentControl.createAnonymousTemplate(setter._value);
    }
});

Class("wipeout.htmlBindingTypes.templateElementSetter", function () {  
    
    return function templateElementSetter(viewModel, setter, renderContext) {
		///<summary>Binding to set preoperties in xml. Used internally</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		viewModel[setter.name] = new setter._value.constructor();

		var output = new busybody.disposable(wipeout.template.engine.instance
			.getVmInitializer(setter._value.xml)
			.initialize(viewModel[setter.name], renderContext));
		
		if (viewModel[setter.name].dispose instanceof Function)
			output.registerDisposable(viewModel[setter.name]);
		
		return output;
    }
});

Class("wipeout.htmlBindingTypes.templateProperty", function () {  
    
	// shortcut (hack :) ) to set template id instead of the template property
    return function templateProperty(viewModel, setter, renderContext) {
		///<summary>Set {property}Id rather than {property}. This makes setting templates faster</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
		
		viewModel[setter.name + "Id"] = wipeout.viewModels.contentControl.createAnonymousTemplate(setter._value);
    }
});

Class("wipeout.htmlBindingTypes.tw", function () {  
    
    return function tw(viewModel, setter, renderContext) {
		///<summary>Bind from parent property to child and from child property to parent</summary>
        ///<param name="viewModel" type="Any">The current view model</param>
        ///<param name="setter" type="wipeout.template.initialization.viewModelPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">Dispose of the binding</returns>
		
		var val;
        if (setter.getParser(viewModel) ||
			!/^([\$\w\s\.]|(\[\d+\]))+$/.test(val = setter.value()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
		
		// skip to first observable object, only paths one level off renderContext
		// or one index of renderContexts.$parents are allowed
		var current = renderContext, split = busybody.utils.obj.splitPropertyName(val);
		
		if (busybody.getObserver(renderContext[split[0]])) {
			renderContext = renderContext[split[0]];
			val = busybody.utils.obj.joinPropertyName(split.slice(1));
		} else if (split[0] === "$parents" && renderContext.$parents && busybody.getObserver(renderContext.$parents[split[1]])) {
			renderContext = renderContext.$parents[split[1]];
			val = busybody.utils.obj.joinPropertyName(split.slice(2));
		}
		
		return busybody.tryBind(renderContext, val, viewModel, setter.name, true);
    }
});

Class("wipeout.polyfills.Array", function () {
    
    var array = function() {
        ///<summary>Polyfill placeholder for Array</summary>
    };
    
    array.prototype.indexOf = function(searchElement, fromIndex) {
        ///<summary>Polyfill for Array.prototype.indexOf</summary>
        ///<param name="searchElement" type="Any" optional="false">The object to find</param>
        ///<param name="fromIndex" type="Number" optional="true">The index to start at</param>
        ///<returns type="Number">It's index</returns>
                
        for(var i = fromIndex || 0, ii = this.length; i < ii; i++)
            if(this[i] === searchElement)
                return i;
        
        return -1;
    };
    
    enumerateObj(array.prototype, function(item, i) {
        if(!Array.prototype[i])
            Array.prototype[i] = item;
    });
    
    return array;    
});

Class("wipeout.polyfills.Function", function () {
    
    var _function = function() {
        ///<summary>Polyfill placeholder for Function</summary>
    };
    
    _function.prototype.bind = function(context) {
        ///<summary>Polyfill for Function.prototype.bind</summary>
        ///<param name="context" type="Any" optional="false">The object to bind</param>
        ///<returns type="Function">A bound function</returns>
		
		var func = this;
		return function () {
			return func.apply(context, arguments);
		};
    };
    
    enumerateObj(_function.prototype, function(item, i) {
        if(!Function.prototype[i])
            Function.prototype[i] = item;
    });
    
    return _function;    
});

Class("wipeout.profile.highlightVM", function () { 
    
    var highlightVM = orienteer.extend(function highlightVM(vm, cssClass) {
        ///<summary>Highlight all of the nodes in a view model.</summary>
        ///<param name="vm" type="wo.view" optional="false">The view model to highlight</param>
        ///<param name="cssClass" type="String" optional="false">The class to use to highlight it</param>
        
        ///<Summary type="wo.view">The view model</Summary>
        this.vm = vm;
        
        ///<Summary type="String">The css class</Summary>
        this.cssClass = cssClass;
                
        ///<Summary type="Array" generic0="Node">The nodes belonging to the view model</Summary>
        this.nodes = vm.entireViewModelHtml();
        
        wipeout.utils.obj.enumerateArr(this.nodes, function(node) {
            if (node.classList)
                node.classList.add(this.cssClass)
        }, this);
    });
    
    highlightVM.prototype.dispose = function() {
        ///<summary>Dispose of this instance.</summary>
        
        wipeout.utils.obj.enumerateArr(this.nodes, function(node) {
            if (node.classList)
                node.classList.remove(this.cssClass)
        }, this);
    };
    
    return highlightVM;
});

Class("wipeout.profile.highlighter", function () { 
    
    highlighter.newId = (function () {
        var i = 0;
        return function() {
            ///<summary>Get a unique id int.</summary>
            ///<returns type="Number">The id</returns>
            
            return ++i;
        };
    })();
    
    highlighter.generateColour = function() {
        ///<summary>Generate a random pastel colour.</summary>
        ///<returns type="String">THe colour code</returns>
        
        var red = Math.floor((wipeout.utils.obj.random(255) + 255) / 2);
        var green = Math.floor((wipeout.utils.obj.random(255) + 255) / 2);
        var blue = Math.floor((wipeout.utils.obj.random(255) + 255) / 2);

        return red.toString(16) + green.toString(16) + blue.toString(16);
    };
    
    function highlighter() {
        ///<summary>Highlight any view model which the mouse is over.</summary>
        
        ///<Summary type="Element">The style element for this highlighter</Summary>
        this.style = document.createElement("style");     
        
        ///<Summary type="Number">The current css class index</Summary>
        this.index = 0;
        
        ///<Summary type="Array" generic0="String">The css classes belonging to this profiler</Summary>
        this.styles = [
            "wipeout-profiler-" + highlighter.newId(),
            "wipeout-profiler-" + highlighter.newId(),
            "wipeout-profiler-" + highlighter.newId(),
            "wipeout-profiler-" + highlighter.newId(),
            "wipeout-profiler-" + highlighter.newId()
        ];
        
        // generate 5 colours
        for(var i = 0, ii = this.styles.length; i < ii; i++)
            this.style.innerHTML += 
                " ." + this.styles[i] + " {background-color:#" + highlighter.generateColour() + " !important; cursor: pointer !important}";
        
        document.head.appendChild(this.style);
        
        // dummy highlighter to deal with first dispose
        ///<Summary type="wipeout.profile.highlightVM">The current highlight vm wrapper</Summary>
        this.currentHighlighter = {dispose: function(){}};
        
        var _this = this;
        
        ///<Summary type="Function">A placeholder to be used in disposal</Summary>
        this.eventHandler = function(e) {
            _this.highlightVM(e);
        };
        
        window.addEventListener("mousemove", this.eventHandler, false);
    };
            
    highlighter.prototype.nextStyle = function() {
        ///<summary>Get one of the 5 css classes belonging to this object. Classes are chosen sequentially.</summary>
        ///<returns type="String">The class</returns>
        
        if(this.index >= this.styles.length - 1)
            this.index = 0;
        else
            this.index++;
        
        return this.styles[this.index];
    };
    
    highlighter.prototype.highlightVM = function(e) {
        ///<summary>Highlight the current view model.</summary>
        ///<param name="e" type="Any" optional="false">Mousemove event args</param>
        
        var newElement = document.elementFromPoint(e.clientX, e.clientY);
        if(newElement === this.currentElement) return;
        this.currentElement = newElement;
        var vm = wipeout.utils.html.getViewModel(this.currentElement);
        if(!vm || vm === this.currentHighlighter.vm) return;

        var timeout = this.__timeoutToken = {};

        var _this = this;
        setTimeout(function() {
            if(_this.__timeoutToken !== timeout) return;
            
            _this.currentHighlighter.dispose();
            _this.currentHighlighter = new wipeout.profile.highlightVM(vm, _this.nextStyle());
        }, 100);
    };
    
    highlighter.prototype.dispose = function() {
        ///<summary>Dispose of this instances.</summary>
        
        if(this.style.parentNode)
            this.style.parentNode.removeChild(this.style);
        
        delete this.__timeoutToken;
        window.removeEventListener("mousemove", this.eventHandler);
        this.currentHighlighter.dispose();
    };
    
    return highlighter;
});

Class("wipeout.profile.profile", function () { 
    return function(){}
    var doRendering, _initialize, rewriteTemplate, profileState;
    var profile = function profile(profile) {
        ///<summary>Profile this application.</summary>
        ///<param name="profile" type="Boolean" optional="true">Switch profiling on or off. Default is true</param>
        
        if(arguments.length === 0)
            profile = true;
        
        if((profile && profileState) || (!profile && !profileState)) return;
        
        doRendering = doRendering || wipeout.bindings.render.prototype.doRendering;
        _initialize = _initialize || wipeout.viewModels.view.prototype._initialize;
        rewriteTemplate = rewriteTemplate || wipeout.template.engine.prototype.rewriteTemplate;
        
        if(profile) {
            profileState = {
                highlighter: new wipeout.profile.highlighter(),
                infoBox: wipeout.utils.html.createElement(
                    '<div style="position: fixed; top: 10px; right: 10px; background-color: white; padding: 10px; border: 2px solid gray; display: none; max-height: 500px; overflow-y: scroll; z-index: 10000"></div>'),
                eventHandler: function(e) {
                    if (!e.ctrlKey) return;
                    e.stopPropagation();
                    e.preventDefault();

                    var vm = wo.html.getViewModel(e.target);
					if(!vm) return;
                    var vms = vm.getParents();
                    vms.splice(0, 0, vm);

                    // TODO: dispose of old content (dispose methods from buildProfile function)
                    profileState.infoBox.innerHTML = '<span style="float: right; margin-left: 10px; cursor: pointer;">x</span><br/>Open a console window and click on a class to debug it<br/>\
If view models do not have names, you can <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name">name them</a><br/>\
If view models have odd names ensure you are not using a minifier';
                    profileState.infoBox.firstChild.addEventListener("click", function() { profileState.infoBox.style.display = "none"; });

                    var html = [];
                    for (var i = 0, ii = vms.length; i < ii; i++)
                        profileState.infoBox.appendChild(buildProfile(vms[i]).element);
                    
                    profileState.infoBox.style.display = "block";
                },
                dispose: function() {
                    profileState.highlighter.dispose();
                    if(profileState.infoBox.parentNode)
                        profileState.infoBox.parentNode.removeChild(profileState.infoBox);
                    
                    document.body.removeEventListener("click", profileState.eventHandler);
                    wipeout.bindings.render.prototype.doRendering = doRendering;
                    wipeout.viewModels.view.prototype._initialize =  _initialize;
                    wipeout.template.engine.prototype.rewriteTemplate = rewriteTemplate;
                }
            };
            
            wipeout.bindings.render.prototype.doRendering = function() {
                var before = new Date();
                doRendering.apply(this, arguments);
                var time = new Date() - before;
                
                if(!this.value.__woBag.profiler)
                    this.value.__woBag.profiler = {};
                
                this.value.__woBag.profiler["Render time"] = time;
                var template = document.getElementById(this.value.templateId);
                if(template)
                    this.value.__woBag.profiler["Template compile time"] =  wipeout.utils.domData.get(template, "rewriteTemplateTime");
            };
            
             wipeout.viewModels.view.prototype._initialize = function() {
                var before = new Date();
                _initialize.apply(this, arguments);
                var time = new Date() - before;
                
                if(!this.__woBag.profiler)
                    this.__woBag.profiler = {};
                
                this.__woBag.profiler["Initialize time"] = time;
             };
            
            wipeout.template.engine.prototype.rewriteTemplate = function(template) {
                var before = new Date();
                rewriteTemplate.apply(this, arguments);
                var time = new Date() - before;
                
                var script = document.getElementById(template);
                if (script instanceof HTMLElement) {
                    var oldTime = wipeout.utils.domData.get(script, "rewriteTemplateTime");
                    if(oldTime instanceof Number)
                        time += oldTime;
                    
                    wipeout.utils.domData.set(script, "rewriteTemplateTime", time);
                }
            };
            
            document.body.appendChild(profileState.infoBox);
            document.body.addEventListener("click", profileState.eventHandler, false);
            
        } else {
            profileState.dispose();            
            profileState = null;
        }
        
        return;
    };
    
    var viewVm = new Function("viewModel", "model", "//Use your browser's debugger to inspect the model and view model\ndebugger;");
    
	var functionName = /^function\s*([^\s(]+)/;
    var buildProfile = function(vm) {
                
        var div = document.createElement('div');
        wipeout.utils.domData.set(div, wipeout.bindings.wipeout.utils.wipeoutKey, vm);
        
		// IE doesn't support name
		var tmp;		
		var fn = vm.constructor.name ? 
			vm.constructor.name :
			((tmp = vm.constructor.toString().match(functionName)) ? tmp[1] : 'unknown vm type');
			
        var innerHTML = ["<h4 style='cursor: pointer; margin-bottom: 5px;'>" + fn + (vm.id ? (" #" + vm.id) : "") + "</h4>"];
        if(vm.__woBag.profiler)
            for(var i in vm.__woBag.profiler)
                innerHTML.push("<label>" + i + ":</label> " + vm.__woBag.profiler[i]);
        
        div.innerHTML += innerHTML.join("<br />");
        
        function listener() {
            viewVm(vm, vm.model());
        }
        
        div.firstChild.addEventListener("click", listener, false);
        
        return {
            element: div,
            dispsoe: function() {
                div.firstChild.removeEventListener("click", listener);
                wipeout.utils.domData.clear(div);
            }
        };
    };    
    
    return profile;
});


Class("wipeout.template.context", function () {
    
    // warning: do not make observable. This will create a LOT of un necessary subscriptions
    function context (forVm, parentContext, arrayIndex) {
		///<summary>The context for any view model or html property set in a template</summary>
		
		if (forVm && forVm.shareParentScope)
			throw "You cannot create a template context for a view model with a shared parent scope";
		
		///<summary type="Any">The current view model</summary>
        this.$this = forVm;
        
        if (parentContext) {
			///<summary type="Any">The parent render context</summary>
            this.$parentContext = parentContext;
			
			///<summary type="Any">The parent view model</summary>
            this.$parent = parentContext.$this;
			
			///<summary type="Array" generic0="Any">A list of all ancestor view models</summary>
            this.$parents = [parentContext.$this];
            this.$parents.push.apply(this.$parents, parentContext.$parents);
        } else {
			this.$parentContext = null;
			this.$parent = null;
			this.$parents = [];
		}
		
		if (arrayIndex != null) {
			
			///<summary type="Object">An object whcih contains a "value" property. The value is the index. This property is only available for items in a rendered Array</summary>
			this.$index = new busybody.observable();
			this.$index.value = arrayIndex;
		}
    }
    
    // each render context has access to the global scope
    function renderContextPrototype () {}    
    renderContextPrototype.prototype = window;
    context.prototype = new renderContextPrototype();
    
    context.prototype.find = function (searchTermOrFilters, filters) {
		///<summary>Find an item from the ancestor chain</summary>
        ///<param name="searchTermOrFilters" type="String|Object">The search term if a string, search filters if an object</param>
        ///<param name="filters" type="Object" optional="true">The filters if arg 1 is a search term</param>
        ///<returns type="Any">The item searched for</returns>
		
		return (this._finder || (this._finder = new wipeout.utils.find(this))).find(searchTermOrFilters, filters);
    };
    
    context.prototype.contextFor = function (forVm, arrayIndex) {
		///<summary>Create a child context</summary>
        ///<param name="forVm" type="Any">The child to context</param>
        ///<param name="arrayIndex" type="Number" optional="true">The index if this item is in an array</param>
        ///<returns type="wipeout.template.context">The child context</returns>
        
		if (wipeout.settings.displayWarnings && forVm.shareParentScope && arrayIndex != null)
			console.warn("If an item in an array is to be rendered with shareParentScope set to true, this item will not have an $index value in it's renered context");
		
        return forVm && forVm.shareParentScope ? this : new context(forVm, this, arrayIndex);
    };
	
	context.prototype.asGetterArgs = function () {
		///<summary>Return a version of this to be plugged into a function creted by context.buildGetter(...)</summary>
        ///<returns type="Array">the arguments</returns>
		
		return this.getterArgs || (this.getterArgs = [this, this.$this, this.$parent, this.$parents, this.$index]);
	};
	
	context.prototype.asWatchVariables = function () {
		///<summary>Return a version of this which can be plugged into the watch varialbes for a computed who's logic was taken from a context.buildGetter(...)</summary>
        ///<returns type="Object">The watch varialbles</returns>
        
		return this.watchVariables || (this.watchVariables = {
			$context: this, 
			$this: this.$this, 
			$parent: this.$parent, 
			$parents: this.$parents, 
			$index: this.$index
		});
	};
	
	context.prototype.asEventArgs = function (e, element) {
		///<summary>Return a version of this to be plugged into a function creted by context.buildEventCallback(...)</summary>
        ///<returns type="Array">the arguments</returns>
		
		var args = this.asGetterArgs().slice();
		args.push(e);
		args.push(element);
		
		return args;
	};
	
	context.prototype.getComputed = function (forFunction) {
		///<summary>Get a computed from this and a given function</summary>
        ///<param name="forFunction" type="Function">The function</param>
        ///<returns type="busybody.observeTypes.computed">The computed</returns>
		
		return new busybody.observeTypes.computed(forFunction, null, {watchVariables: this.asWatchVariables()});
	}
	
	context.buildGetter = function (logic) {
		///<summary>Build a function around a logic string</summary>
        ///<param name="logic" type="String">The logic</param>
        ///<returns type="Function">A getter</returns>
		
		try {
			var model = /\$model/.test(logic) ? "var $model = $this ? $this.model : null;\n" : "";
			
			//if this changes, look at propertyValue, it uses and arguments[x] argument
			return new Function("$context", "$this", "$parent", "$parents", "$index", model + "return " + logic + ";");
		} catch (e) {
			// TODV: try to take into account some of these cases
			throw "Invalid function logic. Function logic must contain only one line of code and must not have a 'return' statement ";
		}	
	};
	
	//TODM
	var notFunctionCall = /^\s*[Ll]ogic\s*:/;
	context.buildEventCallback = function (logic) {
		///<summary>Build a function around a logic string, specifically for html events</summary>
        ///<param name="logic" type="String">The logic</param>
        ///<returns type="Function">A getter</returns>
		
		if (notFunctionCall.test(logic))
			logic = logic.replace(notFunctionCall, "");
		else if (!/\)[\s;]*$/.test(logic))
			logic += "(e, element)";
			
		try {
			var model = /\$model/.test(logic) ? "var $model = $this ? $this.model : null;\n" : "";
			return new Function("$context", "$this", "$parent", "$parents", "$index", "e", "element", model + logic);
		} catch (e) {
			// TODV: try to take into account some of these cases
			throw "Invalid function logic. Function logic must contain only one line of code and must not have a 'return' statement ";
		}	
	};
    
    return context;
});


Class("wipeout.template.engine", function () {
        
    function engine () {
		///<summary>The wipeout template engine</summary>
		
		///<summary type="Object">Cached templates</summary>
        this.templates = {};
        
		///<summary type="wipeout.utils.dictionary">Cached view model initializers</summary>
        this.xmlIntializers = new wipeout.utils.dictionary;
    }
    
    engine.prototype.setTemplate = function (templateId, template) {
		///<summary>Associate a template string with a template id</summary>
        ///<param name="templateId" type="String|wipeout.wml.wmlAttribute">The template</param>
        ///<returns type="wipeout.template.rendering.compiledTemplate">The compiled template</returns>
		
		if (!templateId) throw "Invalid template id";
		
        if (typeof template === "string")
            template = wipeout.wml.wmlParser(template);
		else if (template.nodeType === 2)
            template = wipeout.wml.wmlParser(template.value);
        
        return this.templates[templateId] = new wipeout.template.rendering.compiledTemplate(template);
    };
    
    engine.prototype.getTemplateXml = function (templateId, callback) {  
		///<summary>Load a template and pass the value to a callback. The load may be synchronus (if the template exists) or asynchronus) if the template has to be loaded.</summary>
        ///<param name="templateId" type="String">The template id</param>
        ///<param name="callback" type="Function">The callback</param>
        ///<returns type="Object">Null, if the template is loaded, an object with a "cancel" function to cancel the load</returns>
	
		templateId = fixTemplateId(templateId);      
        return this.compileTemplate(templateId, (function() {
            callback(this.templates[templateId].xml);
        }).bind(this));
    };
    
	var fixTemplateId = (function () {
		var blankTemplateId;
		return function (templateId) {
			return templateId ||
				blankTemplateId || 
				(blankTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate(""));
		};
	}());
	
    engine.prototype.compileTemplate = function (templateId, callback) {
		///<summary>Load a template and pass the value to a callback. The load may be synchronus (if the template exists) or asynchronus) if the template has to be loaded.</summary>
        ///<param name="templateId" type="String">The template id</param>
        ///<param name="callback" type="Function">The callback</param>
        ///<returns type="Object">Null, if the template is loaded, an object with a "cancel" function to cancel the load</returns>
        
		templateId = fixTemplateId(templateId);
			
        // if the template exists
        if (this.templates[templateId] instanceof wipeout.template.rendering.compiledTemplate) {
            callback(this.templates[templateId]);
            return null;
        }
        
        // if the template is in the middle of an async load
        if (this.templates[templateId] instanceof wipeout.template.loader) {
            return this.templates[templateId].add((function (template) {
                if (this.templates[templateId] instanceof wipeout.template.loader)
                    this.setTemplate(templateId, template);
                
                this.compileTemplate(templateId, callback);
            }).bind(this));
        } 
        
        if (!this.templates[templateId]) {
            
            // if the template exists in the DOM but has not been loaded
            var script;      
            if (script = document.getElementById(templateId)) {
                callback(this.setTemplate(templateId, trimToLower(script.tagName) === "script" ? script.text : script.innerHTML));
                return null;
            } 

            // if an async process has not been kicked off yet
            if (wipeout.settings.asynchronousTemplates) {                
                this.templates[templateId] = new wipeout.template.loader(templateId);
                return this.compileTemplate(templateId, callback);
            }
        }
        
        throw "Could not load template \"" + templateId + "\".";    //TODE
    };
    
    engine.prototype.getVmInitializer = function (wmlInitializer) {
		///<summary>Get a compiled initializer from a piece of wml</summary>
        ///<param type="wipeout.wml.wmlElement" name="wmlInitializer">The xml</param>
        ///<returns type="wipeout.template.initialization.compiledInitializer">The initializer</returns>
		
        var tmp;
        return (tmp = this.xmlIntializers.value(wmlInitializer)) ?
            tmp :
            this.xmlIntializers.add(wmlInitializer, new wipeout.template.initialization.compiledInitializer(wmlInitializer));
    };
    
    engine.instance = new engine();
        
    return engine;
});

Class("wipeout.template.filters", function () {
	return function filters() {}
});


Class("wipeout.template.initialization.viewModelPropertyValue", function () {
	
    var viewModelPropertyValue = wipeout.template.propertyValue.extend(function viewModelPropertyValue (name, value, parser) {
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
		
		var op = busybody.tryObserve(this.propertyOwner, this.name, callback);
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


Class("wipeout.template.loader", function () {
    
    function loader(templateName) {
        ///<summary>Private class for loading templates asynchronously</summary>
        ///<param name="templateName" type="string" optional="false">The name and url of this template</param>
		
        // specifies success callbacks for when template is loaded. If this property in null, the loading process has completed
        this._callbacks = [];
        
        // the name and url of the template to load
        this.templateName = templateName;
        
        wipeout.utils.obj.ajax({
            type: "GET",
            url: templateName,
            success: (function(result) {
                this._success = true;
                var callbacks = this._callbacks;
                delete this._callbacks;
				
				this.templateValue = result.responseText;
                for(var i = 0, ii = callbacks.length; i < ii; i++)
                    callbacks[i](this.templateValue);
            }).bind(this),
            error: (function() {
                delete this._callbacks;
                this._success = false;
                throw "Could not locate template \"" + templateName + "\"";
            }).bind(this)
        });
    }
    
    loader.prototype.add = function(success) {
        ///<summary>Call success when this template is loaded</summary>
        ///<param name="success" type="Function" optional="false">The callback</param>
        ///<returns type="Object">Null, if the template is loaded, an object with a "cancel" function to cancel the load</returns>
        
        if (this._callbacks) {
            this._callbacks.push(success);
            
            return {
                cancel: (function() {
                    var i;
                    if (this._callbacks && (i = this._callbacks.indexOf(success)) !== -1)
                        this._callbacks.splice(i, 1);
                }).bind(this)
            };
        }
        
        if (this._success) {
            success(this.templateValue);
            return null;
        }
        
        throw "Could not load template \"" + this.templateName + "\"";
    }
	
	return loader;
});


Class("wipeout.template.rendering.builder", function () {
        
    // generate unique ids
    var wipeoutPlaceholder = "wipeout_placeholder_id_";
    builder.uniqueIdGenerator = (function() {
        var i = Math.floor(Math.random() * 1000000000);
        return function() {
			///<summary>Get a unique html id</summary>
			///<returns type="String">The id</returns>
			
            return wipeoutPlaceholder + (++i);
        }
    }());
    
    function builder(compiledTemplate) {
        ///<summary>Build html and execute logic giving the html functionality</summary>
        ///<param name="compiledTemplate" type="wipeout.template.compiledTemplate" optional="false">The template to base the html on</param>
        
        ///<summary type="Array">A list of processors to add dynamic content</summary>
        this.elements = [];
        
        var htmlFragments = [];
        
        enumerateArr(compiledTemplate.html, function(html) {
            if (typeof html === "string") {
                // static html, add to output
                htmlFragments.push(html);
            } else {
                // dynamic content. Generate an id to find the html and add actions
                var id = builder.uniqueIdGenerator();
                htmlFragments.push(" id=\"" + id + "\"");
                this.elements.push({
                    id: id,
                    actions: html
                });
            }
        }, this);
        
        ///<summary type="String">The static html for this builder</summary>
        this.html = htmlFragments.join("");
    };
	
	builder.applyToElement = function (setter, element, renderContext) {
		///<summary>Apply this attribute to an element/summary>
        ///<param name="setter" type="wipeout.template.rendering.htmlAttributeSetter">The setter</param>
        ///<param name="element" type="Element">The element</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Array">An array of disposables</returns>
		
		var op = [];
		op.push.apply(op, setter.prime(element, function () {
			var o = wipeout.template.rendering.htmlAttributes[setter.action || setter.name](element, setter, renderContext);
			if (o && o.dispose instanceof Function)
				op.push(o);
			else if (o instanceof Function)
				op.push({ dispose: o });
		}));
		
		return op;
	};
	
	builder.prototype.execute = function(renderContext) {
        ///<summary>Add dynamic content to the html</summary>
        ///<param name="renderContext" type="wipeout.template.renderContext" optional="false">The context of the dynamic content</param>
		///<returns type="Function">A dispose function</returns>
		
        var output = [];
        enumerateArr(this.elements, function(elementAction) {
            // get the element
            var element = document.getElementById(elementAction.id);
            element.removeAttribute("id");
            
            // run all actions on it
            enumerateArr(elementAction.actions, function(setter) {				
				output.push.apply(output, builder.applyToElement(setter, element, renderContext));
            });
        }, this);
    
        return function() {
            enumerateArr(output.splice(0, output.length), function(d) {
                d.dispose();
            });
        };
    }
    
    return builder;
});


Class("wipeout.template.rendering.compiledTemplate", function () {
	    
    compiledTemplate.getPropertyFlags = function(name) {
		///<summary>Seperate name from flags by "--"</summary>
        ///<param name="name" type="String">The combined name and flags</param>
        ///<returns type="Object">The name and flags</returns>
        
        var flags = name.indexOf("--");
        if (flags === -1)
            return {
                flags: [],
                name: name
            };
        
        return {
            flags: name.substr(flags + 2).toLowerCase().split("-"),
            name: name.substr(0, flags)
        };
    };
        
    function compiledTemplate(template) {
        ///<summary>Scans over an xml template and compiles it into something which can be rendered</summary>
        ///<param name="template" type="wipeout.xml.xmlElement">The template</param>
		
		///<summary type="wipeout.xml.xmlElement">The template</summary>
        this.xml = template;
		
		///<summary type="Array">Generated static html and modifiers</summary>
        this.html = [];
        this._addedElements = [];
        
        enumerateArr(template, this.addNode, this);
            
        // concat successive strings
        for (var i = this.html.length - 1; i > 0; i--) {
            if (typeof this.html[i] === "string" && typeof this.html[i - 1] === "string")
                this.html[i - 1] += this.html.splice(i, 1)[0];
        }
        
        // protection from infite loops not needed
        delete this._addedElements;
    }
    
    compiledTemplate.prototype.addNonElement = function(node) {
        ///<summary>Add a node to the html string without scanning for dynamic functionality</summary>
        ///<param name="node" type="Object">The node</param>
                
        this.html.push(node.serialize());
    };
    
    var begin = "{{";
    var end = "}}";
	
	//TODM
    compiledTemplate.renderParenthesis = function(beginParenthesis, endParenthesis) {
        ///<summary>Change the escape values to render. Default is {{ and }}</summary>
        ///<param name="beginParenthesis" type="String">the beginnin</param>
        ///<param name="endParenthesis" type="String">the end</param>
		
		begin = beginParenthesis;
		end = endParenthesis;
	};
	
    compiledTemplate.prototype.addTextNode = function(node) {
        ///<summary>Add a text node to the html string scanning for dynamic functionality</summary>
        ///<param name="node" type="wipeout.wml.wmlString">The node</param>
        
        var html = node.serialize(), oldIndex = 0, index = 0;
        while ((index = html.indexOf(begin, oldIndex)) !== -1) {
            this.html.push(html.substring(oldIndex, index));
			
			oldIndex = index + begin.length;
			if ((index = html.indexOf(end, oldIndex)) === -1)
                throw "TODE";
            
            // add the beginning of a placeholder
            this.html.push("<script");

            // add the id flag and the id generator
            this.html.push([new wipeout.template.rendering.htmlPropertyValue("wo-render", html.substring(oldIndex, index))]);

            // add the end of the placeholder
            this.html.push(' type="placeholder"></script>');
			
			oldIndex = index + begin.length;
        }
        
        this.html.push(html.substr(oldIndex));
    };
    
    compiledTemplate.prototype.addViewModel = function(vmNode) {
        ///<summary>Add a node which will be scanned and converted to a view model at a later stage</summary>
        ///<param name="node" type="wipeout.wml.wmlElement">The node</param>
        
        // add the beginning of a placeholder
        this.html.push("<script");
        
        // add the id flag and the id generator
        this.html.push([new wipeout.template.rendering.htmlPropertyValue("wipeoutCreateViewModel", vmNode)]);
        
        // add the end of the placeholder
        this.html.push(' type="placeholder"></script>');
    };
	
	compiledTemplate.getAttributeName = function (attributeName) {
        ///<summary>Returns the name of the wipeout attribute that this attributeName is pointing to. Sometimes wipeout modifies the actual attribute, for instance, "wo-attr-value" will be modified to "wo-attr"</summary>
        ///<param name="attributeName" type="String">The attribute name</param>
        ///<returns type="String">The altered attribute name, or null if the attribute is not a wipeout attribute</returns>
		
		if (wipeout.template.rendering.htmlAttributes[attributeName])
			return attributeName;
		
		//TODM
		for (var i in wipeout.template.rendering.dynamicHtmlAttributes)
			if (wipeout.template.rendering.dynamicHtmlAttributes[i].test(attributeName))
				return i;
	};
    
    compiledTemplate.prototype.addAttributes = function(attributes) {
        ///<summary>Add a group of attributes</summary>
        ///<param name="attributes" type="Object">The attributes</param>
        
        var modifications;
        
		var attr;
        enumerateObj(attributes, function (attribute, name) {
			     
			var flags = compiledTemplate.getPropertyFlags(name);
			name = flags.name;
			flags = flags.flags;
			
            // if it is a special attribute
			attr = false;
            if (attr = compiledTemplate.getAttributeName(name)) {

                // if it is the first special attribute for this element
                if (!modifications)
                    this.html.push(modifications = []);
					
				var parser;
				for (var i = 0, ii = flags.length; i < ii; i++) {
					if (wipeout.template.initialization.parsers[flags[i]]) {
						if (parser)
							throw "The parser has already been set for this element"; //TODE

						parser = flags[i];
					}
				}
				
				if (attr !== name) {
					modifications.push(new wipeout.template.rendering.htmlPropertyValue(name, attribute.value, parser, attr));
				} else {
					// ensure the "id" modification is the first to be done
					name === "id" ?
						modifications.splice(0, 0, new wipeout.template.rendering.htmlPropertyValue(name, attribute.value, parser)) :
						modifications.push(new wipeout.template.rendering.htmlPropertyValue(name, attribute.value, parser));
				}
            } else {
                // add non special attribute
                this.html.push(" " + name + attribute.serializeValue());
            }
        }, this);
    };
    
    compiledTemplate.prototype.addElement = function(element) {
        ///<summary>Add an element which will be scanned for functionality and added to the dom</summary>
        ///<param name="node" type="wipeout.wml.wmlElement">The node</param>
        
        // add the element beginning
        this.html.push("<" + element.name);

        this.addAttributes(element.attributes);

        // add the element end
        if (element.inline) {
            this.html.push(" />");
        } else {
            this.html.push(">");
            enumerateArr(element, function(element) {
                this.addNode(element);
            }, this);
            this.html.push("</" + element.name + ">");
        }
    };
    
    compiledTemplate.prototype.addNode = function(node) {
        ///<summary>Add a node dynamic or not to the generated html</summary>
        ///<param name="node" type="Object">The node</param>
        
        if(this._addedElements.indexOf(node) !== -1)
            throw "Infinite loop"; //TODE
        
        this._addedElements.push(node);
        
        if (node.nodeType === 3)
            this.addTextNode(node);
        else if (node.nodeType !== 1)
            this.addNonElement(node);
        else if (wipeout.utils.viewModels.getViewModelConstructor(node))
            this.addViewModel(node);
        else
            this.addElement(node);
    };
    
    compiledTemplate.prototype.quickBuild = function(htmlAddCallback, renderContext) {
        ///<summary>Add html and execute dynamic content. Ensures synchronocity so reuses the same builder</summary>
        ///<param name="htmlAddCallback" type="Function">A function to add html to the DOM</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="busybody.disposable">A disposable</returns>
        
        var builder = this._builder || (this._builder = this.getBuilder());
		
		htmlAddCallback(builder.html);
		return builder.execute(renderContext);
    };
    
    compiledTemplate.prototype.getBuilder = function() {
        ///<summary>Get an item which will generate dynamic content to go with the static html</summary>
        ///<returns type="wipeout.template.rendering.builder">Get a builder for this template</returns>
        
        return new wipeout.template.rendering.builder(this);
    };
        
    return compiledTemplate;
});


HtmlAttr("attr", function () {
	
	var test = attr.test = function (attributeName) {
		return /^\s*(data\-)?wo\-attr\-./.test(attributeName);
	};
	
	function attr (element, attribute, renderContext) {
        ///<summary>Add html attributes to an element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		var attributeName = attribute.name.substr(attribute.name.indexOf("attr-") + 5);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            if (element.getAttribute(attributeName) !== newVal)
                element.setAttribute(attributeName, newVal)
		}, true);
    }
	
	return attr;
});


HtmlAttr("class", function () {
	
	var test = _class.test = function (attributeName) {
		return /^\s*(data\-)?wo\-class\-./.test(attributeName);
	};
	
	var buildRegex = function (forClass) {
		
		return new RegExp("(?:^|\\s)" + forClass + "(?!\\S)", "g");
	};

	var hasClass = function (element, className) {
		
		return buildRegex(className).test(element.className);
	};

	var addClass = function (element, className) {
		
		if (!hasClass(element, className))
			element.className = trim(element.className + (element.className.length ? " " : "") + className);
	};

	var removeClass = function (element, className) {
		
		var re;
		if ((re = buildRegex(className)).test(element.className))
			element.className = trim(element.className.replace(re, ""));
	};
	
	function old_class(element, attribute, renderContext) {
		var attr, has;
		var className = attribute.name.substr(attribute.name.indexOf("class-") + 6);
		if (!(has = hasClass(element, className)) && attribute.get(renderContext))
			addClass(element, className);
		else if (has && !attribute.get(renderContext))
			removeClass(element, className);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (!oldVal && newVal)
				addClass(element, className);
			else if (oldVal && !newVal)
				removeClass(element, className);
		}, false);
	}
	
	function _class (element, attribute, renderContext) { //TODE
        ///<summary>Add or remove css classes</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		if (wipeout.settings.useElementClassName || !element.classList)
			return old_class(element, attribute, renderContext);
		
		var className = attribute.name.substr(attribute.name.indexOf("class-") + 6);
		if (attribute.get(renderContext))
			element.classList.add(className);
		else
			element.classList.remove(className);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal)
				element.classList.add(className);
			else
				element.classList.remove(className);
		}, false);
    }
	
	return _class;
});


HtmlAttr("content", function () {
	return function content (element, attribute, renderContext) { //TODE
        ///<summary>Set the content of a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            element.innerHTML = newVal == null ? "" : newVal;
        }, true);
    }
});


HtmlAttr("data", function () {
	
	return function data (element, attribute, renderContext) { //TODE
        ///<summary>Add data to an element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		attribute.setData(element, "wo-data", attribute);
    }
});


HtmlAttr("event", function () {
    
	var test = event.test = function (attributeName) {
		return /^\s*(data\-)?wo\-event\-./.test(attributeName);
	};
	
    function event (element, attribute, renderContext) { //TODE
        ///<summary>Subscribe to a html event</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		attribute.onElementEvent(attribute.name.substr(attribute.name.indexOf("event-") + 6), renderContext);
    };
	
	return event;
});

// add some shortcuts to common html events
enumerateArr(["blur", "change", "click", "focus", "keydown", "keypress", "keyup", "mousedown", "mouseout", "mouseover", "mouseup", "submit"], 
	function (event) {
	HtmlAttr(event, function () {

		return function (element, attribute, renderContext) { //TODE
			///<summary>Subscribe to a html event</summary>
			///<param name="element" type="Element">The element</param>
			///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
			///<param name="renderContext" type="wipeout.template.context">The current context</param>
			///<returns type="Function">A dispose function</returns>
			
			attribute.onElementEvent(event, renderContext);
		};
	});
});


Class("wipeout.template.rendering.htmlAttributes.id", function () {
	return function id (element, attribute, renderContext) {
        ///<summary>Add an id to an element and add the element to tempalteItems</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		var val = attribute.value();
        if (renderContext.$this instanceof wipeout.viewModels.view)
        	renderContext.$this.templateItems[val] = element;
		
        element.id = val;
        
        return function() {
            if (renderContext.$this instanceof wipeout.viewModels.view && renderContext.$this.templateItems[val] === element)
                delete renderContext.$this.templateItems[val]
        }
    };
});


HtmlAttr("on-event", function () {
	
	return function onEvent (element, attribute, renderContext) { //TODE
        ///<summary>Used by the wo-value attribute to get when the value change event should be triggered. Default is "change".</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		attribute.setData(element, "wo-on-event", attribute.value());
    }
});


HtmlAttr("render", function () {
	return function render (element, attribute, renderContext) {
        ///<summary>Render content inside a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		//TODO: is this a hack?
		if (element.nodeType === 1 && wipeout.utils.viewModels.getElementName(element) !== "script") {
			element.innerHTML = '<script type="placeholder"></script>';
			return render(element.firstChild, attribute, renderContext);
		}
		
        var htmlContent = new wipeout.template.rendering.renderedContent(element, attribute.value(), renderContext);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            htmlContent.render(newVal);
        }, true);
        
        return htmlContent.dispose.bind(htmlContent);
    }
});


HtmlAttr("style", function () {
	
	var test = style.test = function (attributeName) {
		return /^\s*(data\-)?wo\-style\-./.test(attributeName);
	};
	
	function style (element, attribute, renderContext) { //TODE
        ///<summary>Bind to the style of a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		var styleName = attribute.name.substr(attribute.name.indexOf("style-") + 6);
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (element.style[styleName] != newVal)
				element.style[styleName] = newVal;
		}, true);
    }
	
	return style;
});


HtmlAttr("value", function () {
	
	function radio (radio, attribute, renderContext) { 
		
		var val = attribute.value();
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + val + "\".";
		
		var tmpData;		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal === getRadioButtonVal(radio, attribute, renderContext))
				radio.setAttribute("checked", "checked");
			else
				radio.removeAttribute("checked");
        }, true);
		
		attribute.onElementEvent("change", renderContext, function () {
			attribute.set(renderContext, getRadioButtonVal(radio, attribute, renderContext), radio);
        });
	}
	
	var noVal = {};
	function getCheckboxVal(element, attribute, renderContext) {
		var tmpData;
		if (tmpData = attribute.getData(element, "wo-data"))
			return tmpData.get(renderContext, element);
		if ((tmpData = element.getAttribute("value")) != null)
			return tmpData;
		
		return noVal;		
	}
	
	function getRadioButtonVal(element, attribute, renderContext) {
		var tmpData = getCheckboxVal(element, attribute, renderContext);
		if (tmpData === noVal)
            throw "Radio buttons with the \"wo-value\" attribute must have a \"value\" or \"wo-data\" attribute.";
		
		return tmpData;
	}
	
	function checkbox (checkbox, attribute, renderContext) { 
		
		var val = attribute.value();
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + val + "\".";
		
		// set default
		var tmpData;
		if ((tmpData = getCheckboxVal(checkbox, attribute, renderContext)) !== noVal)
			attribute.set(renderContext, tmpData, checkbox);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal || newVal === "")
				checkbox.setAttribute("checked", "checked");
			else
				checkbox.removeAttribute("checked");
        }, true);
		
		attribute.onElementEvent("change", renderContext, function () {
			tmpData = getCheckboxVal(checkbox, attribute, renderContext);
			if (checkbox.getAttribute("checked") != null) {
				if (tmpData === noVal)
					tmpData = true;
			} else {
				tmpData = tmpData === noVal ? false : null;
			}
			
			attribute.set(renderContext, tmpData, checkbox);
        });
	}
	
	return function value (element, attribute, renderContext) { //TODE
        ///<summary>Bind to the value of a htl element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (element.type === "checkbox")
			return checkbox(element, attribute, renderContext);
		
		if (element.type === "radio")
			return radio(element, attribute, renderContext);
		
		var val = attribute.value();
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + val + "\".";
		
		var textarea = trimToLower(element.tagName) === "textarea";
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (textarea && element.innerHTML !== newVal)
                element.innerHTML = newVal;
			else if (!textarea && element.value !== newVal)
                element.value = newVal;
        }, true);
		
		attribute.onElementEvent(attribute.getData(element, "wo-on-event") || "change", renderContext, function () {
			attribute.set(renderContext, textarea ? element.innerHTML : element.value, element);
        });
    }
});


HtmlAttr("visible", function () {
	return function visible (element, attribute, renderContext) { //TODE
        ///<summary>Determine element visibility</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		element.style.display = attribute.get(renderContext) ? "" : "none";
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal && !oldVal)
                element.style.display = "";
			else if (!newVal && oldVal)
                element.style.display = "none";
        }, false);
    }
});


Class("wipeout.template.rendering.htmlAttributes.wipeoutCreateViewModel", function () {
	return function wipeoutCreateViewModel (element, attribute, renderContext) {
        ///<summary>Used internally to add view model elements</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
        var op = new wipeout.template.rendering.viewModelElement(element, attribute.value(), renderContext);
        
        return function () {
            op.dispose(true);
        };
    };
});
        


Class("wipeout.template.rendering.htmlPropertyValue", function () {
	
	var htmlPropertyValue = wipeout.template.propertyValue.extend(function htmlPropertyValue (name, value, parser, action) {
		///<summary>Set html attributes</summary>
        ///<param name="name" type="String">The name of the attribute</param>
        ///<param name="value" type="String">The value of the attribute</param>
        ///<param name="parser" type="String|Function" optional="true">The parser or a pointer to it</param>
        ///<param name="action" type="String" optional="true">The wipoeut html attribute to use. If null, use "name"</param>
		
		this._super(name, value, parser);
		
		///<summary type="String">The wipoeut html attribute to use. If null, use "name"</summary>
		this.action = action;
	});
	
	htmlPropertyValue.prototype.eventBuild = function () {
		///<summary>Build an event invoker for this._value</summary>
        ///<returns type="Function">A function to get the value from render context parts</returns>
		
		return this._eventBuilt || (this._eventBuilt = wipeout.template.context.buildEventCallback(this.value()));
	};
	
	htmlPropertyValue.prototype.onElementEvent = function (event, renderContext, callback, capture) { //TODE
		///<summary>When called within a wipeout binding function, will watch for a an element event. Also handles all disposal in this case</summary>
        ///<param name="event" type="String">The event</param>
        ///<param name="renderContext" type="wipeout.template.context">The context of the callback</param>
        ///<param name="callback" type="Function">A callback for the event. To use the render context, generate the callback using wipeout.template.context.buildEventCallback</param>
        ///<param name="capture" type="Boolean">Capture the event within this element</param>
        ///<returns type="Function">A dispose function to dispose prematurely</returns>
		
		this.primed();
		
		var element = this.propertyOwner;
		callback = callback || (function (e) {
			e.preventDefault();	//TODO: test
			this.eventBuild().apply(null, renderContext.asEventArgs(e, element));
		}).bind(this);
						
        element.addEventListener(event, callback, capture || false);
        
        var output = new busybody.disposable(function() {
			element.removeEventListener(event, callback, capture || false);
			callback = null;
        });
		
		this._caching.push(output);
		
		return output.dispose.bind(output);
    };
	
	htmlPropertyValue.prototype.setData = function (element, name, data) {
		///<summary>When used by a wipeout html attribute (wo.htmlAttributes), set data against the html element. This is useful to pass data between html attributes</summary>	//TODM
        ///<param name="element" type="Element">The html element</param>
        ///<param name="name" type="String">The data key</param>
        ///<param name="data" type="Any">the data</param>
        ///<returns type="Any">The data</returns>
        
		this.primed();
		
		this._caching.push({
			dispose: function () {
				wipeout.utils.domData.clear(element, name);
			}
		});
		
		return wipeout.utils.domData.set(element, name, data);
	};
	
	htmlPropertyValue.prototype.getData = function (element, name) {
		///<summary>Get data saved against a html element</summary>
        ///<param name="element" type="Element">the element</param>
        ///<param name="name" type="String">The data key</param>
        ///<returns type="Any">The data</returns>
		
		return wipeout.utils.domData.get(element, name);
	};
	
	htmlPropertyValue.prototype.dataExists = function (element, name) {
		///<summary>Determine whether an element has a data key</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="name" type="String">The data key</param>
        ///<returns type="Boolean">The result</returns>
		
		return wipeout.utils.domData.exists(element, name);
	};
	
	return htmlPropertyValue;
});


Class("wipeout.template.rendering.renderedArray", function () {
    
	var renderedArray = busybody.disposable.extend(function renderedArray (array, parent) {
		///<summary>Helper for rendering arrays</summary>
        ///<param name="array" type="Array">The array</param>
        ///<param name="parent" type="wipeout.template.rendering.renderedContent">The renderedContent to help</param>
				
		this._super();
		
		///<summary type="wipeout.template.rendering.renderedContent">The parent to help</summary>
		this.parent = parent;
		
		///<summary type="Array">The array</summary>
		this.array = array;
		if (this.parent.parentRenderContext && this.parent.parentRenderContext.$this instanceof wipeout.viewModels.itemsControl && array === this.parent.parentRenderContext.$this.items)
			///<summary type="wo.itemsControl">The items control if the array belongs to one</summary>
			this.itemsControl = this.parent.parentRenderContext.$this;
		
		///<summary type="Array">Cache the child renderedContents </summary>
		this.children = [];
        
        if (this.itemsControl) {
			if (this.itemsControl.$getChild) throw "These items are being rendered already.";
			
			//TODV
            this.itemsControl.$getChild = (function (i) {
				if (arguments.length === 0) {
					var op = this.children.slice();
					for (var i = 0, ii = op.length; i < ii; i++)
						op[i] = op[i].renderedChild;
						
					return op;
				}
				
				return this.children[i] ? this.children[i].renderedChild : undefined; 
			}).bind(this);
		}
	});
	
	renderedArray.prototype.remove = function (item) {
		///<summary>Clean up item before removal</summary>
        ///<param name="item" type="wipeout.template.rendering.renderedContent">The item</param>
		
		if (this.itemsControl)
			this.itemsControl.onItemRemoved(item.renderedChild);

		delete item.renderedChild;
		delete item.forItem;

		item.dispose();
	};
	
	var mysteryItem = {};
	renderedArray.prototype.render = function (changes) {
		///<summary>Alter the DOM based on array changes</summary>
        ///<param name="changes" type="Array">The array changes</param>
		
		var removed = [];
		enumerateArr(changes, function (change) {
			if (change.type === "splice") {
				var args = new Array(change.addedCount);
				for (var i = 0; i < change.addedCount; i++) args[i] = mysteryItem;
				args.splice(0, 0, change.index, change.removed.length);

				removed.push.apply(removed, this.children.slice(change.index, change.index + change.removed.length));
				this.children.splice.apply(this.children, args);
			} else if (!isNaN(parseInt(change.name))) {
				if (this.children[change.name] !== mysteryItem)
					removed.push(this.children[change.name]);

				this.children[change.name] = mysteryItem;
			}
		}, this);

		// ignore items which were added and then removed
		for (var k = removed.length - 1; k >= 0; k--)
			if (removed[k] === mysteryItem)
				removed.splice(1, k);

		// find added items
		for (var i = 0, ii = this.children.length; i < ii; i++) {
			if (this.children[i] !== mysteryItem) continue;

			// find if added item had been previously removed
			for (var k = 0, kk = removed.length; k < kk; k++) {
				if (removed[k].forItem === this.array[i]) {
					var item = removed.splice(k, 1)[0];
					if (i === 0)
						this.parent.prepend(item);
					else
						this.children[i - 1].insertAfter(item);

					item.renderContext.$index.value = i;
					item.rename("item: " + i);
					this.children[i] = item;

					break;
				}
			}

			// item was moved
			if (k != kk) 
				continue;

			var placeholder = document.createElement("script");
			if (i === 0)
				this.parent.prepend(placeholder);
			else
				this.children[i - 1].insertAfter(placeholder);

			this.children[i] = new wipeout.template.rendering.renderedContent(placeholder, "item: " + i, this.parent.parentRenderContext);
			var vm = this.itemsControl ? this.itemsControl._createItem(this.array[i]) : this.array[i];
			this.children[i].render(vm, i);
			this.children[i].forItem = this.array[i];
			if (this.itemsControl) {
				this.children[i].renderedChild = vm;
				this.itemsControl.onItemRendered(vm);
			}
		};

		enumerateArr(removed, this.remove, this);
	};
	
	renderedArray.prototype.dispose = function () {
		///<summary>Dispose of this helper</summary>
		
		this._super();

		enumerateArr(this.children, this.remove, this);
		this.children.length = 0;

		if (this.itemsControl) {
			delete this.itemsControl.$getChild;
			delete this.itemsControl;
		}
		
		delete this.array;
	};
	
	return renderedArray;
});


(function () {
    
	var renderedContent = wipeout.template.rendering.renderedContent;
	
	function getNodesAndRemoveDetatched(renderedContentOrHtml) {
              
		try {
			return renderedContentOrHtml instanceof renderedContent ? 
				renderedContentOrHtml.detatch() :
				(renderedContentOrHtml instanceof Array ? renderedContentOrHtml : [renderedContentOrHtml]);
		} finally {
			if (renderedContentOrHtml instanceof renderedContent)
				delete renderedContentOrHtml.detatched;
		}
	}
    
    renderedContent.prototype.prepend = function (content) {
		///<summary>Prepend content to the renderedContent</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
              
		content = getNodesAndRemoveDetatched(content);
		
		content.push(this.openingTag.nextSibling || this.closingTag);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentNode.insertBefore(content[i], content[i + 1]);
    };
    
	/* this is not needed or tested
    renderedContent.prototype.append = function (content) {
              
		var nodes = getNodesAndRemoveDetatched(content);
		
		var closing = this.closingTag;
		enumerateArr(nodes, function (node) {
			closing.parentNode.insertBefore(node, closing);
		});
    };*/
    
    renderedContent.prototype.insertBefore = function (content) {
		///<summary>Insert content before this</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
		
		enumerateArr(getNodesAndRemoveDetatched(content), function (node) {
			this.parentNode.insertBefore(node, this);
		}, this.openingTag);
    };
    
    renderedContent.prototype.insertAfter = function (content) {
		///<summary>Insert content after this</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
              
		content = getNodesAndRemoveDetatched(content);
		
		if (this.closingTag.nextSibling)
			this.closingTag.parentNode.insertBefore(content[content.length - 1], this.closingTag.nextSibling);
		else
			this.closingTag.parentNode.appendChild(content[content.length - 1]);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentNode.insertBefore(content[i], content[i + 1]);
    };
    
    renderedContent.prototype.detatch = function() {
		///<summary>This renderedContent and all of it's html from the DOM</summary>
        ///<returns type="Array" generic0="Element">The html</retruns>
		
		if (!this.detatched) {		
			var current = this.openingTag;
			this.detatched = [this.openingTag];

			for (var i = 0; current && current !== this.closingTag; i++) {
				this.detatched.push(current = current.nextSibling); 
				this.detatched[i].parentNode.removeChild(this.detatched[i]);
			}
		}
        
        return this.detatched.slice();
    };
    
    renderedContent.prototype.allHtml = function() {
		///<summary>Get all of the html for this</summary>
        ///<returns type="Array" generic0="Element">The html</retruns>
		
		if (this.detatched) return this.detatch();
		
        var output = [this.openingTag], current = this.openingTag;
        
        while (current && current !== this.closingTag) {
            output.push(current = current.nextSibling); 
        }
        
        return output;
    };
}());


Class("wipeout.template.rendering.viewModelElement", function () {
    
    var viewModelElement = wipeout.template.rendering.renderedContent.extend(function viewModelElement (element, xmlOverride, parentRenderContext) {
        ///<summary>The begin and end comment tags which surround and render a view model</summary>
        ///<param name="element" type="Element">The html element to replace with the view model</param>
        ///<param name="xmlOverride" type="wipeout.wml.wmlElement" optional="true">If set, will use this xml to initialize the view model. If not will parse and use the element property</param>
        ///<param name="parentRenderContext" type="wipeout.template.context" optional="true">The render context of the parent view model</param>
        
        var vm = wipeout.utils.viewModels.getViewModelConstructor(xmlOverride ? xmlOverride : element);
        
        if(!vm)
            throw "Invalid view model";
        
        this._super(element, wipeout.utils.obj.trim(vm.name), parentRenderContext);
        
        // create actual view model
        this.createdViewModel = new vm.constructor();
		
		var initializer = wipeout.template.engine.instance
            .getVmInitializer(xmlOverride || wipeout.wml.wmlParser(element));
		
		// nothing to dispose for shareParentScope
		var d1 = initializer.initialize(this.createdViewModel, null, "shareParentScope");
		
		///<summary type="wipeout.template.context">The context for the view model</summary>
        this.renderContext = parentRenderContext ?
			parentRenderContext.contextFor(this.createdViewModel) :
			new wipeout.template.context(this.createdViewModel);
        
        // initialize the view model
        var d2 = initializer.initialize(this.createdViewModel, this.renderContext);
        
		this.disposeOfViewModelBindings = function () {
			//TODO, this could be a bit better
			d1.apply(this, arguments);
			d2.apply(this, arguments);
		};
		
        // run onInitialized after value initialization is complete
        if (this.createdViewModel instanceof wipeout.viewModels.view)
            this.createdViewModel.onInitialized();
        
        this.render(this.createdViewModel);
		this.render = blockRendering;
    });
	
	function blockRendering () {
		throw "A view model element can only be rendered once";
	}
    
    viewModelElement.prototype.dispose = function(leaveDeadChildNodes) {
        ///<summary>Dispose of this view model and viewModel element, removing it from the DOM</summary>
        ///<param name="leaveDeadChildNodes" type="Boolean">If set to true, do not remove html nodes after disposal. This is a performance optimization</param>
        
        this._super(leaveDeadChildNodes);
		
		this.disposeOfViewModelBindings();
		
		if (this.createdViewModel instanceof busybody.disposable)
        	this.createdViewModel.dispose();
		else
			busybody.dispose(this.createdViewModel);
			
        delete this.createdViewModel;
    };
    
    return viewModelElement;    
});

Class("wipeout.utils.domData", function () {
    var domDataKey = "__wipeout_domData";
    
    function domData() {
        ///<summary>Append data to dom elemenents</summary>
    }
    
    domData.exists = function(element, key) {
        ///<summary>Determine if the element has a value for a given key</summary>
        ///<param name="element" type="HTMLNode" optional="false">The element to get a store from</param>
        ///<param name="key" type="String" optional="true">The data key</param>
        ///<returns type="Boolean"></returns>
        
        return element[domDataKey] && element[domDataKey].hasOwnProperty(key)
    };
    
    domData.get = function(element, key) {
        ///<summary>Get data from an element</summary>
        ///<param name="element" type="HTMLNode" optional="false">The element to get a store from</param>
        ///<param name="key" type="String" optional="true">The data to get</param>
        ///<returns type="Object">The value of this key</returns>
        
		if (arguments.length < 2)
			return element[domDataKey];
		
		return domData.exists(element, key) ? element[domDataKey][key] : undefined;
    };
    
    domData.set = function(element, key, value) {
        ///<summary>Set data on an element</summary>
        ///<param name="element" type="HTMLNode" optional="false">The element to get a store from</param>
        ///<param name="key" type="String" optional="false">The key of data to set</param>
        ///<param name="value" type="Any" optional="false">The data to set</param>
        ///<returns type="Any">The value</returns>
        
        return (element[domDataKey] || (element[domDataKey] = {}))[key] = value;
    };
    
    domData.clear = function(element, key) {
        ///<summary>Clear an elements data</summary>
        ///<param name="element" type="HTMLNode" optional="false">The element to get a store from</param>
        ///<param name="key" type="String" optional="true">The key of data to clear</param>
        
		if (key && element[domDataKey])
			for (var i in element[domDataKey])
				if (i !== key) {
            		delete element[domDataKey][key];
					return;
				}
		
		delete element[domDataKey];
    };
    
    return domData;
});

Class("wipeout.utils.find", function () {
    	
    var find = orienteer.extend(function find(renderContext) {
        ///<summary>Find an ancestor from the binding context</summary>
        ///<param name="renderContext" type="ko.renderContext" optional="false">The ancestor chain</param>
        this._super();

        ///<Summary type="ko.renderContext">the binding context to use when finding objects</Summary>
        this.renderContext = renderContext;
    });
    
    find.prototype.find = function(searchTermOrFilters, filters) {
        ///<summary>Find an ancestor item based on the search term and filters</summary>
        ///<param name="searchTermOrFilters" type="Any" optional="false">If an object, will be used as extra filters. If a function, will be used as an $instanceof filter. If a String will be used as an $ancestory filter</param>
        ///<param name="filters" type="Object" optional="false">Items to filter the output by</param>
        ///<returns type="Any">The search result</returns>
		
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
        if(searchTermOrFilters && searchTermOrFilters.constructor === Function) {
            filters.$instanceOf = searchTermOrFilters;
        // shortcut for having filters as search term
        } else if(searchTermOrFilters && searchTermOrFilters.constructor !== String) {
            for(var i in searchTermOrFilters)
                filters[i] = searchTermOrFilters[i];
        } else {
            filters.$ancestry = wipeout.utils.obj.trim(searchTermOrFilters);
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
        ///<summary>Find an ancestor item based on the filters and whether view models or models are to be returned</summary>
        ///<param name="filters" type="Object" optional="false">Items to filter the output by</param>
        ///<param name="getModel" type="Boolean" optional="true">Specify that models are to be searched</param>
        ///<returns type="Any">The search result</returns>
		
        if(!this.renderContext ||!this.renderContext.$parentContext)
            return null;
        
        var getItem = getModel ? 
            function(item) {
                return item && item.$this instanceof wo.view ? item.$this.model : null;
            } : 
            function(item) { 
                return item ? item.$this : null;
            };

        var currentItem, currentContext = this.renderContext;
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
    
    find.create = function(renderContext) {
        ///<summary>Get a function wich points directly to (new wo.find(..)).find(...)</summary>
        ///<param name="renderContext" type="ko.renderContext" optional="false">The find functionality</param>
        ///<returns type="Function">The find function</returns>
        
        var f = new wipeout.utils.find(renderContext);

        return function(searchTerm, filters) {
            return f.find(searchTerm, filters);
        };
    };
    
    // regular expressions used by the find class
    find.regex = {
        ancestors: /^(great)*(grand){0,1}parent$/,
        great: /great/g,
        grand: /grand/g
    };
    
    find.$type = function(currentItem, searchTerm, index) {
        ///<summary>Find an item based on exact type matching</summary>
        ///<param name="currentItem" type="Any" optional="false">The item to decide whether it is a match or not</param>
        ///<param name="searchTerm" type="Function" optional="false">The value of $type in the search filter</param>
        ///<param name="index" type="Number" optional="false">The current search index. This is incremented by 1 each time the ancestoral tree is traversed</param>
        ///<returns type="Boolean">Whether the current item is a match or not</returns>
        
        return currentItem && currentItem.constructor === searchTerm;
    };
    
    find.$ancestry = function(currentItem, searchTerm, index) {
        ///<summary>Find an item based on its ancestory. (Parent, grandparent, etc...)</summary>
        ///<param name="currentItem" type="Any" optional="false">The item to decide whether it is a match or not</param>
        ///<param name="searchTerm" type="String" optional="false">The value of $ancestry in the search filter</param>
        ///<param name="index" type="Number" optional="false">The current search index. This is incremented by 1 each time the ancestoral tree is traversed</param>
        ///<returns type="Boolean">Whether the current item is a match or not</returns>
                
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
        ///<summary>Find an item based on instanceof type matching</summary>
        ///<param name="currentItem" type="Any" optional="false">The item to decide whether it is a match or not</param>
        ///<param name="searchTerm" type="Function" optional="false">The value of $instanceof in the search filter</param>
        ///<param name="index" type="Number" optional="false">The current search index. This is incremented by 1 each time the ancestoral tree is traversed</param>
        ///<returns type="Boolean">Whether the current item is a match or not</returns>
        
        if(!currentItem || !searchTerm || searchTerm.constructor !== Function)
            return false;

        return currentItem instanceof searchTerm;
    };
    
    find.is = function(item, filters, index) {
        ///<summary>Find an item based on the given filters</summary>
        ///<param name="item" type="Any" optional="false">The item to decide whether it is a match or not</param>
        ///<param name="filters" type="Object" optional="false">The filters</param>
        ///<param name="index" type="Number" optional="false">The current search index. This is incremented by 1 each time the ancestoral tree is traversed</param>
        ///<returns type="Boolean">Whether the current item is a match or not</returns>
        
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


Class("wipeout.utils.html", function () { 
    
    var getViewModel = function(forHtmlNode) {
        ///<summary>Get the view model associated with a html node</summary>
        ///<param name="forHtmlNode" type="HTMLNode">The element which is the root node of a wo.view</param>
        ///<returns type="wo.view">The view model associated with this node, or null</returns>
        
		if (!forHtmlNode)
			return null;
				
        if (forHtmlNode.wipeoutOpening)
			return forHtmlNode.wipeoutOpening.viewModel;
		
		if (forHtmlNode.wipeoutClosing)
			return forHtmlNode.wipeoutClosing.viewModel;
		
		return getViewModel(wipeout.template.rendering.renderedContent.getParentElement(forHtmlNode));
    };
    
    var createTemplatePlaceholder = function(forViewModel) {
        ///<summary>Create a html node so serve as a temporary template while the template loads asynchronously</summary>
        ///<param name="forViewModel" type="wo.view">The view to which this temp template will be applied. May be null</param>
        ///<returns type="HTMLElement">A new html element to use as a placeholder template</returns>
        
        var el = document.createElement("span");
        el.innerHTML = "Loading template";
        return el;
    };
    
    function html() {
    };
    
    html.createTemplatePlaceholder = createTemplatePlaceholder;
    html.getViewModel = getViewModel
    
    return html;    
});

Class("wipeout.utils.jsParse", function () {
    
	function quoteIsEscaped (input, tokenIndex, isOpeningTag) {
		if (isOpeningTag)
			return false;
		
		var number = 0;
		while (input[tokenIndex - 1 - number] === "\\")
			number++;

		return number % 2 != 0;
	}
	
	var stringsAndComments = [{
		open: /'/gm,
		close: /'/gm,
		tokenize: true,
		isEscaped: quoteIsEscaped
	}, {
		open: /"/gm,
		close: /"/gm,
		tokenize: true,
		isEscaped: quoteIsEscaped
	}, {
		open: /\/\//gm,
		close: /(?=\r?\n)/gm,
		tokenize: false
	}, {
		open: /\/\*/gm,
		close: /\*\//gm,
		tokenize: false
	}];
	
	var brackets = [{
		open: /\{/gm,
		close: /\}/gm,
		tokenize: true,
		nested: true
	}, {
		open: /\(/gm,
		close: /\)/gm,
		tokenize: true,
		nested: true
	}, {
		open: /\[/gm,
		close: /\]/gm,
		tokenize: true,
		nested: true
	}];
	
	brackets.getFirst = stringsAndComments.getFirst = function (input, beginAt) {
		var tmp, beginning, token;
		for (var i = 0, ii = this.length; i < ii; i++) {
		
			this[i].open.lastIndex = beginAt;
			tmp = this[i].open.exec(input);
			if (tmp && (!beginning || tmp.index < beginning.index)) {
				beginning = tmp;
				token = this[i];
			}
		}
		
		if (!beginning)
			return;
		
		var index = 1, fOpen, fClose;
		do {
			token.close.lastIndex = token.open.lastIndex;
			while (token.nested && (fOpen = token.open.exec(input)) && token.isEscaped && token.isEscaped(input, fOpen.index, true)) ;
			while ((fClose = token.close.exec(input)) && token.isEscaped && token.isEscaped(input, fClose.index, false)) ;

			if (!fClose)
				throw "Invalid function string: " + input;	//TODE

			if (fOpen && fOpen.index < fClose.index)
				index++;
			else {
				token.open.lastIndex = token.close.lastIndex;
				index--;
			}
		} while (token.nested && index > 0);
		
		return {
			token: token,
			begin: beginning.index,
			end: token.close.lastIndex
		};
	};
	
	var uniqueToken = (function () {
		var i = 0;
		
		return function () {
			return "##token" + (++i) + "##"
		};
	}());
	
	function removeAndToken (input, tokens) {
		
		if (input instanceof Function)
			input = input.toString();
		
		var found = [{end: 0}], i = 0, token;
		while (token = tokens.getFirst(input, i)) {
			i = token.token.close.lastIndex;
			found.push(token);
		}
		
		found.push({end: input.length});
		
		var op = [], output = new splitter(), token;
		for (var i = 1, ii = found.length; i < ii; i++) {
			op.push(input.substring(found[i - 1].end, found[i].begin));
			
			if (found[i].token && found[i].token.tokenize) {
				output[token = uniqueToken()] = input.substring(found[i].begin, found[i].end);
				op.push(token);
			}
		}
		
		output.output = op.join("");
		return output;
	}
	
	var removeCommentsTokenStrings = function(input) {
        ///<summary>Takes a function string and removes comments and strings</summary>
        ///<param name="input" type="String|Function">The function</param>
        ///<returns type="Object">The output</returns>
		
		return removeAndToken(input, stringsAndComments);
    };
	
	var removeCommentsTokenStringsAndBrackets = function(input) {
        ///<summary>Takes a function string and removes comments, strings and anything within brackets</summary>
        ///<param name="input" type="String|Function">The function</param>
        ///<returns type="Object">The output</returns>
		
		var op1 = removeCommentsTokenStrings(input);
		var op2 = removeAndToken(op1.output, brackets);
		for (var i in op2)
			if (op2.hasOwnProperty(i) && i !== "output")
				op2[i] = op1.addTokens(op2[i]);
		
		for (var i in op1)
			if (i !== "output")
				op2[i] = op1[i];
		
		return op2;
    };
	
	var splitter = function () {}
	splitter.prototype.addTokens = function (toString) {
		for (var i in this)
			if (this.hasOwnProperty(i) && i !== "output")
				toString = toString.replace(i, this[i]);
		
		return toString;
	};
    
    function jsParse() { };
    jsParse.removeCommentsTokenStrings = removeCommentsTokenStrings;
    jsParse.removeCommentsTokenStringsAndBrackets = removeCommentsTokenStringsAndBrackets;
    return jsParse;
});

Class("wipeout.utils.viewModels", function () { 
	
	function viewModels () {}

	//TODM
	var realName = "wo-el";
	viewModels.getElementName = function (wmlElement) {
        ///<summary>Get the actual name of an element. The actual name is either the "wo-el" attribute or the element name</summary>
        ///<param name="wmlElement" type="wipeout.wml.wmlElement">The key</param>
        ///<returns type="String">The name</returns>

		var tmp;
		if (wmlElement.getAttribute && (tmp = wmlElement.getAttribute(realName)) != null)
			return tmp;
		
		var name = camelCase(trimToLower(wmlElement instanceof Element ? wmlElement.localName : wmlElement.name));
		
		//TODM
		return /^js[A-Z]/.test(name) ? name.substr(2) : name;
	};
	
	viewModels.getViewModelConstructor = function (wmlElement) {
        ///<summary>A constructor for a view model (if any) given a specific element</summary>
        ///<param name="wmlElement" type="wipeout.wml.wmlElement">The element</param>
        ///<returns type="Boolean">Success</returns>

		var constr, name = viewModels.getElementName(wmlElement);

		if (constr = wipeout.utils.obj.getObject(name))
			return {
				name: name,
				constructor: constr
			};
	};
	
	return viewModels;
});


function viewModel (name, extend) {
		
	extend = extend || wipeout.viewModels.view;
	
	var $constructor,
		values = {},
		tmp, args = (tmp = extend
		.toString()
		.replace(/\/\/.*$/mg, "")
		.replace(/\/\*[\s\S]*?\*\//mg, ""))
		.slice(tmp.indexOf('(') + 1, tmp.indexOf(')')).match(/([^\s,]+)/g) || [];
	
	var templateId, tid, model, mod;	// will be populated later
	function getParentConstructorArgs() {
		var output = [];
		if (templateId !== -1)
			output[templateId] = tid instanceof Function ? 
				tid.apply(this, arguments) :
				(tid !== undefined ? tid : arguments[0]);	// arguments[0] === templateId

		if (model !== -1)
			output[model] = mod instanceof Function ? 
				mod.apply(this, arguments) :
				(mod !== undefined ? mod : arguments[1]);	// arguments[1] === model

		return output;
	};
	
	function buildComputeds() {
		var output = [];
		for (var i in computeds) {
			var name = '"' + i.replace('"', '\\"') + '"';
			output.push("\n	this.initComputed(" + name + ", computeds[" + name + "].logic, computeds[" + name + "].options);");
		}
		
		return output.join("");
	}

	var methods = {statics: true},	//statics is reserved
		valuesAsConstructorArgs = {},
		statics = {},
		bindingTypes = {},
		parsers = {},
		computeds = {},
		inheritanceTree;

	function check () {
		if ($constructor) throw 'You cannot add any more functionality using this DSL as this view model has already been built. You can still add methods to the view model by adding them directly to the build output, e.g.\nvar myClass = wo.viewModel("myClass").build();\nmyClass.doSomething = function () { ... };';
	}

	var output = {

		build: function () {

			if ($constructor)
				return $constructor.prototype;

			if (wipeout.utils.obj.getObject(name))
				throw name + " already exists.";

			templateId = args.indexOf("templateId");
			if (templateId !== -1) {
				tid = values.templateId;
				delete values[templateId];
			}

			model = args.indexOf("model");
			if (templateId !== -1) {
				mod = values.model;
				delete values[model];
			}

			var split = name.split(".");
			$constructor = new Function("extend", "getParentConstructorArgs", "values", "computeds",
"return function " + split[split.length - 1] + " (templateId, model) {\n" +
"	extend.apply(this, getParentConstructorArgs.apply(this, arguments));\n" +
"\n" +
"	for (var i in values)\n" +
"		this[i] = values[i] instanceof Function ?\n" +
"			values[i].apply(this, arguments) :\n" +
"			values[i];\n" +
										buildComputeds() +
"}")(extend, getParentConstructorArgs, values, computeds);

			Class(name, function () {
				return orienteer.extend.call(extend, $constructor);
			});

			methods.statics = $constructor;
			for (var i in methods)
				$constructor.prototype[i] = methods[i];
			for (var i in statics)
				$constructor[i] = statics[i];

			for (var i in parsers)
				$constructor.addGlobalParser(i, parsers[i]);
			for (var i in bindingTypes)
				$constructor.addGlobalBindingType(i, bindingTypes[i]);

			methods = undefined;
			statics = undefined;
			bindingTypes = undefined;
			inheritanceTree = undefined;

			return output.build();
		},

		method: function (name, method) {
			check();

			if (!(method instanceof Function))
				return output.value(name, method);

			if (methods[name])
				throw "You have already added a function: " + name;

			methods[name] = method;				
			return output;
		},
		
		computed: function (name, logic, options) {

			check();
			
			if (values[name])
				throw "You have already added a value: " + name;

			if (computeds[name])
				throw "You have already added a value: " + name;
			
			computeds[name] = {logic: logic, options: options};
			return output;
		},

		value: function (name, value) {
			check();

			if (name === "constructor")
				return output.constructor(value);

			if (value instanceof Function)
				return output.method(name, value);

			if (values[name])
				throw "You have already added a value: " + name;

			if (computeds[name])
				throw "You have already added a computed: " + name;

			values[name] = value;				
			return output;
		},
		dynamicValue: function (name, value) {
			check();

			if (name === "constructor")
				return output.constructor(value);

			if (!(value instanceof Function))
				throw "A dynamic value must be a function which returns the value.";

			if (values[name])
				throw "You have already added a value: " + name;

			if (computeds[name])
				throw "You have already added a computed: " + name;

			values[name] = value;				
			return output;
		},

		staticMethod: function (name, method) {
			return output.staticValue(name, method);
		},
		staticValue: function (name, value) {
			check();

			if (statics[name])
				throw "You have already added a static value: " + name;

			statics[name] = value;
			return output;
		},

		parser: function (propertyName, parser) {
			check();

			if (parsers[propertyName])
				throw "A parser has already been set for this object";

			inheritanceTree = inheritanceTree || orienteer.getInheritanceChain.apply(extend);
			if (inheritanceTree.indexOf(wipeout.base.bindable) === -1)
				throw "You must inherit from wipeout.base.bindable to use global parsers. Alternatively you can inherit from any view model, such as wo.view, wo.contentCOntrol, wo.itemsControl etc...";

			parsers[propertyName] = parser;
			return output;
		},
		binding: function (propertyName, bindingType) {
			check();

			if (bindingTypes[propertyName])
				throw "A binding type has already been set for this object";

			inheritanceTree = inheritanceTree || orienteer.getInheritanceChain(extend);
			if (inheritanceTree.indexOf(wipeout.base.bindable) === -1)
				throw "You must inherit from wipeout.base.bindable to use global parsers. Alternatively you can inherit from any view model, such as wo.view, wo.contentCOntrol, wo.itemsControl etc...";

			bindingTypes[propertyName] = bindingType;
			return output;
		},

		// convenience functions
		templateId: function (templateId, eagerLoad) {
			if (eagerLoad)
				wipeout.template.engine.instance.compileTemplate(templateId, function () {});
			
			return output.value("templateId", templateId);
		},
		onInitialized: function (onInitialized) {
			return output.method("onInitialized", onInitialized);
		},
		onModelChanged: function (onModelChanged) {
			return output.method("onModelChanged", onModelChanged);
		},
		onRendered: function (onRendered) {
			return output.method("onRendered", onRendered);
		},
		onUnrendered: function (onUnrendered) {
			return output.method("onUnrendered", onUnrendered);
		},
		dispose: function (dispose) {
			return output.method("dispose", dispose);
		},
		onApplicationInitialized: function (onApplicationInitialized) {
			return output.method("onApplicationInitialized", onApplicationInitialized);
		}
	};

	return output;
};


Class("wipeout.viewModels.contentControl", function () {    

    var contentControl = wipeout.viewModels.view.extend(function contentControl(templateId, model) {
        ///<summary>Expands on view and view functionality to allow the setting of anonymous templates</summary>
        ///<param name="templateId" type="string" optional="true">The template id. If not set, defaults to a blank template</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        this._super(templateId, model);

        ///<Summary type="String">The template which corresponds to the templateId for this item</Summary>
        //this.setTemplate = "";
        
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "templateId", "setTemplate");
    });  
    
    contentControl.addGlobalParser("setTemplate", "template");
    contentControl.addGlobalBindingType("setTemplate", "setTemplateToTemplateId");
    
    contentControl.createTemplatePropertyFor = function(owner, templateIdProperty, templateProperty) {
        ///<summary>Binds the template property to the templateId property so that a changee in one reflects a change in the other</summary>
        ///<param name="owner" type="wipeout.base.observable" optional="false">The owner of the template and template id properties</param>
        ///<param name="templateIdProperty" type="String" optional="false">The name of the templateId property</param>
        ///<param name="templateProperty" type="String" optional="false">The name of the template property.</param>
                
        return new boundTemplate(owner, templateIdProperty, templateProperty);
    };
    
    contentControl.createAnonymousTemplate = (function () {
        
        var i = Math.floor(Math.random() * 1000000000), 
            anonymousTemplateId = "WipeoutAnonymousTemplate",
            templateStringCache = {};
        
        function newTemplateId () {
            return anonymousTemplateId + "-" + (++i);
        }
                
        return function (templateStringOrXml) {
            ///<summary>Creates an anonymous template within the DOM and returns its id</summary>
            ///<param name="templateStringOrXml" type="String" optional="false">Gets a template id for an anonymous template</param>
            ///<returns type="String">The template id</returns>

            if (typeof templateStringOrXml === "string") {
				// look in cached template strings and create template if necessary
                if (!templateStringCache[templateStringOrXml]) {
                    var id = newTemplateId();
                    wipeout.template.engine.instance.setTemplate(id, templateStringOrXml);
                    templateStringCache[templateStringOrXml] = id;
                }

                return templateStringCache[templateStringOrXml];
            } else {
				// look for cached id within xml or create one
                if (!templateStringOrXml[anonymousTemplateId]) {
                    var id = newTemplateId();
                    wipeout.template.engine.instance.setTemplate(id, templateStringOrXml);
                    templateStringOrXml[anonymousTemplateId] = id;
                }

                return templateStringOrXml[anonymousTemplateId];
            }
        };
    })();
    
    function boundTemplate (owner, templateIdProperty, templateProperty) {
        ///<summary>Binds the template property to the templateId property so that a changee in one reflects a change in the other</summary>
        ///<param name="owner" type="wipeout.base.observable" optional="false">The owner of the template and template id properties</param>
        ///<param name="templateIdProperty" type="String" optional="false">The name of the templateId property</param>
        ///<param name="templateProperty" type="String" optional="false">The name of the template property.</param>
        
        this.currentTemplate = owner[templateProperty];
        this.currentTemplateId = owner[templateIdProperty];
        
        this.owner = owner;
        this.templateIdProperty = templateIdProperty;
        this.templateProperty = templateProperty;
        
        // bind template to template id for the first time
        this.refreshTemplate(this.currentTemplateId);
        
        this.d1 = owner.observe(templateIdProperty, this.onTemplateIdChange, this);        
        this.d2 = owner.observe(templateProperty, this.onTemplateChange, this);
    };
        
    boundTemplate.prototype.dispose = function() {
        ///<summary>Dispose of this binding</summary>
		
        this.d1.dispose();
        this.d2.dispose();
    };
    
    boundTemplate.prototype.refreshTemplate = function(templateId) {
		
        this.pendingLoad = wipeout.template.engine.instance.getTemplateXml(templateId, (function (template) {
            delete this.pendingLoad;                
            this.currentTemplate = this.owner[this.templateProperty] = template;
        }).bind(this)); 
    };

    boundTemplate.prototype.onTemplateIdChange = function(oldVal, newVal) {
        if (newVal === this.currentTemplateId) {
            this.currentTemplateId = null;
            return;
        }

        this.currentTemplateId = null;

        if (this.pendingLoad)
            this.pendingLoad.cancel();

        this.refreshTemplate(newVal);
    };

    boundTemplate.prototype.onTemplateChange = function(oldVal, newVal) {
        if (newVal === this.currentTemplate) {
            this.currentTemplate = null;
            return;
        }

        this.currentTemplate = null;
        this.currentTemplateId = this.owner[this.templateIdProperty] = wipeout.viewModels.contentControl.createAnonymousTemplate(newVal);
    }
    
    return contentControl;
});


Class("wipeout.viewModels.if", function () {
 
    var sc = true;
    var staticConstructor = function () {
        if (!sc) return;
        sc = false;
        
        _if.blankTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate("", true);
    };
    
    var _if = wipeout.viewModels.view.extend(function _if(trueTemplateId, model) {
        ///<summary>The if class is a content control which provides the functionality of the knockout if binding</summary> 
        ///<param name="trueTemplateId" type="String" optional="true">The template id if condition is true. If not set, defaults to a blank template</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        
        staticConstructor();
        
        this._super(_if.blankTemplateId, model);

        ///<Summary type="Boolean">Specifies whether this object should be used as a binding context. If true, the binding context of this object will be it's parent. Default is true</Summary>
        this.shareParentScope = true;
        
        ///<Summary type="Boolean">if true, the template will be rendered, otherwise a blank template is rendered</Summary>
        this.condition = false;
		
        ///<Summary type="String">the template to render if the condition is true. Defaults to a blank template</Summary>
		this.trueTemplateId = trueTemplateId || _if.blankTemplateId;
        
        ///<Summary type="String">the template to render if the condition is false. Defaults to a blank template</Summary>
        this.falseTemplateId = _if.blankTemplateId;
        
        this.observe("trueTemplateId", this.reEvaluate, this);
        this.observe("falseTemplateId", this.reEvaluate, this);
        this.observe("condition", this.reEvaluate, this);
        
        ///<Summary type="String">Anonymous version of trueTemplateId</Summary>
        this.trueTemplate = "";
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "trueTemplateId", "trueTemplate");
        
        ///<Summary type="String">Anonymous version of falseTemplateId</Summary>
        this.falseTemplate = "";
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "falseTemplateId", "falseTemplate");
    });
	
    _if.addGlobalParser("falseTemplate", "template");
    _if.addGlobalBindingType("falseTemplate", "ifTemplateProperty");
    _if.addGlobalParser("trueTemplate", "template");
    _if.addGlobalBindingType("trueTemplate", "ifTemplateProperty");
    
    _if.prototype.reEvaluate = function () {
        ///<summary>Set the template id based on the true template, false template and template id</summary>
		
        if (this.condition)
			this.synchronusTemplateChange(this.trueTemplateId);
		else
			this.synchronusTemplateChange(this.falseTemplateId);
    };
    
    return _if;
});

 
Class("wipeout.viewModels.itemsControl", function () {
    
	var deafaultTemplateId;
	var defaultItemTemplateId;
    var itemsControl = wipeout.viewModels.contentControl.extend(function itemsControl(templateId, itemTemplateId, model) {
        ///<summary>Bind a list of models (items) to a list of view models (items) and render accordingly</summary>
        ///<param name="templateId" type="String" optional="true">The template id. If not set, defaults to a div to render items</param>
        ///<param name="itemTemplateId" type="String" optional="true">The initial template id for each item</param>
        ///<param name="model" type="Any" optional="true">The initial model to use</param>
        
        this._super(templateId || 
					deafaultTemplateId ||
					(deafaultTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate('{{$this.items}}')), model);

        ///<Summary type="ko.observable" generic0="String">The id of the template to render for each item</Summary>
        this.itemTemplateId = itemTemplateId;

        ///<Summary type="ko.observable" generic0="String">The template which corresponds to the itemTemplateId for this object</Summary>
        this.itemTemplate = "";
        
        wipeout.viewModels.contentControl.createTemplatePropertyFor(this, "itemTemplateId", "itemTemplate");
        
        ///<Summary type="busybody.array">An array of models to render</Summary>
        this.items = new busybody.array();
        this.registerDisposable(this.items);
        
        this.registerRoutedEvent(itemsControl.removeItem, this._removeItem, this);
        
        this.observe("itemTemplateId", function (oldVal, newVal) {
			enumerateArr(this.getItemViewModels(), function (vm) {
				if (vm.__createdByItemsControl)
					vm.templateId = newVal;
			});
        }, this);
    });
    
    itemsControl.addGlobalParser("itemTemplate", "template");
    itemsControl.addGlobalBindingType("itemTemplate", "templateProperty");
        
    itemsControl.removeItem = wipeout.events.routedEvent();
	
    itemsControl.prototype._removeItem = function(e) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="e" type="wo.routedEventArgs" optional="false">The item to remove</param>
    
        if(this.items.indexOf(e.data) !== -1) {
            this.removeItem(e.data);
            e.handled = true;
        }
    };
    
    itemsControl.prototype.getItemViewModels = function() {
        ///<summary>Get the child view models if any</summary>
        ///<returns type="Array">The items</returns>
    
        return this.$getChild ?
            this.$getChild() :
			[];
	};
    
    itemsControl.prototype.getItemViewModel = function(index) {
        ///<summary>Get the child view model at a given index</summary>
        ///<param name="index" type="Number" optional="false">The index of the view model to get</param>
        ///<returns type="Any">The view model</returns>
    
        return this.$getChild ?
            this.$getChild(index) :
            undefined;
    };
    
    itemsControl.prototype.removeItem = function(item) {
        ///<summary>Remove an item from the item source</summary>
        ///<param name="item" type="Any" optional="false">The item to remove</param>
    
        this.items.remove(item);
    };
    
    //virtual, TODV
    itemsControl.prototype.onItemRendered = function (item) {
        ///<summary>Called after a new item items control is rendered</summary>
        ///<param name="item" type="wo.view" optional="false">The item rendered</param>
    };
    
    //virtual, TODV
    itemsControl.prototype.onItemRemoved = function (item) {
        ///<summary>Disposes of deleted items</summary> 
        ///<param name="item" type="Any" optional="false">The item deleted</param>  
        
        item.dispose();
    };

    itemsControl.prototype._createItem = function (model) {
        ///<summary>Defines how a view model should be created given a model. The default is to create a view and give it the itemTemplateId</summary>
        ///<param name="model" type="Any" optional="false">The model for the view to create</param>
        ///<returns type="wo.view">The newly created item</returns>
        
        var item = this.createItem(model);
        return item;
    };

    // virtual
    itemsControl.prototype.createItem = function (model) {
        ///<summary>Defines how a view model should be created given a model. The default is to create a view and give it the itemTemplateId</summary>
        ///<param name="model" type="Any" optional="false">The model for the view to create</param>
        ///<returns type="wo.view">The newly created item</returns>
		
        var vm = new wipeout.viewModels.view(this.itemTemplateId || defaultItemTemplateId || (defaultItemTemplateId = wipeout.viewModels.contentControl.createAnonymousTemplate("{{$this.model}}")), model);
		vm.__createdByItemsControl = true;
		return vm;
    };

    return itemsControl;
});


(function () {
 
	var view = wipeout.viewModels.view;
    
    view.prototype.unRegisterRoutedEvent = function(routedEvent, callback, callbackContext /* optional */) {  
        ///<summary>Unregister from a routed event. The callback and callback context must be the same as those passed in during registration</summary>  
        ///<param name="callback" type="Function" optional="false">The callback to un-register</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event to un register from</param>
        ///<param name="callbackContext" type="Any" optional="true">The original context passed into the register function</param>
        ///<returns type="Boolean">Whether the event registration was found or not</returns>         

        for(var i = 0, ii = this.$routedEventSubscriptions.length; i < ii; i++) {
            if(this.$routedEventSubscriptions[i].routedEvent === routedEvent) {
                this.$routedEventSubscriptions[i].event.unRegister(callback, callbackContext);
                return true;
            }
        }  

        return false;
    };
    
    view.prototype.registerRoutedEvent = function(routedEvent, callback, callbackContext, priority) {
        ///<summary>Register for a routed event</summary>   
        ///<param name="callback" type="Function" optional="false">The callback to fire when the event is raised</param>
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="callbackContext" type="Any" optional="true">The context "this" to use within the callback</param>
        ///<param name="priority" type="Number" optional="true">The event priorty. Event priority does not affect event bubbling order</param>
        ///<returns type="wo.eventRegistration">A dispose function</returns>         

        var rev;
        for(var i = 0, ii = this.$routedEventSubscriptions.length; i < ii; i++) {
            if(this.$routedEventSubscriptions[i].routedEvent === routedEvent) {
                rev = this.$routedEventSubscriptions[i];
                break;
            }
        }

        if(!rev) {
            rev = new wipeout.events.routedEventRegistration(routedEvent);
            this.$routedEventSubscriptions.push(rev);
        }

        return rev.event.register(callback, callbackContext, priority);
    };
    
    view.prototype.triggerRoutedEvent = function(routedEvent, eventArgs) {
        ///<summary>Trigger a routed event. The event will bubble upwards to all ancestors of this view. Overrides wo.object.triggerRoutedEvent</summary>        
        ///<param name="routedEvent" type="wo.routedEvent" optional="false">The routed event</param>
        ///<param name="eventArgs" type="Any" optional="true">The event args to bubble up with the routed event</param>
        
        // create routed event args if neccessary
        if(!(eventArgs instanceof wipeout.events.routedEventArgs)) {
            eventArgs = new wipeout.events.routedEventArgs(eventArgs, this);
        }

        // trigger event on this
        for(var i = 0, ii = this.$routedEventSubscriptions.length; i < ii; i++) {
            if(eventArgs.handled) return;
            if(this.$routedEventSubscriptions[i].routedEvent === routedEvent) {
                this.$routedEventSubscriptions[i].event.trigger(eventArgs);
            }
        }
        
        // trigger event on model
        if(eventArgs.handled) return;
        if(this.model instanceof wipeout.events.routedEventModel) {
            this.model.routedEventTriggered(routedEvent, eventArgs);
        }

        // trigger event on parent
        if(eventArgs.handled) return;
        var nextTarget = this.getParent();
        if(nextTarget) {
            nextTarget.triggerRoutedEvent(routedEvent, eventArgs);
        }
    };
}());

var getParentElement = function() {
	///<summary>Get the parent element of this node</summary>
	///<returns type="wipeout.wml.wmlElement">The element</returns>
	
    if (this._parentElement) {
		for (var i in this._parentElement)
			if (this._parentElement[i] === this)
				return this._parentElement;
		
        delete this._parentElement;
    }
    
    return null;
};

Class("wipeout.wml.wmlElementBase", function () {
    
    var wmlElementBase = orienteer.extend(function wmlElementBase() {
        ///<summary>A wml element base</summary>
		
        this._super();
		
        ///<summary type="Number">The number of child nodes</summary>
		this.length = 0;
    });
    
    wmlElementBase.extend = orienteer.extend;
    wmlElementBase.prototype._super = orienteer.prototype._super;
    
    wmlElementBase.prototype.push = function(obj) {
        ///<summary>Add an element child</summary>
        ///<param name="obj" type="wipeout.xml.xmlElement">The element</param>
        ///<returns type="Number">The new length</returns>
		
        if(obj.getParentElement !== getParentElement)
            throw "Invalid template node";
        if(obj.getParentElement())
            throw "This node already has a parent element";
        
		this[this.length] = obj;
		this.length++;
        obj._parentElement = this;
        return this.length;
    };
    
    wmlElementBase.prototype.splice = function() {
        ///<summary>Not implemented</summary>	TODO
		
        throw "not implemented";
		
        for(var i = 2, ii = arguments.length; i < ii; i++) {
            if(!arguments[i].getParentElement)
                throw "Invalid template node";
            if(arguments[i].getParentElement())
                throw "This node already has a parent element";
        }
        
        var output = this._super.apply(this, arguments);
        
        for(var i = 2, ii = arguments.length; i < ii; i++) {
            arguments[i]._parentElement = this;
        }
        
        return output;
    };
    
    wmlElementBase.prototype.serializeContent = function() {
        ///<summary>Serialize all of the child elements of this element</summary>
        ///<returns type="String">The value</returns>
        
        var output = [];        
        wipeout.utils.obj.enumerateArr(this, function(i) {
            output.push(i.serialize());
        });
        
        return output.join("");
    }
    
    return wmlElementBase;
});

Class("wipeout.wml.wmlElement", function () {
    
    var wmlElement = wipeout.wml.wmlElementBase.extend(function wmlElement(name, inline) {
        ///<summary>A wml element</summary>
        ///<param name="name" type="String">The element name</param>
        ///<param name="inlien" optional="true type="Boolean">Determines whether the element has a closing tag</param>
		
        this._super();
        
        ///<summary type="String">The element name</summary>
        this.name = name;
        
        ///<summary type="Object">A list of attributes</summary>
        this.attributes = {};
		
        ///<summary type="Boolean">Determines whether the element has a closing tag</summary>
        this.inline = !!inline;
		
        ///<summary type="Number">1</summary>
        this.nodeType = 1;
    });
    
    wmlElement.prototype.getParentElement = getParentElement;
    
	wmlElement.prototype.getAttribute = function (attributeName) {
        ///<summary>Get attribute value by name</summary>
        ///<param name="attributeName" type="String">The attribute</param>
        ///<returns type="String">The value</returns>
		
		return this.attributes[attributeName] ?
			this.attributes[attributeName].value :
			null;
	};
	
    wmlElement.prototype.serialize = function() {
        ///<summary>Serialize the element</summary>
        ///<returns type="String">Serialize the element</returns>
		
        var output = [];
        
        output.splice(0, 0, "<", this.name);
        var index = 2;
        for(var i in this.attributes) {
            output.splice(index, 0, " ", i, this.attributes[i].serializeValue());
            index+=3;
        }
        
        var children = this.serializeContent();
        if(!children.length && this.inline) {
            output.push(" />");            
        } else {
            output.push(">");
            output.push(children);
            output.push("</" + this.name + ">");
        }
        
        return output.join("");
    }
    
    return wmlElement;
});

Class("wipeout.wml.wmlAttribute", function () {
    
    function wmlAttribute(value) {
        ///<summary>An attribute</summary>
        ///<param name="value" type="String">The attribute value</param>
		
        ///<summary type="String">The value</summary>
        this.value = value;
		
        ///<summary type="Number">2</summary>
        this.nodeType = 2;
    };
    
    wmlAttribute.prototype.serializeValue = function() {
        ///<summary>Serialize the attribute from "=" onwards</summary>
        ///<returns type="String">The value</returns>
		
        return '="' + this.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
    };    
    
    wmlAttribute.prototype.serializeContent = function() {
        ///<summary>Serialize the value</summary>
        ///<returns type="String">The value</returns>
                
        return this.value;
    };
    
    return wmlAttribute;
});

Class("wipeout.wml.wmlComment", function () {
    
    var wmlComment = function wmlComment(commentText) {
        ///<summary>A comment</summary>
        ///<param name="commentText" type="String">The comment</param>
		
        ///<summary type="String">The comment</summary>
        this.commentText = commentText;
		
        ///<summary type="Number">8</summary>
        this.nodeType = 8;
    };
    
    wmlComment.prototype.serialize = function() {
        ///<summary>Serialize</summary>
        ///<returns type="String">The value</returns>
		
        return "<!--" + this.commentText + "-->";
    };
    
    wmlComment.prototype.getParentElement = getParentElement;
    
    return wmlComment;
});

Class("wipeout.wml.wmlString", function () {
    
    var wmlString = function wmlString(text) {
        ///<summary>A text node</summary>
        ///<param name="text" type="String">The value</param>
		
        ///<summary type="String">The text</summary>
        this.text = text;
		
        ///<summary type="Number">3</summary>
        this.nodeType = 3;
    };
    
    wmlString.prototype.serialize = function() {
        ///<summary>Serialize</summary>
        ///<returns type="String">The value</returns>
		
        return this.text;
    }
    
    wmlString.prototype.getParentElement = getParentElement;
    
    return wmlString;
});


//http://www.w3.org/TR/html-markup/syntax.html
Class("wipeout.wml.wmlParser", function () {  
        
    // tags which cannot go into a <div /> tag, along with the tag they should go into
    wmlParser.specialTags = {
        area: "map",
        base: "head",
        basefont: "head",
        body: "html",
        caption: "table",
        col: "colgroup",
        colgroup: "table",
        command : "menu",
        frame: "frameset",
        frameset: "html",
        head: "html",
        keygen: "form",
        li: "ul",
        optgroup: "select",
        option: "select",
        rp: "rt",
        rt: "ruby",
        source: "audio",
        tbody: "table",
        td: "tr",
        tfoot: "table",
        th: "tr",
        thead: "table",
        tr: "tbody"
    };
    
    // tags which, if the root, wipeout will refuse to create
    wmlParser.cannotCreateTags = {
        html:true,
        basefont: true,
        base: true,
        body: true,
        frame: true,
        frameset: true,
        head: true
    };
    
    // tags which are readonly once created in IE
    wmlParser.ieReadonlyElements = {
        audio: true,
        col: true, 
        colgroup: true,
        frameset: true,
        head: true,
        rp: true,
        rt: true,
        ruby: true,
        select: true,
        style: true,
        table: true,
        tbody: true,
        tfooy: true,
        thead: true,
        title: true,
        tr: true
    };
    
	// not needed right now
    // firefox replaces some tags with others
    //wmlParser.replaceTags = {
    //    keygen: "select"
    //};
	
    wmlParser.getFirstTagName = function(htmlContent) {
        ///<summary>Get the tag name of the first element in the string</summary>
        ///<param name="htmlContent" type="String">A string of html</param>
        ///<returns type="String">The name of the first tag</returns>
        
        var result = /^\s*<\s*[a-z\-\.0-9\$]+(\s|>|\/)/.exec(
			htmlContent.replace(/<\!--[^>]*-->/g, "").replace(/^\s*/, ""));
		
		return result ?
			trim(result[0].substr(1, result[0].length - 2)) :
			null;
    };
	
	// TODO: test
	var test = document.createElement("table");
	test.innerHTML = "<tbody></tbody>";
	var ie = !test.childNodes.length;
	
	wmlParser.addToElement = function(htmlString) {
        ///<summary>Add the html string to a html element and return it</summary>
        ///<param name="htmlString" type="String">A string of html</param>
        ///<returns type="HTMLElement">The element</returns>
				
		var childTag = wmlParser.getFirstTagName(htmlString);
		if (!childTag) {
			var parent = document.createElement("div");
			parent.innerHTML = htmlString
			return parent;
		}
        
        if(wmlParser.cannotCreateTags[childTag]) throw "Cannot create an instance of the \"" + childTag + "\" tag.";
        
        var parentTagName = wmlParser.specialTags[childTag] || "div";
        
        // the innerHTML for some tags is readonly in IE
        if (ie && wmlParser.ieReadonlyElements[parentTagName]) {
            var tmp = wmlParser.createElement("<" + parentTagName + ">" + htmlString + "</" + parentTagName + ">");
			for(var i = 0, ii = tmp.childNodes.length; i < ii; i++) {
				var child = tmp.childNodes[i];
				if (child.nodeType === 1 && trimToLower(child.tagName) === parentTagName) {
					return child;
				}
			}
			
			return document.createElement(parentTagName);
		}
            
        var parent = document.createElement(parentTagName);
        parent.innerHTML = htmlString;
		return parent;
	};
    
	var inline = ["area", "base", "br", "col", "command", "hr", "img", "input", "keygen", "link", "meta", "param", "source"];		
	function parse (htmlElement) {

		var name = htmlElement.getAttribute("wo-el") || htmlElement.localName;
		var tmp, output = new wipeout.wml.wmlElement(name, inline.indexOf(name) !== -1);
		for (var i = 0, ii = htmlElement.childNodes.length; i < ii; i++) {
			if (htmlElement.childNodes[i].nodeType === 1)
				output.push(parse(htmlElement.childNodes[i]));
			else if (htmlElement.childNodes[i].nodeType === 8)
				output.push(new wipeout.wml.wmlComment(htmlElement.childNodes[i].textContent));
			else if (htmlElement.childNodes[i].nodeType === 3)
				output.push(new wipeout.wml.wmlString(htmlElement.childNodes[i].textContent));
			else {
				// case should not arise
				tmp = document.createElement("div");
				tmp.appendChild(htmlElement.childNodes[i]);
				output.push(new wipeout.wml.wmlString(tmp.innerHTML));
			}
		}

		for (var i = 0, ii = htmlElement.attributes.length; i < ii; i++)
			if (htmlElement.attributes[i].name !== "wo-el")
				output.attributes[htmlElement.attributes[i].name] = new wipeout.wml.wmlAttribute(htmlElement.attributes[i].value);

		return output;
	};
	
    function wmlParser(wmlString) {
        ///<summary>Parse a string to wml</summary>
        ///<param name="wmlString" type="String|Element">The value to parse</param>
        ///<returns type="wipeout.wml.wmlElement">The element</returns>
		
		if (wmlString instanceof Element)
			return parse(wmlString);
		
		var tag = wmlParser.addToElement(wmlString);
		if (!tag)
			throw "Cannot create a template for the following string: " + wmlString;
		
		return parse(tag);
    }
    
    return wmlParser;
});


window.wo = function (model, htmlElement) {
    ///<summary>Create a new observable array</summary>
    ///<param name="model" type="Any" optional="true">The root model</param>
    ///<param name="htmlElement" type="HTMLElement or String" optional="true">The root html element. Can be an element or an id</param>

	var output = new busybody.disposable();
	
    if (arguments.length < 2)
        htmlElement = document.getElementsByTagName("body")[0];
    else if (typeof htmlElement === "string")
        htmlElement = document.getElementById(htmlElement);

	if (wipeout.utils.viewModels.getViewModelConstructor(htmlElement)) {
		var vme = new wipeout.template.rendering.viewModelElement(htmlElement);
		if (model != null)
			vme.createdViewModel.model = model;
		output.registerDisposable(vme);
	} else {
		enumerateArr(wipeout.utils.obj.copyArray(htmlElement.getElementsByTagName("*")), function (element) {

			// element may have been removed since get all elements
			if (htmlElement.contains(element) && wipeout.utils.viewModels.getViewModelConstructor(element)) {
				var vme = new wipeout.template.rendering.viewModelElement(element);
				if (model != null)
					vme.createdViewModel.model = model;
				output.registerDisposable(vme);
			}
		});
	}
	
	return output;
};

window.addEventListener("load", function () {
    window.wo();
});

//TODM: all exposed items
function expose (name, value) {
	if (!name || value == null) throw "Invalid input";
	if (wo[name]) throw name + " is already taken!";
	wo[name] = value;
}

expose("viewModel", viewModel);

expose("routedEvent", wipeout.events.routedEvent);
expose("array", busybody.array);
expose("observable", busybody.observable);

expose("bindings", wipeout.htmlBindingTypes);
expose("parsers", wipeout.template.initialization.parsers);
expose("filters", wipeout.template.filters);

expose("addHtmlAttribute", HtmlAttr);

enumerateObj(wipeout.viewModels, function(vm, name) {
	expose(name, vm);
});

}(window.orienteer, window.busybody));

}());