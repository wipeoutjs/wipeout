
module("integration: wipeout.htmlBindingTypes.templateElementSetter", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding", function () {
	// arrange
	views.setView = obsjs.observable.extend(function aaa () {this._super(); });
	
	var name = "daasdasd";
	var xml = wipeout.wml.wmlParser('<val><views.set-view val1="$parent.val"><val2>3</val2></views.set-view></val>');
	var viewModel = new obsjs.observable(),
		setter = new wipeout.template.initialization.viewModelPropertyValue(name, {
			xml: xml,
			constructor: Object
		}),
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	var val1 = renderContext.$parent.val = {}, val2 = {};
	
	// act
	var disp = setter.prime(viewModel, function () {
		setter._caching.push(wipeout.htmlBindingTypes.templateElementSetter(viewModel, setter, renderContext));
	});
	
	// assert
	strictEqual(viewModel[name].val.val1, val1);
	strictEqual(viewModel[name].val.val2, 3);
	
	viewModel[name].val.observe("val1", function () {
		strictEqual(viewModel[name].val.val1, val2);
		start();
		
		enumerateArr(disp, function(disp) { disp.dispose() });
		renderContext.$parent.val = {};
	});
	
	// re-act 
	renderContext.$parent.val = val2;
	stop();
});