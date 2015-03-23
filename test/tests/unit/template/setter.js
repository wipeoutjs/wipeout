module("wipeout.template.setter", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("build", "has existing", false, function(methods, classes, subject, invoker) {
	// arrange
	subject._built = {};
	
	// act
	// assert
	strictEqual(subject._built, invoker());
});

testUtils.testWithUtils("build", "create", false, function(methods, classes, subject, invoker) {
	// arrange
	var tmp;
	subject.getValue = function () { return "555" };
	
	// act
	// assert
	strictEqual(555, (tmp = invoker())({}));
	strictEqual(subject._built, tmp);
});

testUtils.testWithUtils("watch", "not caching. Other logic tested in integration tests", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	throws(function () {
		invoker();
	});
});

testUtils.testWithUtils("execute", "tested in integration tests", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	ok(true);
});

testUtils.testWithUtils("execute", "tested in integration tests", false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	ok(true);
});

testUtils.testWithUtils("cacheAllWatched", "already caching", false, function(methods, classes, subject, invoker) {
	// arrange
	subject._caching = true;
	
	// act
	// assert
	throws(function () {
		invoker();
	});
});

testUtils.testWithUtils("cacheAllWatched", "not caching", false, function(methods, classes, subject, invoker) {
	// arrange	
	var tmp;
	
	// act
	var output = invoker(function () {
		tmp = subject._caching
	});
	
	// assert
	ok(tmp instanceof Array);
	ok(!subject._caching);
});

testUtils.testWithUtils("getValue", null, false, function(methods, classes, subject, invoker) {
	// arrange
	// act
	// assert
	strictEqual(subject._value = {}, invoker());
});