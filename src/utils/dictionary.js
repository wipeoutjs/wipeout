Class("wipeout.utils.dictionary", function () {

    var dictionary = wipeout.base.object.extend(function dictionary() {
        this.__keyArray = [], this.__valueArray = [];
    });
    
    dictionary.prototype.add = function (key, value) {
        var i = this.__keyArray.indexOf(key);
        i === -1 ? (this.__keyArray.push(key), this.__valueArray.push(value)) : this.__valueArray[i] = value;

        return value;
    };
    
    dictionary.prototype.keys = function () {
        return wipeout.utils.obj.compyArray(this.keys_unsafe());
    };
    
    dictionary.prototype.keys_unsafe = function () {
        return this.__keyArray;
    };
    
    dictionary.prototype.remove = function (key) {
        var i;
        if ((i = this.__keyArray.indexOf(key)) !== -1) {
            this.__valueArray.splice(i, 1);
            this.__keyArray.splice(i, 1);
            
            return true;
        }
        
        return false;
    };
    
    dictionary.prototype.value = function (key) {
        return this.__valueArray[this.__keyArray.indexOf(key)];
    };
    
    return dictionary;
});