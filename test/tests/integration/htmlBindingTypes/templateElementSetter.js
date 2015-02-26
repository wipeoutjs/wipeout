
module("wipeout.htmlBindingTypes.templateElementSetter, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding", function () {
	// arrange
	views.setView = obsjs.observable.extend(function aaa () {this._super(); });
	
	var name = "daasdasd";
	var xml = wipeout.template.templateParser('<val><views.set-view val1="$parent.val"><val2>3</val2></views.set-view></val>');
	var viewModel = new obsjs.observable(),
		setter = new wipeout.template.propertySetter({
			xml: xml,
			constructor: Object
		}),
		renderContext = new wipeout.template.renderContext(new obsjs.observable()).childContext(viewModel);
	
	var val1 = renderContext.$parent.val = {}, val2 = {};
	
	// act
	var disp = wipeout.htmlBindingTypes.templateElementSetter(viewModel, setter, name, renderContext);
	
	// assert
	strictEqual(viewModel[name].val.val1, val1);
	strictEqual(viewModel[name].val.val2, 3);
	
	viewModel[name].val.observe("val1", function () {
		strictEqual(viewModel[name].val.val1, val2);
		start();
		
		disp.dispose();
		renderContext.$parent.val = {};
	});
	
	// re-act 
	renderContext.$parent.val = val2;
	stop();
});

function a () {
    
    return function templateElementSetter(viewModel, setter, name, renderContext) {
		
		viewModel[name] = new setter.value.constructor;

		return new obsjs.disposable(wipeout.template.engine.instance
			.getVmInitializer(setter.value.xml)
			.initialize(viewModel[name], renderContext));
    }
};