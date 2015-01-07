Class("wipeout.utils.dictionary", function () {

    function dictionary() {
        this.__keyArray = [], this.__valueArray = [];
    };
    
    dictionary.prototype.add = function (key, value) {
        var i = this.__keyArray.indexOf(key);
        i === -1 ? (this.__keyArray.push(key), this.__valueArray.push(value)) : this.__valueArray[i] = value;

        return value;
    };
    
    dictionary.prototype.value = function (key) {
        return this.__valueArray[this.__keyArray.indexOf(key)];
    };
    
    return dictionary;
});