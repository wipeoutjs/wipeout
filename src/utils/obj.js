
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
    
    classFullName = classFullName.split(".");
    var namespace = classFullName.splice(0, classFullName.length - 1);
    
    var tmp = {};
    tmp[classFullName[classFullName.length - 1]] = accessorFunction();
    
    Extend(namespace.join("."), tmp);
    
    return tmp[classFullName[classFullName.length - 1]];
};

var Extend = function(namespace, extendWith) {
    ///<summary>Similar to $.extend but with a namespace string which must begin with "wipeout"</summary>
    ///<param name="namespace" type="String">The namespace to add to</param>
    ///<param name="extendWith" type="Object">The object to add to the namespace</param>
    
    namespace = namespace.split(".");
    
    if(namespace[0] !== "wipeout") throw "Root must be \"wipeout\".";
    namespace.splice(0, 1);
    
    var current = wipeout;
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

Class("wipeout.utils.obj", function () {
        
    //TODO: merge with path watch
    //TODO: test for array
    var arrayMatch = /\[\s*\d\s*\]$/g;
    var splitPropertyName = function(propertyName) {
        propertyName = propertyName.split(".");
        
        var tmp;
        for (var i = 0; i < propertyName.length; i++) {
            propertyName[i] = wipeout.utils.obj.trim(propertyName[i]);
            var match = propertyName[i].match(arrayMatch);
            if (match && match.length) {
                if (tmp = wipeout.utils.obj.trim(propertyName[i].replace(arrayMatch, ""))) {
                    propertyName[i] = wipeout.utils.obj.trim(propertyName[i].replace(arrayMatch, ""));
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
    
    //TODO test
    var joinPropertyName = function (propertyName) {
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
                return null;
        }
        
        return context;
    };
    
    var setObject = function(propertyName, context, value) {
        propertyName = splitPropertyName(propertyName);
        if (propertyName.length > 1)
            context = _getObject(propertyName.splice(0, propertyName.length -1), context);
        
        context[propertyName[0]] = value;
    };    
    
    var compareArrays = function (array1, array2) {
        if (array1.length !== array2.length)
            return false;
        
        for (var i = 0, ii = array1.length; i < ii; i++)
            if (array1[i] !== array2[i])
                return false;
        
        return true;
    }

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
    
    var endsWith = function(string, endsWith) {
        ///<summary>Determine whether a string ends with another string</summary>
        ///<param name="string" type="String">The container string</param>
        ///<param name="endsWith" type="String">The contained string</param>
        ///<returns type="Boolean"></returns>
        
        return string.indexOf(endsWith, string.length - endsWith.length) !== -1;
    };
    
    var random = function(max) {
        ///<summary>Random int generator</summary>
        ///<param name="max" type="Number">The maximum value</param>
        ///<returns type="Number">A random number</returns>
        return Math.floor(Math.random() * max);
    };
    
    var extend = function(extend, extendWith) {
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
    obj.compareArrays = compareArrays;
    obj.random = random;
    obj.endsWith = endsWith;
    return obj;
});