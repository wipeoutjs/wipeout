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

test("select, value, initial", function() {
    
    integrationTestSetup();
    application.model = "2";
    application.setTemplate = '<select id="theSelect" wo-value="$model">\
    <option value="1" id="theOption1">the 1</option>\
    <option value="2" id="theOption2">the 2</option>\
</select>';
    
    application.onRendered = function () {
        
        var select = document.getElementById("theSelect"),
            option1 = document.getElementById("theOption1"),
            option2 = document.getElementById("theOption2");
        
        strictEqual(application.model, "2");
        strictEqual(select.value, "2");
        ok(option2.selected);
        start();
    }
    
    stop();
});

test("select, wo-value, initial", function() {
    
    integrationTestSetup();
    application.model = 2;
    application.setTemplate = '<select id="theSelect" wo-value="$model">\
    <option wo-value="1" id="theOption1">the 1</option>\
    <option wo-value="2" id="theOption2">the 2</option>\
</select>';
    
    application.onRendered = function () {
        
        var select = document.getElementById("theSelect"),
            option1 = document.getElementById("theOption1"),
            option2 = document.getElementById("theOption2");
        
        strictEqual(application.model, 2);
        strictEqual(select.value, "the 2");
        ok(option2.selected);
        start();
    }
    
    stop();
});

test("select, option name, initial", function() {
    
    integrationTestSetup();
    application.model = "the 2";
    application.setTemplate = '<select id="theSelect" wo-value="$model">\
    <option wo-value="1" id="theOption1">the 1</option>\
    <option id="theOption2">the 2</option>\
</select>';
    
    application.onRendered = function () {
        
        var select = document.getElementById("theSelect"),
            option1 = document.getElementById("theOption1"),
            option2 = document.getElementById("theOption2");
        
        strictEqual(application.model, "the 2");
        strictEqual(select.value, "the 2");
        ok(option2.selected);
        start();
    }
    
    stop();
});

var dispatchChangeEvent = function (element) {
    var event = document.createEvent("UIEvents");
    event.initUIEvent("change", true, true, null, 1);
    element.dispatchEvent(event)
}

test("select, 3 types of options changing", function() {
    
    integrationTestSetup();
    application.setTemplate = '<select id="theSelect" wo-value="$model">\
    <option wo-value="1" id="theOption1">the 1</option>\
    <option value="2" id="theOption2">the 2</option>\
    <option id="theOption3">the 3</option>\
</select>';
    
    application.onRendered = function () {
        
        var select = document.getElementById("theSelect"),
            option1 = document.getElementById("theOption1"),
            option2 = document.getElementById("theOption2"),
            option3 = document.getElementById("theOption3");
        
        option1.selected = true;
        dispatchChangeEvent(select);
        strictEqual(select.selectedIndex, 0);
        strictEqual(select.value, "the 1");
        strictEqual(application.model, 1);
        
        option2.selected = true;
        dispatchChangeEvent(select);
        strictEqual(select.selectedIndex, 1);
        strictEqual(select.value, "2");
        strictEqual(application.model, "2");
        
        option3.selected = true;
        dispatchChangeEvent(select);
        strictEqual(select.selectedIndex, 2);
        strictEqual(select.value, "the 3");
        strictEqual(application.model, "the 3");
        
        start();
    }
    
    stop();
});

test("select, select value changing", function() {
    
    integrationTestSetup();
    application.setTemplate = '<select id="theSelect" wo-value="$model">\
    <option wo-value="1" id="theOption1">the 1</option>\
    <option value="2" id="theOption2">the 2</option>\
    <option id="theOption3">the 3</option>\
</select>';
    
    application.onRendered = function () {
        
        var select = document.getElementById("theSelect"),
            option1 = document.getElementById("theOption1"),
            option2 = document.getElementById("theOption2"),
            option3 = document.getElementById("theOption3");
        
        var d = application.observe("model", function () {
            setTimeout(function () {
                d.dispose();
                ok(option3.selected);
                d = application.observe("model", function () {
                    setTimeout(function () {
                        d.dispose();
                        ok(option2.selected);
                        d = application.observe("model", function () {
                            setTimeout(function () {
                                d.dispose();
                                ok(option1.selected);
                                start();
                            });
                        });
                        application.model = 1;
                    });
                });
                application.model = 2;
            });
        });
        application.model = "the 3";
        return;
        
        option1.selected = true;
        dispatchChangeEvent(select);
        strictEqual(select.selectedIndex, 0);
        strictEqual(select.value, "the 1");
        strictEqual(application.model, 1);
        
        option2.selected = true;
        dispatchChangeEvent(select);
        strictEqual(select.selectedIndex, 1);
        strictEqual(select.value, "2");
        strictEqual(application.model, "2");
        
        option3.selected = true;
        dispatchChangeEvent(select);
        strictEqual(select.selectedIndex, 2);
        strictEqual(select.value, "the 3");
        strictEqual(application.model, "the 3");
        
        start();
    }
    
    stop();
});