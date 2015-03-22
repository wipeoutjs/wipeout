module("integration: wipeout.viewModels.view", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
});
	
test("all binding types", function() {
	
    // arrange
	var nb = application.nb = {};
	var ow = application.ow = {}, ow2 = {};
	var tw = application.tw = {val: 1}, tw2 = {val: 2};
	var owts = application.owts = {};
        
    // act
    application.template = '<wo.view id="item"\
		nb--nb="$parent.nb" nbs--nb-s="$parent.nb"\
		ow--ow="$parent.ow" ows--ow-s="$parent.ow"\
		tw--tw="$parent.tw"\
		owts--owts="$parent.owts">\
    </wo.view>';
	
	application.onRendered = function () {
    
		strictEqual(application.nb, nb);
		strictEqual(application.nb, application.templateItems.item.nb);
		strictEqual("$parent.nb", application.templateItems.item.nbs);
		
		strictEqual(application.ow, ow);
		strictEqual(application.ow, application.templateItems.item.ow);
		strictEqual("$parent.ow", application.templateItems.item.ows);
		
		strictEqual(application.tw, tw);
		strictEqual(application.tw, application.templateItems.item.tw);
		
		strictEqual(application.owts, undefined);
		strictEqual(application.owts, application.templateItems.item.owts);
		
		var d1 = application.templateItems.item.observe("ow", function () {
			d1.dispose();
			
			strictEqual(application.ow, ow2);
			strictEqual(application.ow, application.templateItems.item.ow);
			start();
		});
		
		var d2 = application.templateItems.item.observe("tw", function () {
			d2.dispose();
			
			strictEqual(application.tw, tw2);
			strictEqual(application.tw, application.templateItems.item.tw);
			
			//TODO: this doesn't work without the set timeout. This is a bug
			setTimeout(function () {
				d2 = application.observe("tw", function () {
					d2.dispose();

					strictEqual(application.tw, tw);
					strictEqual(application.tw, application.templateItems.item.tw);
					start();
				});

				application.templateItems.item.tw = tw;
			});
		});
		
		var d3 = application.observe("owts", function () {
			d3.dispose();
			
			strictEqual(application.owts, owts);
			strictEqual(application.owts, application.templateItems.item.owts);
			start();
		});
		
		application.ow = ow2;
		application.tw = tw2;
		application.templateItems.item.owts = owts;
	};
	
	stop(3);
});
	
test("parent child views", function() {
	
    // arrange
    var parent1 = "p1", child1 = "c1", child2 = "c2";
    var parent2 = "p2", child3 = "c3", child4 = "c4";
    var parent3 = "p3", child5 = "c5", child6 = "c6";
    
    
    // act
    application.template = '<wo.content-control share-parent-scope="true" id="' + parent1 + '">\
        <template>\
            <wo.view share-parent-scope="true" id="' + child1 + '" />\
            <wo.view id="' + child2 + '" />\
        </template>\
    </wo.content-control>\
    <wo.content-control id="' + parent2 + '">\
        <template>\
            <wo.view share-parent-scope="true" id="' + child3 + '" />\
            <wo.view id="' + child4 + '" />\
        </template>\
    </wo.content-control>\
    <wo.items-control items="[{},{}]" id="' + parent3 + '">\
    </wo.items-control>';
	
	application.onRendered = function () {
    
		ok(parent1 = application.templateItems[parent1]);
		ok(child1 = application.templateItems[child1]);
		ok(child2 = application.templateItems[child2]);

		ok(parent2 = application.templateItems[parent2]);
		ok(child3 = parent2.templateItems[child3]);
		ok(child4 = parent2.templateItems[child4]);

		ok(parent3 = application.templateItems[parent3]);
		ok(child5 = parent3.getItemViewModels()[0]);
		ok(child6 = parent3.getItemViewModels()[1]);

		// assert
		strictEqual(child1.getParent(), application);
		strictEqual(child2.getParent(), application);
		strictEqual(child3.getParent(), parent2);
		strictEqual(child4.getParent(), parent2);
		strictEqual(child5.getParent(), parent3);
		strictEqual(child6.getParent(), parent3);
		
		start();
	};
	
	stop();
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

test("shareParentScope", function() {
    
    // arrange
    var container = "LKHLHKLH", val = "LKJGB*(PYGUBOPY", child = "LKGKJHFF", childNode = "ghgfhfg";
    
    // act
    application.template = '<wo.content-control id="' + container + '" anItem--s="' + val + '" depth="1">\
    <template>\
        <wo.content-control share-parent-scope="true" depth="2">\
            <template>\
                <wo.view id="' + child + '" anItem="$parent.anItem" depth="3"></wo.view>\
				<div id="' + childNode + '"></div>\
            </template>\
        </wo.content-control>\
    </template>\
</wo.content-control>';
	
	application.onRendered = function () {
    
		var subject = application.templateItems[container];
		ok(subject);

		// assert
		ok(subject.templateItems[child]);
		strictEqual(subject.templateItems[child].anItem, val);
		ok(subject.templateItems[childNode]);
		
		start();
	};
	
	
	stop();
});

/*test("move view model", function() {
    // arrange
    application.template('<wo.content-control id="toMove">\
    <template>\
        <span></span>\
    </template>\
</wo.content-control>\
<wo.content-control id="moveToParent1" share-parent-scope="true">\
    <template>\
        <div id="moveToPosition1"></div>\
    </template>\
</wo.content-control>\
<wo.content-control id="moveToParent2">\
    <template>\
        <div id="moveToPosition2"></div>\
    </template>\
</wo.content-control>');
    
    var toMove = application.templateItems.toMove;
    var moveToParent2 = application.templateItems.moveToParent2;
    strictEqual(toMove.getParent(), application);
    strictEqual(moveToParent2.getParent(), application);
    
    // act
    wo.move(function() {
        $(toMove.entireViewModelHtml()).appendTo("#moveToPosition1");
    });
    stop();
    
    // assert
    setTimeout(function() {
        strictEqual(toMove.getParent(true), application.templateItems.moveToParent1);
        strictEqual(toMove, application.templateItems.toMove);
        
        $(toMove.entireViewModelHtml()).appendTo("#moveToPosition2");        
        setTimeout(function() {
            strictEqual(toMove.getParent(), application.templateItems.moveToParent2);
            
            // test template items have changed
            ok(!application.templateItems.toMove);
            strictEqual(toMove, application.templateItems.moveToParent2.templateItems.toMove);
            
            start();
        }, 150);
    }, 150);    
});*/