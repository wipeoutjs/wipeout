module("integration: wipeout.template.initialization.htmlAttributes.wo-render", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("success", function() {
	$("#qunit-fixture").html("<div id='hello'></div>");
	var div = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: 234});
	var attribute = new wipeout.template.rendering.htmlPropertyValue("wo-render", "$this.theVal");
	
	// act
	var disp = wipeout.template.rendering.builder.applyToElement(attribute, div, new wipeout.template.context(model));
	
	div = document.getElementById("qunit-fixture");
	
	// assert
	strictEqual(div.innerHTML, "<div id=\"hello\"><!-- $this.theVal -->234<!-- /$this.theVal --></div>");
	
	
	obsjs.observe(model, "theVal", function () {
		setTimeout(function () {
			strictEqual(div.innerHTML, "<div id=\"hello\"><!-- $this.theVal -->456<!-- /$this.theVal --></div>");
			enumerateArr(disp, function(disp) {
				disp.dispose();
			});
			strictEqual(div.innerHTML, "<div id=\"hello\"></div>");
			start();
		});
	});
	
	model.theVal = 456;
	stop();
});