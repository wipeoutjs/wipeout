module("integration: wipeout.template.initialization.htmlAttributes.wo-click", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("standard call", function() {
	// arrange
	$("#qunit-fixture").html("<button id='hello'></button>")
	var button = document.getElementById("hello"), called = false;
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-click", "$this.method");
	
	// act
	var disp = attribute.apply(button, new wipeout.template.context({
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
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-click", "$this.method(e, element, 333)");
	
	// act
	var disp = attribute.apply(button, new wipeout.template.context({
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