
module("wipeout.tests.integration.integration", {
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
	
test("setting template inline", function() {
    
    // arrange
    // act
	var innerTemplate = "<wo.content-control xxx='true' a-property='true' id='item'></wo.content-control>";
    application.template = '<wo.content-control id="item" template="' + innerTemplate + '" ></wo.content-control>';
    
    // assert
	application.onRendered = function () {
		ok(application.templateItems.item.templateItems.item.aProperty);		
		start();
	};
	
	stop();
});
	
test("parent child views", function() {
    return "share parent scope";
	
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
    <wo.items-control item-source="[{},{}]" id="' + parent3 + '">\
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
		strictEqual(child1.getParent(true), parent1);
		strictEqual(child2.getParent(true), parent1);
		strictEqual(child3.getParent(), parent2);
		strictEqual(child4.getParent(), parent2);
		strictEqual(child5.getParent(), parent3);
		strictEqual(child6.getParent(), parent3);
		
		start();
	};
	
	stop();
});

test("wipeout.utils.find", function() {
	
    // arrange
    application.template = '<wo.content-control id="me1">\
    <template>\
        <wo.content-control id="me2">\
            <template>\
                <wo.content-control id="me3"\
                    parent="$find(\'parent\')" grandParent="$find({$a:\'grandParent\'})" greatGrandParent="$find({$a:\'greatGrandParent\'})"\
                    cc0="$find(wo.contentControl)" cc1="$find({$t:wo.contentControl, $number: 1})"\
                    v0="$find({$i:wo.view})" v1="$find({$instanceof:wo.view, $number: 1})"\
                    f0="$find({id: \'me1\'})" fY="$find({id: \'me1\'}, {$n:1})" fX="$find({id: \'me3\'})">\
                </wo.content-control>\
            </template>\
        </wo.content-control>\
    </template>\
</wo.content-control>';
	
	application.onRendered = function () {
    
		var me = application.templateItems.me1.templateItems.me2.templateItems.me3;
		ok(me);
		
		// act    
		// assert
		strictEqual(me.parent, application.templateItems.me1.templateItems.me2);
		strictEqual(me.grandParent, application.templateItems.me1);
		strictEqual(me.greatGrandParent, application);

		strictEqual(me.cc0, application.templateItems.me1.templateItems.me2);
		strictEqual(me.cc1, application.templateItems.me1);

		strictEqual(me.v0, application.templateItems.me1.templateItems.me2);
		strictEqual(me.v1, application.templateItems.me1);

		strictEqual(me.f0, application.templateItems.me1);
		strictEqual(me.fX, null);
		strictEqual(me.fY, null);
		
		start();
	};
	
	stop();
});

test("removeItem routed event", function() {
    
    // arrange    
    var item = {};
    application.items = new obsjs.array([{}, item]);
    application.template = '<wo.items-control id="cc" items--tw="$parent.items"></wo.items-control>';
    
    // act
	application.onRendered = function () {
		
    	application.templateItems.cc.triggerRoutedEvent(wo.itemsControl.removeItem, item);
		
		application.items.observe(function () {
    		strictEqual(application.items.indexOf(item), -1);
			start();
		});
	};
    
    // assert
	stop();
});

test("shareParentScope", function() {
	
	return "share parent scope";
    
    // arrange
    var container = "LKHLHKLH", val = "LKJGB*(PYGUBOPY", child = "LKGKJHFF";
    
    // act
    application.template('<wo.content-control id="' + container + '" anItem="\'' + val + '\'" depth="1">\
    <template>\
        <wo.content-control share-parent-scope="true" depth="2">\
            <template>\
                <wo.view id="' + child + '" anItem="$parent.anItem" depth="3"></wo.view>\
            </template>\
        </wo.content-control>\
    </template>\
</wo.content-control>');
    
    var subject = application.templateItems[container];
    ok(subject);
    
    // assert
    ok(subject.templateItems[child]);
    strictEqual(subject.templateItems[child].anItem, val);
});

test("wipeout.viewModels.if", function() {
    // arrange
    application.hello = obsjs.observe(obsjs.observe({hello: "xxx"}));
    application.template = '<wo.if share-parent-scope="false" condition="$parent.hello" id="target">\
    <template>\
        <div id="myDiv" data-bind="html: $parent.hello().hello"></div>\
    </template>\
</wo.if>';
    
	application.onRendered = function () {
		ok(document.getElementById("myDiv"));

		// act
		application.hello = null;

		// assert
		application.templateItems.target.onRendered = function () {
			ok(!document.getElementById("myDiv"));

			delete application.templateItems.target.onRendered;
			
			start();
		};
	}
	
	stop();
});

test("wipeout.viewModels.if, shareParentScope", function() {
	return "share parent scope";
	
    // arrange
    application.hello = ko.observable({hello: "xxx"});
    application.template('<wo.if condition="hello">\
    <template>\
        <div id="myDiv" data-bind="html: hello().hello"></div>\
    </template>\
</wo.if>');
    
    ok(document.getElementById("myDiv"));
    
    // act
    application.hello(null);
    
    // assert
    ok(!document.getElementById("myDiv"));
});

test("templateItems", function() {
    // arrange
    var id = "IBYIBOIYHOUUBOH";
    
    // act
    application.template = "<div id='" + id + "'></div>";
    
	application.onRendered = function () {
		// assert
		var item = $("#" + id);
		strictEqual(item.length, 1);
		strictEqual(application.templateItems[id], item[0]);
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
    application.template = "<div id='" + id + "' content='$this.model.value'></div>";
    
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
    application.template = "<div id='" + id + "' content='$this.model.value'></div>";
    
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
	
test("un render", function() {
    // arrange
    
    var vms = [application, new wo.contentControl(), new wo.contentControl()];
    
    application.hello = vms[1];
    application.hello.helloAgain = vms[2];
    application.hello.helloAgain.template = 
"<wo.content-control id=\"cc1\">\
	</wo.content-control>\
		<div>Hi</div>\
	<wo.content-control id=\"cc2\">\
</wo.content-control>";
    application.hello.template = "<div render='$this.helloAgain'></div>";
    
    application.template = "<div render='$this.hello'></div>";
	
	application.onRendered = function () {
		vms.push(application.hello.helloAgain.templateItems.cc1);
		vms.push(application.hello.helloAgain.templateItems.cc2);

		// act
		wipeout.utils.obj.enumerateArr(vms, function(item) {
			ok(item.__woBag.domRoot);
		});
		
		application.__woBag.domRoot.unRender();

		// assert
		wipeout.utils.obj.enumerateArr(vms, function(item) {
			ok(!item.__woBag.domRoot);
		});
		
		start();
	};
	
	stop();
});

test("basic items control. initial, add, remove, re-arrange", function() {
    // arrange
    var id1 = "JBKJBLKJBKJLBLKJB";
    var id2 = "oidshfp9usodnf";
    var item1 = "item1", item2 = "item2", item3 = "item3";
    application.model.items = new obsjs.array([item1, item2, item3]);
    
    var bound = {};
    var assert = function() {
        var reBound = {};
        var $items = $("." + id2);
        strictEqual($items.length, arguments.length, "html length");
        strictEqual(application.templateItems[id1].items.length, arguments.length, "items length");
        for(var i = 0, ii = arguments.length; i < ii; i++) {            
            strictEqual($items[i].innerHTML, arguments[i], "html value");           
            strictEqual(application.templateItems[id1].getItemViewModel(i).model, arguments[i], "item model value");
            reBound[arguments[i]] = $items[i];
            
            if(bound[arguments[i]])
                strictEqual(bound[arguments[i]], $items[i], "template was not re-drawn");
            else
                bound[arguments[i]] = $items[i];
        }
        
        for(var i in bound) {
            if(!reBound[i]) {
                ok(!bound[i].parentElement, "deleted item was removed");
                delete bound[i];
            }
        }
    }
    
    // act
    application.template =
"<wo.items-control items='$this.model.items' id='" + id1 + "'>\
    <item-template>\
        <div class='" + id2 + "' content='$this.model'></div>\
    </item-template>\
</wo.items-control>";
	
	application.onRendered = function () {
    
		// assert
		assert(item1, item2, item3);

		// re-act
		var item4  = "item4";
		application.model.items.push(item4);
		var destroy = application.templateItems[id1].items.observe(function () {
			destroy.dispose();
					
			// re-assert
			ok(true, "added item");
			assert(item1, item2, item3, item4);
			
			
			// re-act
			application.model.items.splice(1, 1);
			destroy = application.templateItems[id1].items.observe(function () {
				destroy.dispose();

				// re-assert
				ok(true, "removed item");
				assert(item1, item3, item4);
				
				
				// re-act
				application.model.items.reverse();
				destroy = application.templateItems[id1].items.observe(function () {
					destroy.dispose();
					
					ok(true, "reversed items");
					assert(item4, item3, item1);
									
					start();
				});
			});
		});
	};
	
	stop();
});

test("advanced items control, creating/destroying", function() {
	return "Needs more advanced html attributes";
	
    // arrange
    var templateId = wo.contentControl.createAnonymousTemplate('<!-- ko itemsControl: null --><!-- /ko -->');
    var itemTemplateId = wo.contentControl.createAnonymousTemplate('<div data-bind="attr: { id: model }"></div>');
    
    var itemsControl1 = new wo.itemsControl();
    itemsControl1.templateId = templateId;
    itemsControl1.itemTemplateId(itemTemplateId);
    itemsControl1.itemSource(["a", "b", "c"]);
    
    var itemsControl2 = new wo.itemsControl();
    itemsControl2.templateId = templateId;
    itemsControl2.itemTemplateId(itemTemplateId);
    itemsControl2.itemSource(["d", "e", "f"]);
    
    application.content = ko.observable();
    application.template('<!-- ko render: content --><!-- /ko -->');
    
    // act
    // assert
    application.content(itemsControl1);
    strictEqual($("#a").length, 1);
    strictEqual($("#b").length, 1);
    strictEqual($("#c").length, 1);
    
    application.content(itemsControl2);
    strictEqual($("#d").length, 1);
    strictEqual($("#e").length, 1);
    strictEqual($("#f").length, 1);
});

test("items control, $index", function() {
	return "Needs more advanced html attributes";
	
    // arrange
    var templateId = wo.contentControl.createAnonymousTemplate('<!-- ko itemsControl: null --><!-- /ko -->');
    var itemTemplateId = wo.contentControl.createAnonymousTemplate('<div data-bind="attr: { id: model, \'data-index\': $index }"></div><wo.view id="item" index="$parentContext.$index" />');
    
    var itemsControl1 = new wo.itemsControl();
    itemsControl1.templateId = templateId;
    itemsControl1.itemTemplateId(itemTemplateId);
    itemsControl1.itemSource(["a", "b", "c"]);
    
    application.content = ko.observable();
    application.template('<!-- ko render: content --><!-- /ko -->');
    
    // act
    // assert
    application.content(itemsControl1);
    strictEqual($("#a").attr("data-index"), "0");
    strictEqual(itemsControl1.items()[0].templateItems.item.index, 0);
    strictEqual($("#b").attr("data-index"), "1");
    strictEqual(itemsControl1.items()[1].templateItems.item.index, 1);
    strictEqual($("#c").attr("data-index"), "2");
    strictEqual(itemsControl1.items()[2].templateItems.item.index, 2);
});

test("items control, $index, shareParentScope", function() {
	return "Needs more advanced html attributes";
	
    // arrange
    var templateId = wo.contentControl.createAnonymousTemplate('<!-- ko itemsControl: null --><!-- /ko -->');
    var itemTemplateId = wo.contentControl.createAnonymousTemplate('<div data-bind="attr: { id: model, \'data-index\': $index }"></div>');
    
    var itemsControl1 = new wo.itemsControl();
    itemsControl1.templateId = templateId;
    itemsControl1.itemTemplateId(itemTemplateId);
    itemsControl1.itemSource(["a", "b", "c"]);
    itemsControl1.createItem = function (model) {
        var view = new wipeout.viewModels.view(this.itemTemplateId(), model);
        view.shareParentScope = true;
        return view;
    };
    
    application.content = ko.observable();
    application.template('<!-- ko render: content --><!-- /ko -->');
    
    // act
    // assert
    application.content(itemsControl1);
    strictEqual($("#a").attr("data-index"), "0");
    strictEqual($("#b").attr("data-index"), "1");
    strictEqual($("#c").attr("data-index"), "2");
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

function disposeTest (act) {
    function disposeFunc() { this.isDisposed = true; this.constructor.prototype.dispose.call(this); };
    application.template = '<wo.view id="i0" />\
<div id="a" something something1=\'aaa\' something2=wer345>\
    <wo.content-control id="i1">\
        <template>\
            <div id="b">\
                <div id="c">\
                    <wo.view inner="true" id="i2" />\
                </div>\
            </div>\
        </template>\
    </wo.content-control>\
    <div id="d">\
        <div id="e">\
            <wo.items-control id="i3" items="[{},{}]">\
                <template>\
                    <div id="f">\
						{{$this.items}}\
                    </div>\
                </template>\
            </wo.items-control>\
        </div\>\
    </div\>\
</div>';
    
	application.onRendered  = function () {
		var i0, i1, i2, i3, i4, i5;
		ok(i0 = application.templateItems.i0);
		ok(i1 = application.templateItems.i1);
		ok(i2 = i1.templateItems.i2);
		ok(i3 = application.templateItems.i3);
		ok(i4 = i3.getItemViewModel(0));
		ok(i5 = i3.getItemViewModel(1));

		i0.dispose = disposeFunc;
		i1.dispose = disposeFunc;
		i2.dispose = disposeFunc;
		i3.dispose = disposeFunc;
		i4.dispose = disposeFunc;
		i5.dispose = disposeFunc;

		// act
		act();

		// assert
		setTimeout(function() {
			ok(i0.isDisposed);
			ok(i1.isDisposed);
			ok(i2.isDisposed);
			ok(i3.isDisposed);
			ok(i4.isDisposed);
			ok(i5.isDisposed);
			start();
		}, 150);
	};
	
	stop();
}

test("dispose", function() {
    disposeTest(function() { 
        application.__woBag.domRoot.dispose();
    });
});
/*
test("remove view model from dom", function() {
    disposeTest(function() {  
        wo.html(function() {
            $("#qunit-fixture").html("");
        });
    });  
});*/

test("multi-dimentional binding", function() {
    // arrange
    var val;
    var model = obsjs.makeObservable({ inner: obsjs.makeObservable({ inner: obsjs.makeObservable({ inner: obsjs.makeObservable({ val: "" }) }) }) });
    var id1 = "asdhasjdkjbasd", id2 = "asdhasjdkjbasdasdwetsdf";
    var open = "<wo.content-control id='" + id1 + "' model='$parent.model.inner'><template>", close = "</template></wo.content-control>";
    application.model = model;
    application.template = open + open + open + "<div id='" + id2 + "' content='$this.model.val'></div>" + close + close + close;
    
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

test("binding subscriptions one way", function() {
    // arrange
    var id = "KJKHFGGGH";
    views.view = wo.view.extend(function() {
        this._super();
    });
        
    application.template = "<views.view property='$parent.property' id='" + id + "'></views.view>";
    
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

test("binding subscriptions two way", function() {
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
        
    application.template = "<views.view model--tw='$parent.property' id='" + id + "'></views.view>";
    
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
		view.model = (1);
		application.property = (2);
		view.model = (3);
		application.property = (4);
		view.model = (5);
		application.property = (6);
		view.model = (7);

		// assert
		function assert() {
			obsjs.observable.afterNextObserveCycle(function () {
				deepEqual(m, [7, 6]);
				deepEqual(v, [1, 3, 5, 7, 6]);
				deepEqual(a, [2, 4, 6]);
				start();
			});
		}
	};
	
	stop();
});