module("integration: wipeout.template.initialization.htmlAttributes.wo-value", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("$model", function() {
    
    integrationTestSetup();
    application.model = "Hello";
    application.setTemplate = '<input type="text" id="theTextBox" wo-value="$model" />';
    application.onRendered = function () {
        
        var tb = document.getElementById("theTextBox");
        strictEqual(tb.value, "Hello");
        application.observe("model", function (oldVal, newVal) {
            strictEqual(oldVal, "Hello");
            strictEqual(newVal, "Goodbye");
            
            integrationTestTeardown();
            start();
        });
        
        tb.value = "Goodbye";
        var event = document.createEvent("UIEvents");
        event.initUIEvent("change", true, true, null, 1);
        tb.dispatchEvent(event);
    }
    
    stop();
});

test("textbox", function() {
	$("#qunit-fixture").html("<input type='text' id='hello' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: 234});
	var onEvent = new wipeout.template.rendering.htmlPropertyValue("wo-on-event", "blur"),
		attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(onEvent, input, new wipeout.template.context(model));
	disp.push.apply(disp, wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)));
	
	// assert
	strictEqual(input.value, "234");
	
	var d2 = busybody.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.value, "456");
			
			input.value = 678;
			
			input.focus();
			input.blur();
			
			// sometimes these events are asynchronus???
			setTimeout(function () {
				strictEqual(model.theVal, "678");
				start();
			}, 20);
		});
	});
	
	model.theVal = 456;
	stop();
});

test("disposal", function() {
	$("#qunit-fixture").html("<input type='text' id='hello' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: 234});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	enumerateArr(wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)), function (d) {
		d.dispose();
	});
	
	// assert
	strictEqual(input.value, "234");
	
	var d2 = busybody.observe(model, "theVal", function () {		
		setTimeout(function () {
			
			strictEqual(input.value, "234");
			
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true, null, 1);
			input.dispatchEvent(event);	// if event triggers model change, start will be called twice, causing test failure
			start();
		});
	});
	
	model.theVal = 456;
	stop();
});

test("radio", function() {
	$("#qunit-fixture").html("<input type='radio' id='hello1' value='1' /><input type='radio' id='hello2' value='2' />")
	var input1 = document.getElementById("hello1"), input2 = document.getElementById("hello2");
	var model = busybody.makeObservable({theVal: "1"});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, input1, new wipeout.template.context(model));
	disp.push.apply(disp, wipeout.template.rendering.builder.applyToElement(attribute, input2, new wipeout.template.context(model)))
	
	// assert
	strictEqual(input1.attributes.checked.value, "checked");
	ok(!input2.attributes.checked);
	
	var d2 = busybody.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input2.attributes.checked.value, "checked");
			ok(!input1.attributes.checked);
			
			input1.setAttribute("checked", "checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true, null, 1);
			input1.dispatchEvent(event);
			
			strictEqual(model.theVal, "1");
			
			start();
		});
	});
	
	model.theVal = "2";
	stop();
});

test("checkbox", function() {
	$("#qunit-fixture").html("<input type='checkbox' id='hello' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: true});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.attributes.checked.value, "checked");
	
	var d2 = busybody.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			ok(!input.attributes.checked);
			
			input.setAttribute("checked", "checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true, null, 1);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, true);
			
			start();
		});
	});
	
	model.theVal = false;
	stop();
});

test("checkbox, with value", function() {
	$("#qunit-fixture").html("<input type='checkbox' id='hello' value='something' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: true});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.attributes.checked.value, "checked");
	strictEqual(model.theVal, "something");
	
	var d2 = busybody.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			ok(!input.attributes.checked);
			strictEqual(model.theVal, false);
			
			input.setAttribute("checked", "checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true, null, 1);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, "something");
			
			start();
		});
	});
	
	model.theVal = false;
	stop();
});

test("checkbox, with data", function() {
	$("#qunit-fixture").html("<input type='checkbox' id='hello' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: true});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(
		new wipeout.template.rendering.htmlPropertyValue("wo-data", "'something'"), input, new wipeout.template.context(model));
	disp.push.apply(disp, wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)));
	
	// assert
	strictEqual(input.attributes.checked.value, "checked");
	strictEqual(model.theVal, "something");
	
	var d2 = busybody.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			ok(!input.attributes.checked);
			strictEqual(model.theVal, false);
			
			input.setAttribute("checked", "checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true, null, 1);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, "something");
			
			start();
		});
	});
	
	model.theVal = false;
	stop();
});

test("checkbox, with data === null", function() {
	$("#qunit-fixture").html("<input type='checkbox' id='hello' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: true});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(
		new wipeout.template.rendering.htmlPropertyValue("wo-data", "null"), input, new wipeout.template.context(model));
	disp.push.apply(disp, wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)));
	
	// assert
	ok(!input.attributes.checked);
	strictEqual(model.theVal, null);
	
	var d2 = busybody.observe(model, "theVal", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			ok(!input.attributes.checked);
			strictEqual(model.theVal, false);
			
			input.setAttribute("checked", "checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true, null, 1);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, null);
			
			start();
		});
	});
	
	model.theVal = false;
	stop();
});

test("disposal", function() {
	$("#qunit-fixture").html("<input type='checkbox' id='hello' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: true});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	enumerateArr(wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model)), function (d) {
		d.dispose();
	});
	
	// assert
	strictEqual(input.attributes.checked.value, "checked");
	
	var d2 = busybody.observe(model, "theVal", function () {
		
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.attributes.checked.value, "checked");
			
			input.removeAttribute("checked");
			var event = document.createEvent("UIEvents");
			event.initUIEvent("change", true, true, null, 1);
			input.dispatchEvent(event);
			
			strictEqual(model.theVal, false);
			
			start();
		});
	});
	
	model.theVal = false;
	stop();
});