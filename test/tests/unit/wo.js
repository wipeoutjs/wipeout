module("wo", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("wo", "element", false, function(methods, classes, subject, invoker) {
	
	// arrange
	var vm1;
	$("#qunit-fixture").html("<busybody.disposable id='obj1' xxx--s='obj1'></busybody.disposable>");
	
	// act
	var op = wo(null, $("#obj1")[0]);
	
	// assert
	strictEqual((vm1 = $("#qunit-fixture")[0].firstChild.wipeoutOpening.viewModel).xxx, "obj1");
	
	vm1.registerDisposeCallback(methods.method());
	
	op.dispose();
});

testUtils.testWithUtils("wo", "id", false, function(methods, classes, subject, invoker) {
	
	// arrange
	var vm1;
	$("#qunit-fixture").html("<busybody.disposable id='obj1' xxx--s='obj1'></busybody.disposable>");
	
	// act
	var op = wo(null, "obj1");
	
	// assert
	strictEqual((vm1 = $("#qunit-fixture")[0].firstChild.wipeoutOpening.viewModel).xxx, "obj1");
	
	vm1.registerDisposeCallback(methods.method());
	
	op.dispose();
});

testUtils.testWithUtils("wo", "element 2", false, function(methods, classes, subject, invoker) {
	// arrange
	var vm1, vm2;
	$("#qunit-fixture").html("<div><busybody.disposable id--s='obj1'></busybody.disposable><div data-wo-el='busybody.disposable' id--s='obj2'></div></div>");
	
	// act
	var op = wo(null, $("#qunit-fixture")[0]);
	
	// assert
	strictEqual((vm1 = $("#qunit-fixture")[0].firstChild.childNodes[0].wipeoutOpening.viewModel).id, "obj1");
	strictEqual((vm2 = $("#qunit-fixture")[0].firstChild.childNodes[3].wipeoutOpening.viewModel).id, "obj2");
	
	vm1.registerDisposeCallback(methods.method());
	vm2.registerDisposeCallback(methods.method());
	
	op.dispose();
});