Class("wipeout.utils.dictionary", function () {

    var dictionary = orienteer.extend(function dictionary() {
        ///<summary>A simple javascript dictionary</summary>
		
        ///<summary type="[Object]">The keys (private)</summary>
        this.__keyArray = [];
		
        ///<summary type="[Object]">The values (private)</summary>
		this.__valueArray = [];
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
    
    dictionary.prototype.values = function () {
        ///<summary>Get all of the values in the dictionary</summary>
        ///<returns type="Array">The values</returns>
		
        return this.values_unsafe().slice();
    };
    
    dictionary.prototype.values_unsafe = function () {
        ///<summary>Get all of the values in the dictionary. DO NOT MODIFY THIS ARRAY</summary>
        ///<returns type="Array">The values</returns>
		
        return this.__valueArray;
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
    
    dictionary.prototype.clear = function () {
        ///<summary>Empty the dictionary</summary>
        
        this.__valueArray.length = 0;
        this.__keyArray.length = 0;
    };
    
    return dictionary;
});