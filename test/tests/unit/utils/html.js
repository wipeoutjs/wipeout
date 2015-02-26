module("wipeout.utils.html", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("outerHTML", function() {
    // arrange    
    // act    
    //assert
    wipeout.utils.obj.enumerateObj(wo.visual.reservedTags, function(tag) {
        if(tag === "html")
            throws(function() { wipeout.utils.html.outerHTML(document.createElement(tag)); }, tag);
        else
            ok(wipeout.utils.html.outerHTML(document.createElement(tag)), tag);        
    });    
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