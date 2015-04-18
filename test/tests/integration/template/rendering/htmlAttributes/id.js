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
	var attribute = new wipeout.template.rendering.htmlPropertyValue("id", "hellooo");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, button, new wipeout.template.context(vm));
	
	// act
	strictEqual(button.id, "hellooo");
	strictEqual(vm.templateItems.hellooo, button);
	disp[0].dispose();
	strictEqual(vm.templateItems.hellooo, undefined);
});