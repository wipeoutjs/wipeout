
module("integration: wipeout.htmlBindingTypes.tw", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("binding", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		name = "KJBKJBKJB",
		setter = new wipeout.template.initialization.propertySetter(name, new wipeout.wml.wmlAttribute("$parent.val"), ["tw"]),
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	var val1 = renderContext.$parent.val = {}, val2 = {}, val3 = {};
	
	// act
	var dispose = setter.applyToViewModel(viewModel, renderContext);
	
	// assert
	strictEqual(viewModel[name], val1);
	
	
	var dis = viewModel.observe(name, function () {
		dis.dispose();
		
		strictEqual(viewModel[name], val2);
		dis = renderContext.$parent.observe("val", function () {
			dis.dispose();
			
			strictEqual(renderContext.$parent.val, val3);
			enumerateArr(dispose, function (d) { d.dispose(); });
			renderContext.$parent.val = {};
			viewModel[name] = {};
			
			renderContext.$parent.observe("val", function () { ok(false, "should have been disposed of"); });
			viewModel.observe(name, function () { ok(false, "should have been disposed of"); });
			
			start();
		});
		
		viewModel[name] = val3;
	});
	
	// re-act 
	renderContext.$parent.val = val2;
	stop();
});

test("integration", function() {
    // arrange
    var id = "KJKHFGGGH";
    views.view = wo.view.extend(function() {
        this._super();
    });
    
    var m = [];
    views.view.prototype.onModelChanged = function(oldVal, newVal) {
        this._super(oldVal, newVal);
        
        m.push(newVal);
    };
        
    application.setTemplate = "<views.view model--tw='$parent.property' id='" + id + "'></views.view>";
    
	application.onRendered = function () {
	
		var view = application.templateItems[id];

		var v = [], i = 0;
		view.observe("model", function() {
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
		m.length = 0;
		view.model = 1;
		application.property = 2;
		view.model = 3;
		application.property = 4;
		view.model = 5;
		application.property = 6;
		view.model = 7;

		// assert
		function assert() {
			obsjs.observable.afterNextObserveCycle(function () {
				deepEqual(m, [6]);
				deepEqual(v, [1, 3, 5, 7, 6]);
				deepEqual(a, [2, 4, 6]);
				start();
			});
		}
	};
	
	stop();
});