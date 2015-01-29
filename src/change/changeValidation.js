
Class("wipeout.change.changeValidation", function () {
    function changeValidation() {
    }
    
    changeValidation.prototype.registerFirstChange = function (change) {
        this.change = change;
    };
    
    changeValidation.prototype.afterLastChange = function (change, disposeCallback) {
        this.lastChange = change;
        this.dispose = disposeCallback;
    };
    
    changeValidation.prototype.shouldDispose = function (change) {
        return this.lastChange === change;
    };
    
    changeValidation.prototype.originalValue = function (originalValue) {
        return this._originalValue ? this._originalValue.val : originalValue;
    };
    
    changeValidation.prototype.isValid = function (change) {
        if (this.change === false)
            return true;
        
        if (arguments.length === 0) // user has not specified which change they want to test for
            return false;
        
        if (this.change === undefined)
            return false;
        
        if (this.change === change.change) {
            this._originalValue = { val: change.originalValue || change.change.oldValue };
            this.change = false;
            
            wipeout.base.watched.afterNextObserveCycle((function () {
                delete this._originalValue;
            }).bind(this));
        }
        
        return !this.change;
    };
    
    return changeValidation;
});