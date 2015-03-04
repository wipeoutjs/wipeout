module("wipeout.template.initialization.htmlAttributes.wo-content, integration", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("success", function() {
	$("#qunit-fixture").html("<div id='hello'></div>")
	var div = document.getElementById("hello");
	var model = obsjs.makeObservable({theVal: 234});
	
	// act
	var disp = wipeout.template.rendering.htmlAttributes["wo-content"]("$this.theVal", div, new wipeout.template.context(model));
	
	// assert
	strictEqual(div.innerHTML, "234");
	
	
	obsjs.observe(model, "theVal", function () {
		setTimeout(function () {
			strictEqual(div.innerHTML, "456");
			disp();
			start();
			
			model.theVal = 567;	// should not trigger change in element		
		});
	});
	
	model.theVal = 456;
	stop(2);
});