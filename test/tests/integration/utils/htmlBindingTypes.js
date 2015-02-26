
module("wipeout.utils.htmlBindingTypes, integration", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("bindOneWay, path", function () {
	// arrange
	var obj1 = new obsjs.observable();
	obj1.p1 = new obsjs.observable();
	var val1 = obj1.p1.val = {}, val2 = {};
	
	var obj2 = new obsjs.observable();
	obj2.p1 = new obsjs.observable();
	
	// act
	var output = wipeout.utils.htmlBindingTypes.bindOneWay(obj1, "p1.val", obj2, "p1.val", true);
	
	// assert
	strictEqual(obj2.p1.val, val1);
	obj1.p1.val = val2;
	obj2.p1.observe("val", function () {
		strictEqual(obj2.p1.val, val2);
		output.dispose();
		
		obj1.p1.val = {};
		start();
	});
	
	stop();
});

test("bindOneWay, computed", function () {
	// arrange
	var obj1 = new obsjs.observable();
	obj1.v1 = 33;
	obj1.v2 = 44;
	
	var obj2 = new obsjs.observable();
	obj2.p1 = new obsjs.observable();
	
	// act
	var output = wipeout.utils.htmlBindingTypes.bindOneWay(obj1, "renderContext.v1 + renderContext.v2", obj2, "p1.val", true);
	
	// assert
	strictEqual(obj2.p1.val, 77);
	obj1.v1 = 55;
	obj2.p1.observe("val", function () {
		strictEqual(obj2.p1.val, 99);
		output.dispose();
		
		obj1.v1 = 22;
		start();
	});
	
	stop();
});