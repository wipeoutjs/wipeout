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
        
        return element && element[domDataKey] && element[domDataKey].hasOwnProperty(key)
    };
    
    domData.get = function(element, key) {
        ///<summary>Get data from an element</summary>
        ///<param name="element" type="HTMLNode" optional="false">The element to get a store from</param>
        ///<param name="key" type="String" optional="true">The data to get</param>
        ///<returns type="Object">The value of this key</returns>
        
        if (!element)
            return undefined;
        
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
        
        if (!element) return;
        
        return (element[domDataKey] || (element[domDataKey] = {}))[key] = value;
    };
    
    domData.clear = function(element, key) {
        ///<summary>Clear an elements data</summary>
        ///<param name="element" type="HTMLNode" optional="false">The element to get a store from</param>
        ///<param name="key" type="String" optional="true">The key of data to clear</param>
        
        if (!element) return;
        
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