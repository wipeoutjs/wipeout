module("wipeout.template.initialization.htmlAttributes.id, integration", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("success", function() {
	$("#qunit-fixture").html("<button id='hello'></button>")
	var button = document.getElementById("hello");
	var vm = new wipeout.viewModels.view();
	var disp = wipeout.template.rendering.htmlAttributes.id("hellooo", button, new wipeout.template.context(vm));
	
	// act
	strictEqual(button.id, "hellooo");
	strictEqual(vm.templateItems.hellooo, button);
	disp();
	strictEqual(vm.templateItems.hellooo, undefined);
});