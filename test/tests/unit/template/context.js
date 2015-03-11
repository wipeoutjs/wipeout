module("wipeout.template.context", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {};
	
	// act
	invoker(vm);
	
	// assert
	strictEqual(subject.$this, vm);
	strictEqual(subject.$parent, null);
	strictEqual(subject.$parents.length, 0);
	strictEqual(subject.$parentContext, null);
});

testUtils.testWithUtils("constructor", "wih index", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {};
	
	// act
	invoker(vm, null, 44);
	
	// assert	
	ok(subject.$index instanceof obsjs.observable);
	strictEqual(subject.$index.value, 44);
});

testUtils.testWithUtils("constructor", "with parent context", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, parent = {}, grandParent = {}, context = {
		$this: parent,
		$parents: [grandParent]
	};
	
	// act
	invoker(vm, context);
	
	// assert
	strictEqual(subject.$this, vm);
	strictEqual(subject.$parent, parent);
	strictEqual(subject.$parents.length, 2);
	strictEqual(subject.$parents[0], parent)
	strictEqual(subject.$parents[1], grandParent);;
	strictEqual(subject.$parentContext, context);
});

testUtils.testWithUtils("prototype", null, false, function(methods, classes, subject, invoker) {
    // arrange
	window.XXX = {};
	
	// act
	subject = new wipeout.template.context();
	
	// assert
	strictEqual(window.XXX, subject.XXX);
	
	delete window.XXX;
});

testUtils.testWithUtils("$find", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var arg1 = {}, arg2 = {}, found = {};
	subject = new wipeout.template.context();	
	classes.mock("wipeout.utils.find", function () {
		strictEqual(arguments[0], subject)
		this.find = methods.method([arg1, arg2], found);		
	}, 1);
	
	// act
	var f1 = subject.$find(arg1, arg2);
	var f2 = subject.$find(arg1, arg2);
	
	// assert
	strictEqual(f1, f2);
	strictEqual(f1, found);
});

testUtils.testWithUtils("contextFor", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = {}, index = 44;
	
	// act
	var output = invoker(vm, index)
	
	// assert
	ok(output instanceof wipeout.template.context);
	strictEqual(output.$this, vm);
	strictEqual(output.$index.value, index);
	strictEqual(output.$parentContext, subject);
});