module("integration: wipeout.template.initialization.htmlAttributes.id", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("success", function() {
	$("#qunit-fixture").html("<button id='hello'></button>")
	var button = document.getElementById("hello");
	var vm = new wipeout.viewModels.view();
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("id", "hellooo");
	
	// act
	var disp = attribute.apply(button, new wipeout.template.context(vm));
	
	// act
	strictEqual(button.id, "hellooo");
	strictEqual(vm.templateItems.hellooo, button);
	disp[0].dispose();
	strictEqual(vm.templateItems.hellooo, undefined);
});