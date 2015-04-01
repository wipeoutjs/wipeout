
module("wipeout.tests.integration.build", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("Test there is no overlap in wipeout.base and wipeout.utils", function() {
    
    wipeout.utils.obj.enumerateObj(wipeout.base, function(item, i) {
        strictEqual(window.wo[i], item);
    });

    wipeout.utils.obj.enumerateObj(wipeout.viewModels, function(item, i) {
        strictEqual(window.wo[i], item);
    });

    wipeout.utils.obj.enumerateObj(wipeout.events, function(item, i) {
        strictEqual(window.wo[i], item);
    });

    wipeout.utils.obj.enumerateObj(wipeout.utils, function(item, i) {
        strictEqual(window.wo[i], item);
    });
});