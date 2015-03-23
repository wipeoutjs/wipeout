
(function () {
	//modules at the bottom
	
	function go() { 
		//TODO: other types
		test("class, add remove test", function() {
			$("#qunit-fixture").html("<input type='text' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class1", "$this.theVal", "wo-class");

			// act
			var disp = attribute.applyToElement(input, new wipeout.template.context(model));

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
		
		test("visible, class at the beginning", function() {
			$("#qunit-fixture").html("<input type='text' class='class0 class1 class2' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class0", "$this.theVal", "wo-class");

			// act
			enumerateArr(attribute.applyToElement(input, new wipeout.template.context(model)), function (d) { d.dispose(); });
			
			strictEqual(input.className, "class1 class2");
		});
		
		test("visible, class in the middle", function() {
			$("#qunit-fixture").html("<input type='text' class='class0 class1 class2' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class1", "$this.theVal", "wo-class");

			// act
			enumerateArr(attribute.applyToElement(input, new wipeout.template.context(model)), function (d) { d.dispose(); });
			
			strictEqual(input.className, "class0 class2");
		});
		
		test("visible, class at the end", function() {
			$("#qunit-fixture").html("<input type='text' class='class0 class1 class2' id='hello' />")
			var input = document.getElementById("hello");
			var model = obsjs.makeObservable({theVal: false});
			var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-class-class2", "$this.theVal", "wo-class");

			// act
			enumerateArr(attribute.applyToElement(input, new wipeout.template.context(model)), function (d) { d.dispose(); });
			
			strictEqual(input.className, "class0 class1");
		});
	}
		
	module("integration: wipeout.template.initialization.htmlAttributes.wo-class", {
		setup: function() {
		},
		teardown: function() {
		}
	});
	
	go();
	
	module("integration: wipeout.template.initialization.htmlAttributes.wo-class, no classList", {
		setup: function() {
			wipeout.settings.useElementClassName = true;
		},
		teardown: function() {
			wipeout.settings.useElementClassName = false;
		}
	});

	go();
}());