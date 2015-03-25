
module("integration: wipeout.htmlBindingTypes.ow", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding, nb", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		name = "KJBKJBKJB",
		setter = new wipeout.template.initialization.propertySetter(name, new wipeout.wml.wmlAttribute("true", null), ["ow"]),
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	// act
	setter.applyToViewModel(viewModel, renderContext);
	
	// assert
	strictEqual(viewModel[name], true);
	viewModel[name] = false;
	viewModel.observe(name, function () {
		ok(false, "nothing should trigger change after initial set");
	});
});
	
test("binding, bindOneWay", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		name = "KJBKJBKJB",
		setter = new wipeout.template.initialization.propertySetter(name, new wipeout.wml.wmlAttribute("$parent.val", null), ["ow"]),
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	var val1 = renderContext.$parent.val = {}, val2 = {};
	
	// act
	var disp = setter.applyToViewModel(viewModel, renderContext);
	
	// assert
	strictEqual(viewModel[name], val1);
	
	
	viewModel.observe(name, function () {
		strictEqual(viewModel[name], val2);
		start();
		
		enumerateArr(disp, function (a) { a.dispose() });
		renderContext.$parent.val = {};
	});
	
	// re-act 
	renderContext.$parent.val = val2;
	stop();
});

test("integration test", function() {
    // arrange
    var id = "KJKHFGGGH";
    views.view = wo.view.extend(function() {
        this._super();
    });
        
    application.setTemplate = "<views.view property='$parent.property' id='" + id + "'></views.view>";
    
	application.onRendered = function () {
	
		var view = application.templateItems[id];

		var v = [], i = 0;
		view.observe("property", function() {
			v.push(arguments[1]);
			
			if (i === 7)
				assert();
			
			i++;
		}, null, {evaluateOnEachChange: true, evaluateIfValueHasNotChanged: true});

		var a = [];
		application.observe("property", function() {
			a.push(arguments[1]);
			
			if (i === 7)
				assert();
			
			i++;
		}, null, {evaluateOnEachChange: true, evaluateIfValueHasNotChanged: true});


		// act
		view.property = 1;
		application.property = 2;
		view.property = 3;
		application.property = 4;
		view.property = 5;
		application.property = 6;
		view.property = 7;

		// assert
		function assert () {
			deepEqual(v, [1, 3, 5, 7, 6]);
			deepEqual(a, [2, 4, 6]);
			start();
		}		
	};
	
	stop();
});