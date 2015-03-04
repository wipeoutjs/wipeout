module("wipeout.viewModels.view, integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});

test("camel casing and synchronus rendering of <template>", function() {
    
    // arrange
    // act
    application.template = '<wo.content-control a-property-1="true" id="item" >\
        <a-property-2>true</a-property-2>\
		<template>\
			<wo.content-control a-property-1="true" id="item" >\
				<a-property-2>true</a-property-2>\
			</wo.content-control>\
		</template>\
    </wo.content-control>';
    
    // assert
	application.onRendered = function () {
		ok(application.templateItems.item.aProperty1);
		ok(application.templateItems.item.aProperty2);
		ok(application.templateItems.item.templateItems.item.aProperty1);
		ok(application.templateItems.item.templateItems.item.aProperty2);
		start();
	};
	
	stop();
});

test("templateItems", function() {
    // arrange
    var id1 = "IBYIBOIYHOUUBOH", id2 = "asdasdsad";
    
    // act
    application.template = "<div id='" + id1 + "'><wo.view id='" + id2 + "'></wo.view></div>";
    
	application.onRendered = function () {
		// assert
		var item = $("#" + id1);
		strictEqual(item.length, 1);
		strictEqual(application.templateItems[id1], item[0]);
		ok(application.templateItems[id2] instanceof wo.view);
		start();
	};
	
	stop();
});

test("basic html binding, non observable", function() {
    // arrange
    var val = "LIB:OIPHJKB:OIYHJB";
    var id = "dsfbisdfb";
    application.model.value = val;
    
    // act
    application.template = "<div id='" + id + "' wo-content='$this.model.value'></div>";
    
    // assert
	application.onRendered = function () {
    	strictEqual($("#" + id).html(), val);
		start();
	};
	
	stop();
});

test("basic html binding", function() {
    // arrange
    var val = "LIB:OIPHJKB:OIYHJB";
    var id = "dsfbisdfb";
    obsjs.makeObservable(application.model);
	application.model.value = val;
    
    // act
    application.template = "<div id='" + id + "' wo-content='$this.model.value'></div>";
    
	application.onRendered = function () {
			
		// assert
		strictEqual($("#" + id).html(), val);


		// re-act
		var val2 = "NP(UNN{  JPIUNIIN";

		obsjs.observe(application.model, "value", function () {
			// re-assert
			setTimeout(function () {
				strictEqual($("#" + id).html(), val2);
				start();
			});
		});
		
		application.model.value = val2;
	};
	
	stop();
		
});

test("multi-dimentional binding", function() {
    // arrange
    var val;
    var model = obsjs.makeObservable({ inner: obsjs.makeObservable({ inner: obsjs.makeObservable({ inner: obsjs.makeObservable({ val: "" }) }) }) });
    var id1 = "asdhasjdkjbasd", id2 = "asdhasjdkjbasdasdwetsdf";
    var open = "<wo.content-control id='" + id1 + "' model='$parent.model.inner'><template>", close = "</template></wo.content-control>";
    application.model = model;
    application.template = open + open + open + "<div id='" + id2 + "' wo-content='$this.model.val'></div>" + close + close + close;
    
    // act
	application.onRendered = function () {
		
		var i1, i2, i3;
		ok(i1 = application.templateItems[id1]);
		ok(i2 = i1.templateItems[id1]);
		ok(i3 = i2.templateItems[id1]);
		
		model.inner.inner.inner.val = val = "KVKJGVMNGMV";
		obsjs.observable.afterNextObserveCycle(function () {
		obsjs.observable.afterNextObserveCycle(function () {
		obsjs.observable.afterNextObserveCycle(function () {
			strictEqual($("#" + id2).html(), val);
			
			model.inner.inner.inner = {val: val = "asdasdasd" };
			obsjs.observable.afterNextObserveCycle(function () {
			obsjs.observable.afterNextObserveCycle(function () {
				strictEqual($("#" + id2).html(), val);
				
				model.inner.inner = {inner: {val: val = "fghgfhgfh" } };
				obsjs.observable.afterNextObserveCycle(function () {
				obsjs.observable.afterNextObserveCycle(function () {
				obsjs.observable.afterNextObserveCycle(function () {
					strictEqual($("#" + id2).html(), val);
					
					model.inner = {inner: {inner: {val: val = "q3w34" } } };
					obsjs.observable.afterNextObserveCycle(function () {
					obsjs.observable.afterNextObserveCycle(function () {
					obsjs.observable.afterNextObserveCycle(function () {
					obsjs.observable.afterNextObserveCycle(function () {
						strictEqual($("#" + id2).html(), val);
					
						application.model = {inner: {inner: {inner: {val: val = "KJBKJGKJKJB" } } } };
						obsjs.observable.afterNextObserveCycle(function () {
						obsjs.observable.afterNextObserveCycle(function () {
						obsjs.observable.afterNextObserveCycle(function () {
						obsjs.observable.afterNextObserveCycle(function () {
							strictEqual($("#" + id2).html(), val);
							start();
						}, true);
						}, true);
						}, true);
						}, true);
					}, true);
					}, true);
					}, true);
					}, true);
				}, true);
				}, true);
				}, true);
			}, true);
			}, true);
		}, true);
		}, true);
		}, true);
	};
	
	stop();
});

