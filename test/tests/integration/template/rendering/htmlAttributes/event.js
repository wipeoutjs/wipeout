module("integration: wipeout.template.initialization.htmlAttributes.wo-event", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("standard call", function() {
	// arrange
	$("#qunit-fixture").html("<button id='hello'></button>")
	var button = document.getElementById("hello"), called = false;
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-event-click", "$this.method", null, "wo-event");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, button, new wipeout.template.context({
		method: function (e, el) {
			strictEqual(button, el);
			ok(e);
			ok(!called);
			called = true;
		}
	}));
	
	// act
	button.click();
	disp[0].dispose();
	button.click();
	
	// assert
	ok(called);
});

test("standard call, with args", function() {
	// arrange
	$("#qunit-fixture").html("<button id='hello'></button>")
	var button = document.getElementById("hello"), called = false;
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-event-click", "$this.method(e, element, 333)", null, "wo-event");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, button, new wipeout.template.context({
		method: function (e, el, number) {
			strictEqual(button, el);
			strictEqual(number, 333);
			ok(e);
			ok(!called);
			called = true;
		}
	}));
	
	// act
	button.click();
	disp[0].dispose();
	button.click();
});


// add some shortcuts to common html events
enumerateArr(["blur", "change", "click", "focus", "keydown", "keypress", "keyup", "mousedown", "mouseout", "mouseover", "mouseup", "submit"], 
	function (event) {
	
	module("integration: wipeout.template.initialization.htmlAttributes.wo-" + event, {
		setup: function() {
		},
		teardown: function() {
		}
	});
	
	testUtils.testWithUtils("smoke test", "", true, function(methods, classes, subject, invoker) {
		$("#qunit-fixture").html("<input type='text' id='hello' />")
		var input = document.getElementById("hello");
		var model = busybody.makeObservable({method: methods.method()});
		var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-" + event, "$this.method()");

		// act
		var disp = wipeout.template.rendering.builder.applyToElement(attribute, input, new wipeout.template.context(model));

		var ev = document.createEvent("UIEvents");
		ev.initUIEvent(event, true, true, null, 1);
		input.dispatchEvent(ev);
		
		enumerateArr(disp, function (d) { d.dispose(); });
		
		// assert
	});
});