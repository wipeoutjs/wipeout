module("wipeout.utils.html", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("getViewModel", "", true, function(methods, classes, subject, invoker) {
    // arrange
	var rc = {viewModel: {}};
    
    // act
	// assert
	strictEqual(invoker(null), null);
	strictEqual(invoker({wipeoutOpening: rc}), rc.viewModel);
	strictEqual(invoker({wipeoutClosing: rc}), rc.viewModel);
	strictEqual(invoker({parentElement: {wipeoutClosing: rc}}), rc.viewModel);
});