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
		debugger;
		if (input === "data-wo-el") 
			return "js-xxXX-ff"; 
	};
	strictEqual(wipeout.utils.viewModels.getElementName(el), "js-xxXX-ff");
});