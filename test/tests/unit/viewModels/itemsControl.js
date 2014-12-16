module("wipeout.viewModels.itemsControl", {
    setup: function() {
    },
    teardown: function() {
    }
});

var itemsControl = wipeout.viewModels.itemsControl;

testUtils.testWithUtils("constructor", "static constructor", false, function(methods, classes, subject, invoker) {
    // arrange
    var ex = {};
    subject._super = methods.customMethod(function() {
        // can't test content as it might or might not have been rewritten by now
        ok($("#" + arguments[0]).html());
        // exit, we are done
        throw ex;
    });
        
    // act
    try {
        invoker();
    } catch (e) {
        strictEqual(e, ex);
    }
    
    // assert
});

testUtils.testWithUtils("constructor", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var templateId = {}, itemTemplateId = {}, model = {};
    subject._super = methods.method([templateId, model]);
    subject.observe =function(){}// methods.method(["templateId", subject.reDrawItems = {}, subject]);
    
    classes.mock("wipeout.viewModels.contentControl.createNONOBSERVABLETemplatePropertyFor", function () {
        methods.method([subject, "itemTemplateId", "itemTemplate"])(arguments[0], arguments[1], arguments[2]);
    }, 1);
    
    subject._syncModelsAndViewModels = function(){};
    subject.registerDisposable = methods.method();
    
    subject._removeItem = {};
    subject.observe = methods.method(["itemTemplateId", subject.reDrawItems, subject]);
    subject.registerRoutedEvent = methods.method([wipeout.viewModels.itemsControl.removeItem, subject._removeItem, subject]);
    
    // act
    invoker(templateId, itemTemplateId, model);
    
    // assert
    strictEqual(subject.itemTemplateId, itemTemplateId);
    strictEqual(subject.itemSource.constructor, wipeout.base.array);
    strictEqual(subject.items.constructor, wipeout.base.array);
});

testUtils.testWithUtils("_removeItem", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var e = {data:{}};
    subject.itemSource = {
        indexOf: methods.method([e.data], 1)
    };
    subject.removeItem = methods.method([e.data], 1);
    
    // act
    invoker(e);
    
    // assert
    ok(e.handled);
});

testUtils.testWithUtils("removeItem", "", false, function(methods, classes, subject, invoker) {
    // arrange    
    var data = {};
    subject.itemSource = ko.observableArray([data]);
    
    // act
    invoker(data);
    
    // assert
    strictEqual(subject.itemSource().length, 0)
});

testUtils.testWithUtils("_syncModelsAndViewModels", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var m0 = {}, m1 = {};
    subject.itemSource = new wipeout.base.array([{}, {}, {}, {}]);
    subject.items = [{model: m0}, {model: m1}];
    
    // act
    invoker();
    
    // assert
    strictEqual(subject.itemSource.length, 2);
    strictEqual(subject.itemSource[0], m0);
    strictEqual(subject.itemSource[1], m1);
});

testUtils.testWithUtils("_modelsAndViewModelsAreSynched", "different lengths", false, function(methods, classes, subject, invoker) {
    // arrange
    var m0 = {}, m1 = {};
    subject.itemSource = [m0, m1, {}];
    subject.items = [{model: m0}, {model: m1}];
    
    // act
    var actual = invoker();
    
    // assert
    ok(!actual);
});

testUtils.testWithUtils("_modelsAndViewModelsAreSynched", "different values", false, function(methods, classes, subject, invoker) {
    // arrange
    var m0 = {}, m1 = {};
    subject.itemSource = [m0, {}];
    subject.items = [{model: m0}, {model: m1}];
    
    // act
    var actual = invoker();
    
    // assert
    ok(!actual);
});

testUtils.testWithUtils("_modelsAndViewModelsAreSynched", "are synched", false, function(methods, classes, subject, invoker) {
    // arrange
    var m0 = {}, m1 = {};
    subject.itemSource = [m0, m1];
    subject.items = [{model: m0}, {model: m1}];
    
    // act
    var actual = invoker();
    
    // assert
    ok(actual);
});

testUtils.testWithUtils("onItemsChanged", "are synched", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._syncModelsAndViewModels = methods.method();
    subject.onItemDeleted = methods.method([66]);
    subject.onItemRendered = methods.method([77]);
    
    // act
    var actual = invoker([66], [77]);
    
    // assert
});

testUtils.testWithUtils("_itemSourceChanged", "", false, function(methods, classes, subject, invoker) {
    // arrange
    subject.items = new wipeout.base.array([11, 22, 33]);
    subject.itemSource = new wipeout.base.array([{},{},{}, {}]);
    subject._createItem = methods.method([44], 55);
    
    // act
    var actual = invoker(null, null, {
        added:[{
            index: 1,
            value:44
        }], 
        moved:[{
            from: 1,
            to: 2
        }, {
            from: 2,
            to: 3
        }]
    });
    
    // assert
    strictEqual(subject.items.length, 4);
    strictEqual(subject.items[0], 11);
    strictEqual(subject.items[1], 55);
    strictEqual(subject.items[2], 22);
    strictEqual(subject.items[3], 33);
});

testUtils.testWithUtils("dispose", "", false, function(methods, classes, subject, invoker) {
    // arrange
    subject.items = [11, 22, 33];
    subject._super = methods.method();
    
    // act
    invoker();
    
    // assert
    strictEqual(subject.items.length, 0);
});   

testUtils.testWithUtils("onItemDeleted", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var item = {
        dispose: methods.method()
    };
    
    // act
    invoker(item);
    
    // assert
});   

testUtils.testWithUtils("_createItem", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var model = {};
    var expected = {
        __woBag: {}
    };
    subject.createItem = methods.method([model], expected);
    
    // act
    var actual = invoker(model);
    
    // assert
    strictEqual(actual, expected);
    ok(actual.__woBag.createdByWipeout);
});

testUtils.testWithUtils("createItem", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var itemTemplateId = {};
    var model = {};
    subject.itemTemplateId = itemTemplateId;
    
    // act
    var actual = invoker(model);
    
    // assert
    ok(actual instanceof wipeout.viewModels.view);
    strictEqual(actual.model, model);
    strictEqual(actual.templateId(), itemTemplateId);
});

testUtils.testWithUtils("reDrawItems", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var model = {};
    var viewModel = {};
    subject.itemSource = [model];
    subject.items = [];
    subject._createItem = methods.method([model], viewModel);
    
    // act
    invoker();
    
    // assert
    strictEqual(subject.items.length, 1);
    strictEqual(subject.items[0], viewModel);
});