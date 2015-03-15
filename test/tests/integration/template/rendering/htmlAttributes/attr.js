module("integration: wipeout.template.initialization.htmlAttributes.wo-attr", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("existing attribute", function() {
	$("#qunit-fixture").html("<div id='hello' style='display: block'></div>")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({visible: "display: none"});
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-attr-style", "$this.visible", "wo-attr");
	
	// act
	attribute.apply(input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.style.display, "none");
	
	var d2 = obsjs.observe(model, "visible", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.style.display, "block");
			start();
		});
	});
	
	model.visible = "display: block";
	stop();
});

test("non existing attribute", function() {
	$("#qunit-fixture").html("<div id='hello'></div>")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({visible: "display: none"});
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-attr-style", "$this.visible", "wo-attr");
	
	// act
	attribute.apply(input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.style.display, "none");
	
	var d2 = obsjs.observe(model, "visible", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.style.display, "block");
			start();
		});
	});
	
	model.visible = "display: block";
	stop();
});

test("disposal", function() {
	$("#qunit-fixture").html("<div id='hello' style='display: block'></div>")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({visible: "display: none"});
	var attribute = new wipeout.template.rendering.htmlAttributeSetter("wo-attr-style", "$this.visible", "wo-attr");
	
	// act
	var disp = attribute.apply(input, new wipeout.template.context(model));
	
	// assert
	strictEqual(input.style.display, "none");
	
	wipeout.utils.obj.enumerateArr(disp, function (d) {
		d.dispose();
	});
	
	var d2 = obsjs.observe(model, "visible", function () {
		d2.dispose();
		
		setTimeout(function () {
			
			strictEqual(input.style.display, "none");
			start();
		});
	});
	
	model.visible = "display: block";
	stop();
});