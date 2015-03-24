module("integration: wipeout.template.initialization.htmlAttributes.wo-value", {
    setup: function() {
    },
    teardown: function() {
    }
});

//TODO: other types
test("textbox", function() {
	$("#qunit-fixture").html("<input type='text' id='hello' />")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: 234});
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-value", "$this.theVal");
	
	// act
	var disp = attribute.applyToElement(input, new wipeout.template.context(model));
	
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
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-value", "$this.theVal");
	
	// act
	enumerateArr(attribute.applyToElement(input, new wipeout.template.context(model)), function (d) {
		d.dispose();
	});
	
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

//TODO: other types
test("checkbox", function() {
	$("#qunit-fixture").html("<input type='checkbox' id='hello' />")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: true});
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-value", "$this.theVal");
	
	// act
	var disp = attribute.applyToElement(input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.attributes.checked.value, "checked");
	
	var d2 = obsjs.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			ok(!input.attributes.checked);
			
			input.setAttribute("checked", "checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, true);
			
			start();
		});
	});
	
	model.theVal = false;
	stop();
});

test("disposal", function() {
	$("#qunit-fixture").html("<input type='checkbox' id='hello' />")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: true});
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-value", "$this.theVal");
	
	// act
	enumerateArr(attribute.applyToElement(input, new wipeout.template.context(model)), function (d) {
		d.dispose();
	});
	
	// assert
	strictEqual(input.attributes.checked.value, "checked");
	
	var d2 = obsjs.observe(model, "theVal", function () {
		
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.attributes.checked.value, "checked");
			
			input.removeAttribute("checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, false);
			
			start();
		});
	});
	
	model.theVal = false;
	stop();
});