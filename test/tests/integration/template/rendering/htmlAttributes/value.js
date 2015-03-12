module("integration: wipeout.template.initialization.htmlAttributes.wo-value", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("textbox", function() {
	$("#qunit-fixture").html("<input type='text' id='hello' />")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: 234});
	
	// act
	var disp = wipeout.template.rendering.htmlAttributes["wo-value"]("$this.theVal", input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.value, "234");
	
	var d2 = obsjs.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.value, "456");
			
			input.value = 678;
			
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, "678");
			
			start();
		});
	});
	
	model.theVal = 456;
	stop();
});

test("disposal", function() {
	$("#qunit-fixture").html("<input type='text' id='hello' />")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: 234});
	
	// act
	wipeout.template.rendering.htmlAttributes["wo-value"]("$this.theVal", input, new wipeout.template.context(model))();
	
	// assert
	strictEqual(input.value, "234");
	
	var d2 = obsjs.observe(model, "theVal", function () {		
		setTimeout(function () {
			
			strictEqual(input.value, "234");
			
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true);
			input.dispatchEvent(event);	// if event triggers model change, start will be called twice, causing test failure
			start();
		});
	});
	
	model.theVal = 456;
	stop();
});