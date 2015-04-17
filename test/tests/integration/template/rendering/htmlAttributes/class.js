
(function () {
	
	//modules at the bottom
	function go() { 

		test("smoke test", function() {

			// arrange
			application.val = true;

			// act
			application.setTemplate = '<input id="element" wo-class-the-class="$this.val" />';

			// assert
			application.onRendered = function () {
				strictEqual(application.templateItems.element.className, "the-class");
				start();
			};

			stop();
		});
	
		test("class, add remove test", function() {
			clearIntegrationStuff();
			
			$("#qunit-fixture").html("<input type='text' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class1", "$this.theVal", null, "wo-class");

			// act
			var disp = wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model));

			// assert
			strictEqual(input.className, "");
			var d2 = obsjs.observe(model, "theVal", function () {
				d2.dispose();

				setTimeout(function () {

					strictEqual(input.className, "class1");
					d2 = obsjs.observe(model, "theVal", function () {
						d2.dispose();

						setTimeout(function () {
							strictEqual(input.className, "");
							enumerateArr(disp, function (d) { d.dispose(); });
							d2 = obsjs.observe(model, "theVal", function () {
								d2.dispose();
								setTimeout(function () {
									strictEqual(input.className, "");
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
		
		test("class at the beginning", function() {
			clearIntegrationStuff();
			
			$("#qunit-fixture").html("<input type='text' class='class0 class1 class2' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class0", "$this.theVal", null, "wo-class");

			// act
			enumerateArr(wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)), function (d) { d.dispose(); });
			
			strictEqual(input.className, "class1 class2");
		});
		
		test("class in the middle", function() {
			clearIntegrationStuff();
			
			$("#qunit-fixture").html("<input type='text' class='class0 class1 class2' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class1", "$this.theVal", null, "wo-class");

			// act
			enumerateArr(wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)), function (d) { d.dispose(); });
			
			strictEqual(input.className, "class0 class2");
		});
		
		test("class at the end", function() {
			clearIntegrationStuff();
			
			$("#qunit-fixture").html("<input type='text' class='class0 class1 class2' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class2", "$this.theVal", null, "wo-class");

			// act
			enumerateArr(wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)), function (d) { d.dispose(); });
			
			strictEqual(input.className, "class0 class1");
		});
	}
		
	module("integration: wipeout.template.initialization.htmlAttributes.wo-class", {
		setup: integrationTestSetup,
		teardown: integrationTestTeardown
	});
	
	go();
	
	module("integration: wipeout.template.initialization.htmlAttributes.wo-class, no classList", {
		setup: function() {
			wipeout.settings.useElementClassName = true;
			integrationTestSetup();
		},
		teardown: function() {
			wipeout.settings.useElementClassName = false;
			integrationTestTeardown();
		}
	});

	go();
}());