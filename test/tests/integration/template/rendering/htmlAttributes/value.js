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


test("value before event", function() {
    
    integrationTestSetup();
    application.model = "Hello";
    application.setTemplate = '<input type="text" id="theTextBox" wo-value="$model" wo-on-event="keyup" />';
    application.onRendered = function () {
        
        var tb = document.getElementById("theTextBox");
        application.observe("model", function (oldVal, newVal) {
            strictEqual(oldVal, "Hello");
            strictEqual(newVal, "Goodbye");
            
            integrationTestTeardown();
            start();
        });
        
        tb.value = "Goodbye";
        var event = document.createEvent("UIEvents");
        event.initUIEvent("keyup", true, true, null, 1);
        tb.dispatchEvent(event);
    }
    
    stop();
});

test("initial value", function() {
    
    integrationTestSetup();
    application.setTemplate = '<input type="text" id="theTextBox" wo-value="$this.XXX" />';
    application.onRendered = function () {
        strictEqual(document.getElementById("theTextBox").value, "");
            
        integrationTestTeardown();
        start();
    }
    
    stop();
});

test("textbox", function() {
	$("#qunit-fixture").html("<input type='text' id='hello' wo-on-event='blur' />")
	var input = document.getElementById("hello");
	var model = busybody.makeObservable({theVal: 234});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-value", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model));
	
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