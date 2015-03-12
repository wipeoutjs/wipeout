module("wipeout.template.initialization.htmlAttributes.wo-attr, integration", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("existing attribute", function() {
	$("#qunit-fixture").html("<div id='hello' style='display: block'></div>")
	var input = document.getElementById("hello");
	var model = obsjs.makeObservable({visible: "display: none"});
	
	// act
	var disp = wipeout.template.rendering.htmlAttributes["wo-attr"]("$this.visible", input, new wipeout.template.context(model), "wo-attr-style");
	
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
	
	// act
	var disp = wipeout.template.rendering.htmlAttributes["wo-attr"]("$this.visible", input, new wipeout.template.context(model), "wo-attr-style");
	
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
	
	// act
	var disp = wipeout.template.rendering.htmlAttributes["wo-attr"]("$this.visible", input, new wipeout.template.context(model), "wo-attr-style");
	
	// assert
	strictEqual(input.style.display, "none");
	
	disp.dispose();
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