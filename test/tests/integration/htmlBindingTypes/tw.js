
module("integration: wipeout.htmlBindingTypes.tw", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("binding", function () {
	// arrange
	var viewModel = new obsjs.observable(),
		name = "KJBKJBKJB",
		setter = new wipeout.template.initialization.propertySetter(name, new wipeout.wml.wmlAttribute("$parent.val")),
		renderContext = new wipeout.template.context(new obsjs.observable()).contextFor(viewModel);
	
	var val1 = renderContext.$parent.val = {}, val2 = {}, val3 = {};
	
	// act
	var dispose = setter.cacheAllWatched(function () {
		setter._caching.push(wipeout.htmlBindingTypes.tw(viewModel, setter, renderContext));
	});
	
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

test("concurrency, ow", function() {
	
	// arrange
    var id = "KJKHFGGGH";
    views.view = wo.view.extend(function() {
        this._super();
    });
        
    application.setTemplate = "<views.view model--tw='$parent.property' id='" + id + "'></views.view>";
    
	application.onRendered = function () {
	
		var view = application.templateItems[id];

		var v = [], i = 0;
		view.observe("model", function() {
			v.push(arguments[1]);
			assert();
			i++;
		}, null, {evaluateOnEachChange: true, evaluateIfValueHasNotChanged: true});

		var a = [];
		application.observe("property", function() {
			a.push(arguments[1]);
			assert();
			i++;
		}, null, {evaluateOnEachChange: true, evaluateIfValueHasNotChanged: true});

		var timeout = 15 * (obsjs.useObjectObserve ? 1 : 2);
		
		// act
		//TODO: without timeouts it is messier
		view.model = 1;
		setTimeout(function () {
			application.property = 2;
			setTimeout(function () {
				view.model = 3;
			}, timeout);
		}, timeout);

		// assert
		function assert() {
			if (i === 5)
				obsjs.observable.afterNextObserveCycle(function () {
					deepEqual(v, [1, 2, 3]);
					deepEqual(a, [1, 2, 3]);
					strictEqual(application.property, view.model);
					strictEqual(application.property, 3);
					start();
				});
		}
	};
	
	stop();
});