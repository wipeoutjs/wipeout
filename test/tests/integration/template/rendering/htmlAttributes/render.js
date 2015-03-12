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
	
	// act
	var disp = wipeout.template.rendering.htmlAttributes["wo-render"]("$this.theVal", div, new wipeout.template.context(model));
	
	div = document.getElementById("qunit-fixture");
	
	// assert
	strictEqual(div.innerHTML, "<!-- $this.theVal -->234<!-- /$this.theVal -->");
	
	
	obsjs.observe(model, "theVal", function () {
		setTimeout(function () {
			strictEqual(div.innerHTML, "<!-- $this.theVal -->456<!-- /$this.theVal -->");
			disp();
			strictEqual(div.innerHTML, "");
			start();
		});
	});
	
	model.theVal = 456;
	stop();
});