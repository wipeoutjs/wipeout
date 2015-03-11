module("wipeout.template.rendering.viewModelElement, integration", {
    setup: function () {},
    teardown: function () {}
});

test("constructor", function() {
	
	// arrange
	$("#qunit-fixture").html("<wo.view id='hello' a-val='22' on-initialized='function () { this.ok = true; }' dispose='function () { this.disp = true;  wo.view.prototype.dispose.call(this); }'></wo.view>");
	
	// act
	var vme = new wipeout.template.rendering.viewModelElement(document.getElementById("hello"));
	
	// assert
	ok(!document.getElementById("hello"));
	strictEqual($("#qunit-fixture")[0].childNodes.length, 2);
	strictEqual($("#qunit-fixture")[0].childNodes[0].nodeType, 8);
	strictEqual($("#qunit-fixture")[0].childNodes[0].textContent, " wo.view ");
	strictEqual($("#qunit-fixture")[0].childNodes[0].wipeoutOpening, vme);
	
	strictEqual($("#qunit-fixture")[0].childNodes[1].nodeType, 8);
	strictEqual($("#qunit-fixture")[0].childNodes[1].textContent, " /wo.view ");
	strictEqual($("#qunit-fixture")[0].childNodes[1].wipeoutClosing, vme);
	
	ok(vme.createdViewModel instanceof wo.view);
	strictEqual(vme.createdViewModel.aVal, 22);
	ok(vme.createdViewModel.ok);
	
	var cvm = vme.createdViewModel;
	vme.dispose();
	ok(cvm.disp);
});