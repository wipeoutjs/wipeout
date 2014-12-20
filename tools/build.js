window.wipeout = wipeout;

window.wo.object = wipeout.base.watch;
window.wo.array = function (initialValues) {
    ///<summary>Create a new observable array</summary>
    ///<param name="initialValues" type="Array" optional="true">The initial values of the array</param>
    ///<returns type="wo.base.array">The observable array</returns>
    
    return new wipeout.base.array(initialValues);
};

enumerateObj(wipeout.base, function(item, i) {
    window.wo[i] = item;
});

enumerateObj(wipeout.events, function(item, i) {
    window.wo[i] = item;
});

enumerateObj(wipeout.viewModels, function(item, i) {
    window.wo[i] = item;
});

enumerateObj(wipeout.utils, function(item, i) {
    window.wo[i] = item;
});