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

testUtils.testWithUtils("find", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var arg1 = {}, arg2 = {}, found = {};
	subject = new wipeout.template.context();	
	classes.mock("wipeout.utils.find", function () {
		strictEqual(arguments[0], subject)
		this.find = methods.method([arg1, arg2], found);		
	}, 1);
	
	// act
	var f1 = subject.find(arg1, arg2);
	var f2 = subject.find(arg1, arg2);
	
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

testUtils.testWithUtils("asGetterArgs", null, false, function(methods, classes, subject, invoker) {
    // arrange
	subject.$this = {};
	subject.$parent = {};
	subject.$parents = {};
	subject.$index = {};
	
	// act
	var output1 = invoker(), output2 = invoker()
	
	// assert
	strictEqual(output1, subject.getterArgs);
	strictEqual(output1, output2);
	strictEqual(output1[0], subject);
	strictEqual(output1[1], subject.$this);
	strictEqual(output1[2], subject.$parent);
	strictEqual(output1[3], subject.$parents);
	strictEqual(output1[4], subject.$index);
});

testUtils.testWithUtils("asWatchVariables", null, false, function(methods, classes, subject, invoker) {
    // arrange
	subject.$this = {};
	subject.$parent = {};
	subject.$parents = {};
	subject.$index = {};
	
	// act
	var output1 = invoker(), output2 = invoker()
	
	// assert
	strictEqual(output1, subject.watchVariables);
	strictEqual(output1, output2);
	strictEqual(output1.$context, subject);
	strictEqual(output1.$this, subject.$this);
	strictEqual(output1.$parent, subject.$parent);
	strictEqual(output1.$parents, subject.$parents);
	strictEqual(output1.$index, subject.$index);
});

testUtils.testWithUtils("asEventArgs", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var arg1 = {}, arg2 = {}, arg3 = {}, arg4 = {};
	subject.asGetterArgs = function () { return [arg1, arg2]; };
	
	// act
	var output1 = invoker(arg3, arg4);
	
	// assert
	deepEqual(output1, [arg1, arg2, arg3, arg4]);
});

testUtils.testWithUtils("getComputed", null, false, function(methods, classes, subject, invoker) {
    // arrange
	var arg1 = obsjs.makeObservable();
	subject.asWatchVariables = function () { return {hi: arg1}; };
		
	// act
	var output1 = invoker(function (hi) {
		return hi.something;
	});
	
	// assert
	output1.onValueChanged(function (oldVal, newVal) {
		strictEqual(oldVal, undefined);
		strictEqual(newVal, "yesyes");
		start();
	});
	
	stop();
	arg1.something = "yesyes";
});

testUtils.testWithUtils("buildEventGetter", "no added brackets", true, function(methods, classes, subject, invoker) {
    // arrange
	var arg1 = {}, arg2 = {}, arg3 = {}, arg4 = {}, arg5 = {}, arg6 = {}, arg7 = {};
	arg1.theFunction = methods.method([arg1, arg2, arg3, arg4, arg5, arg6, arg7]);
	
	// act
	invoker("$context.theFunction($context, $this, $parent, $parents, $index, e, element)")(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
	
	// assert
});

testUtils.testWithUtils("buildEventGetter", "with added brackets", true, function(methods, classes, subject, invoker) {
    // arrange
	var arg1 = {}, arg2 = {}, arg3 = {}, arg4 = {}, arg5 = {}, arg6 = {}, arg7 = {};
	arg1.theFunction = methods.method([arg6, arg7]);
	
	// act
	invoker("$context.theFunction")(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
	
	// assert
});