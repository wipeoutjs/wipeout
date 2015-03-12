
module("integration: wipeout.htmlBindingTypes.owts", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding, bindOneWay", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		setter = new wipeout.template.initialization.propertySetter(new wipeout.wml.wmlAttribute("$parent.val", null)),
		name = "KJBKJBKJB",
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	var val1 = viewModel[name] = {}, val2 = {};
	
	// act
	var disp = wipeout.htmlBindingTypes.owts(viewModel, setter, name, renderContext);
	
	// assert
	strictEqual(renderContext.$parent.val, val1);
	
	
	renderContext.$parent.observe("val", function () {
		strictEqual(renderContext.$parent.val, val2);
		start();
		
		disp.dispose();
		viewModel[name] = {};
	});
	
	// re-act 
	viewModel[name] = val2;
	stop();
});

function a () {  
    
    return function owts (viewModel, setter, name, renderContext) {
        var val;
        if (!setter.getParser(viewModel, name).wipeoutAutoParser ||	//TODO: expensive parser compile here
			!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(val = setter.valueAsString()))
            throw "Setter \"" + val + "\" must reference only one value when binding back to the source.";
        
		// "wipeoutAutoParser" ensures "xmlParserTempName" is false
		
        return wipeout.utils.htmlBindingTypes.bindOneWay(viewModel, name, renderContext, val);
    };
};