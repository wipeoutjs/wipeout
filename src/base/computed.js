// name is subject to change

Class("wipeout.base.computed", function () {
    
    var GET_ARGUMENT_NAMES = /([^\s,]+)/g;
    var STRIP_INLINE_COMMENTS = /\/\/.*$/mg;  
    var STRIP_BLOCK_COMMENTS = /\/\*[\s\S]*?\*\//mg;
    var GET_ITEMS = "((\\s*\\.\\s*([\\w\\$]*))|(\\[\\s*\\d\\s*\\]))+";
    
    var previousValPlaceholder = {};
    
    // monitor a function and change the value of a "watched" when it changes
    var computed = wipeout.base.watched.extend(function computed(callback, context, watchVariables, callbackStringOverride) {
                
        this._super();
        
        this.arguments = [];
        
        this.callback = computed.stripFunction(callbackStringOverride || callback);
        this.callbackFunction = callback;
        this.context = context;
        this.previousVal = previousValPlaceholder;
                
        // get all argument names
        var args = this.callback.slice(
            this.callback.indexOf('(') + 1, this.callback.indexOf(')')).match(GET_ARGUMENT_NAMES) || [], completeArg = {};
        
        // get all watch variables which are also arguments
        if (watchVariables && args.length) {            
            var tmp;
            for (var i in watchVariables) {
                // if variable is an argument, add it to args
                if ((tmp = args.indexOf(i)) !== -1) {
                    this.arguments[tmp] = watchVariables[i];
                    args[tmp] = completeArg;
                }
            }
        }
        
        // checking that all args have been set
        enumerateArr(args, function(arg) {
            if (arg !== completeArg)
                throw "Argument \"" + arg + "\" must be added as a watch variable.";
        });
        
        this.execute();
        
        // watch each watch variable
        this.watchVariable("this", context);
        if (watchVariables) {
            for (var i in watchVariables) {                
                this.watchVariable(i, watchVariables[i]);
            }
        }
    });
        
    computed.prototype.execute = function() {
        this.val = this.callbackFunction.apply(this.context, this.arguments);
    };
    
    //TODO: this should be in utils
    computed.createBindOrSetFunction = function (setterObject, setterProperty, parser) {
        var arrayDisposeCallback;
        var output = function (oldValue, newValue) {
            
            if (parser) newValue = parser(newValue);
            
            var existingVal = wipeout.utils.obj.getObject(setterProperty, setterObject);
            if (newValue === existingVal)
                return;
            
            output.dispose();

            // do not treat xml templates like Arrays
            if (!(newValue instanceof Array) || !(existingVal instanceof Array) || newValue instanceof wipeout.template.templateElementBase || existingVal instanceof wipeout.template.templateElementBase) {
                wipeout.utils.obj.setObject(setterProperty, setterObject, newValue);
            } else if (newValue instanceof wipeout.base.array) {                                        
                arrayDisposeCallback = newValue.bind(existingVal);
            } else {
                wipeout.base.array.copyAll(setterObject[setterProperty]);
            }
        };
        
        output.dispose = function () {
            if (arrayDisposeCallback) {
                arrayDisposeCallback.dispose();
                arrayDisposeCallback = null;
            }
        };
        
        return output;
    };
    
    computed.prototype.bind = function (object, property) {
        var arrayDisposeCallback;
        
        var callback = computed.createBindOrSetFunction(object, property);
        var obs = this.observe("val", callback);
        callback(null, this.val);
        
        var output = new wipeout.base.disposable();        
        output.registerDisposable(obs);
        output.registerDisposable(callback);
        
        return output;
    };
        
    computed.stripFunction = function(input) { //TODO: unit test independantly
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
    
    computed.prototype.watchVariable = function(variableName, variable) {
                
        var match, found = [], regex = new RegExp(variableName + GET_ITEMS, "g"), matches = this.callback.match(regex);
        
        // find all instances of the variableName
        var tmp1 = [], tmp2;
        while ((match = regex.exec(this.callback)) !== null) {
            if (tmp1.indexOf(tmp2 = trim(match[0])) === -1) {
                tmp1.push(tmp2);
                found.push({
                    value: match[0],
                    index: regex.lastIndex - match[0].length
                });
            }
        }

        enumerateArr(found, function (item) {
            
            if (item.index > 0) {
                // determine whether the instance is part of a bigger variable name
                // do not need to check trailing char as this is filtered by the regex
                if (this.callback[item.index - 1].search(/[\w\$]/) !== -1)  //TODO test (another char before and after)
                    return;

                // determine whether the instance is a property rather than a variable
                for (var j = item.index - 1; j >= 0; j--) { // TODO: test
                    if (this.callback[j] === ".")
                        return;
                    else if (this.callback[j].search(/\s/) !== 0)
                        break;
                }
            }
            
            tmp1 = wipeout.utils.obj.splitPropertyName(item.value);
            var path = new wipeout.base.pathWatch(
                    variable, 
                    wipeout.utils.obj.joinPropertyName(tmp1.slice(1)),
                    this.throttleExecution, this);
            
            this.registerDisposable(path);
            
            var dispose;
            var te = this.throttleExecution.bind(this);
            path.onValueChanged(function(oldVal, newVal) {
                if (dispose) {
                    dispose.dispose();
                    dispose = null;
                }

                if (newVal instanceof wipeout.base.array)
                    dispose = newVal.observe(te);
            }, true);
        }, this);
    };
    
    computed.prototype.throttleExecution = function() {
        if (this.__executePending)
            return;
        
        this.__executePending = true;
        setTimeout((function () {
            this.__executePending = false;
            this.execute();
        }).bind(this));
    };
    
    return computed;
});