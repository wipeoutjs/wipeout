module("integration: wipeout.template.initialization.htmlAttributes.wo-visible", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("smoke test", function() {
	
	// arrange
	application.val = false;
	
	// act
	application.template = '<input id="element" wo-visible="$this.val" />';
	
	// assert
	application.onRendered = function () {
		strictEqual(application.templateItems.element.style.display, "none");
		start();
	};
	
	stop();
});

//TODO: other types
test("visible", function() {
	clearIntegrationStuff();
	
	$("#qunit-fixture").html("<input type='text' id='hello' />")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: false});
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-visible", "$this.theVal");
	
	// act
	var disp = attribute.applyToElement(input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.style.display, "none");
	
	var d2 = obsjs.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.style.display, "");
			d2 = obsjs.observe(model, "theVal", function () {
				d2.dispose();
				
				setTimeout(function () {
					strictEqual(input.style.display, "none");
					enumerateArr(disp, function (d) { d.dispose(); });
					d2 = obsjs.observe(model, "theVal", function () {
						d2.dispose();
						setTimeout(function () {
							strictEqual(input.style.display, "none");
							start();
						});
					});
					model.theVal = true;
				});
			});
			model.theVal = false;
		});
	});
	
	model.theVal = true;
	stop();
});