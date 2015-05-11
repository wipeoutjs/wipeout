module("wipeout.utils.viewModels", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("getViewModelConstructor", function() {
	// arrange
	window.xxxY = {};
	
	// act
	strictEqual(wipeout.utils.viewModels.getViewModelConstructor({name: "xxx-y"}).constructor, xxxY);
	strictEqual(wipeout.utils.viewModels.getViewModelConstructor({name: "xxx-y"}).name, "xxxY");
	
	// assert
	delete window.xxxY;
});

test("getElementName", function() {
	
	strictEqual(wipeout.utils.viewModels.getElementName({name: "xxx-y"}), "xxxY");
	strictEqual(wipeout.utils.viewModels.getElementName({name: "js-xxx-y"}), "XxxY");
	
	var el = document.createElement("div");
	el.getAttribute = function (input) {
		if (input === "data-wo-el") 
			return "js-xxXX-ff"; 
	};
	strictEqual(wipeout.utils.viewModels.getElementName(el), "js-xxXX-ff");
});

test("getViewModel, has vm", function() {
	// arrange
	var input = {wipeoutOpening: {viewModel:{}}};
		
	// act
	// assert
	strictEqual(input.wipeoutOpening.viewModel, wipeout.utils.viewModels.getViewModel(input));
});

test("getViewModel, no vm", function() {
	// arrange
	var fixture = $("#qunit-fixture")[0];
	ok(fixture);
	
	// act
	// assert
	ok(!wipeout.utils.viewModels.getViewModel(fixture))
});

test("getViewModel, parent and previous sibling have vms", function() {
	
	// arrange
	$("#qunit-fixture").html('<wo.content-control xxx="555">\
	<set-template>\
		<wo.view></wo.view>\
		<div id="theItem"></div>\
	</set-template>\
</wo.content-control>');
	
	wo($("#qunit-fixture")[0]);
	
	// act
	// assert
	strictEqual(wipeout.utils.viewModels.getViewModel(document.getElementById("theItem")).xxx, 555);
});