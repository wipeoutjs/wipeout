// name is subject to change

Class("wipeout.base.computed", function () {
    
    var STRIP_INLINE_COMMENTS = /\/\/.*$/mg;  
    var STRIP_BLOCK_COMMENTS = /\/\*[\s\S]*?\*\//mg;
    var GET_ITEMS = "(\\s*\\.\\s*([a-zA-Z_\\$]([\\w\\$]*)))+";
    
    // monitor a function and change the value of a "watched" when it changes
    function computed(context, name, callback, watchVariables) {
        
        //TODO: if can watch
        
        if (name.indexOf(".") !== -1)
            throw "Computed variables cannot contain the \".\" character."
        
            //TODO spelling
        this.disposables = [];
        this.execute = function() {
            context[name] = callback.call(context);
        };
        
        this.execute(); //TODO: can i remove this so that I don't have to execute at the very beginning?
                
        this.callback = computed.stripFunction(callback);
        
        this.watchVariable("this", context);
        if (watchVariables)
            for (var i in watchVariables)
                this.watchVariable(i, watchVariables[i]);
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
            while(r.exec(input)) {
                
                var backslashes = 0;
                for (var i = r.lastIndex - 1; input[i - 1] === "\\"; i--)
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
        while ((match = regex.exec(this.callback)) !== null) {
            found.push({
                value: match[0],
                index: regex.lastIndex - match[0].length
            });
        }

        enumerateArr(found, function (item) {
            
            if (item.index > 0) {
                // determine whether the instance is part of a bigger variable name
                if (this.callback[item.index - 1].search(/[\w\$]/) !== -1)  //TODO test (another char before and after)
                    return;

                // determine whether the instance is a property rather than a variable
                for (var j = item.index - 1; j >= 0; j--) { // TODO: test
                    if (this.callback[j] === ".")
                        return;
                    else if (this.callback[j] !== " ")
                        break;
                }
            }

            // when path item changes, execute
            this.disposables.push(
                variable.observe(item.value.substring(item.value.indexOf(".") + 1), this.execute, this));
        }, this);
    };    
    
    computed.prototype.dispose = function() {
        enumerateArr(this.disposables, function(dispose) {
            dispose.dispose();
        });
        
        this.disposables.length = 0;
    };
    
    return computed;
});