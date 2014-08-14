window.wipeout = wipeout;
window.wo = {};
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