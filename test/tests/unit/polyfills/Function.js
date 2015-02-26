module("wipeout.polyfills.Function", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("bind", null, false, function(methods, classes, subject, invoker) {
    
    // arrange
	function tester (val) {
		this.val = val;
	}
	
    var item = {};
    
    // act
	wipeout.polyfills.Function.prototype.bind.call(tester, subject)(item);
	
    // assert
    strictEqual(subject.val, item);
});