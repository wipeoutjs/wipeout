
module("integration: wipeout.htmlBindingTypes.templateElementSetter", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding", function () {
	// arrange
	views.setView = busybody.observable.extend(function aaa () {this._super(); });
	
	var name = "daasdasd";
	var xml = wipeout.wml.wmlParser('<val><views.set-view val1="$this.val"><val2>3</val2></views.set-view></val>');
	var viewModel = new busybody.observable(),
		setter = new wipeout.template.initialization.viewModelPropertyValue(name, {
			xml: xml,
			constructor: Object
		}),
		renderContext = new wipeout.template.context(new busybody.observable()).contextFor(viewModel);
	
	var val1 = renderContext.$this.val = {}, val2 = {};
	
	// act
	var disp = setter.prime(viewModel, renderContext, function () {
		setter._caching.push(wipeout.htmlBindingTypes.templateElementSetter(viewModel, setter, renderContext));
	});
	
	// assert
	strictEqual(viewModel[name].val.val1, val1);
	strictEqual(viewModel[name].val.val2, 3);
	
	viewModel[name].val.observe("val1", function () {
		strictEqual(viewModel[name].val.val1, val2);
		start();
		
		enumerateArr(disp, function(disp) { disp.dispose() });
		renderContext.$this.val = {};
	});
	
	// re-act 
	renderContext.$this.val = val2;
	stop();
});