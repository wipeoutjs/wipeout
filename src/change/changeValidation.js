
Class("wipeout.change.changeValidation", function () {
    function firstChange() {
    }
    
    firstChange.prototype.registerFirstChange = function (change) {
        this.change = change;
    };
    
    firstChange.prototype.afterLastChange = function (change, disposeCallback) {
        this.lastChange = change;
        this.dispose = disposeCallback;
    };
    
    firstChange.prototype.shouldDispose = function (change) {
        return this.lastChange === change;
    };
    
    firstChange.prototype.originalValue = function (originalValue) {
        return this._originalValue ? this._originalValue.val : originalValue;
    };
    
    firstChange.prototype.isValid = function (change) {
        if (this.change === false)
            return true;
        
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
    
    return firstChange;
});