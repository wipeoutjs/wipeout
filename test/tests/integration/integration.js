
module("wipeout.tests.integration.integration", {
    setup: integrationTestSetup,
    teardown: integrationTestTeardown
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