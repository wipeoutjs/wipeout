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
	strictEqual(wipeout.utils.viewModels.getElementName({getAttribute: function (input) { 
		if (input === "data-wo-element-name") 
			return "js-xxXX-ff"; 
	}}), "js-xxXX-ff");
});