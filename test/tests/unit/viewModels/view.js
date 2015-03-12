module("wipeout.viewModels.view", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var templateId = {};
    var model = {};
    subject._super = methods.method([templateId]);
    subject.onModelChanged = {};
	subject.observe = methods.customMethod(function () {
		methods.method(["model", subject.onModelChanged, subject]).apply(null, Array.prototype.slice.call(arguments, 0, 3));
		ok(arguments[3].activateImmediately);
	});
	
    // act
    invoker(templateId, model);
    
    // assert    
    strictEqual(subject.model, model);
});

testUtils.testWithUtils("dispose", "", false, function(methods, classes, subject, invoker) {
    // arrange
    subject._super = methods.method();
    subject.$routedEventSubscriptions = [{dispose: methods.method()}, {dispose: methods.method()}];
    
    // act
    invoker();
    
    // assert    
    ok(!subject.$routedEventSubscriptions.length);
});

testUtils.testWithUtils("onModelChanged", "", false, function(methods, classes, subject, invoker) {
    // arrange
	var registration = {}, key = {};
    subject.$modelRoutedEventKey = {};
    subject.disposeOf = methods.method([subject.$modelRoutedEventKey]);
    subject.registerDisposable = methods.method([registration], key);
    subject._onModelRoutedEvent = {};
	var input = new wipeout.events.routedEventModel();
	
	/*
            if(newValue instanceof wipeout.events.routedEventModel) {
                var d1 = newValue.__triggerRoutedEventOnVM.register(this._onModelRoutedEvent, this);
                this.$modelRoutedEventKey = this.registerDisposable(d1);
            }*/
	
	input.__triggerRoutedEventOnVM = {
		register: methods.method([subject._onModelRoutedEvent, subject], registration)
	};
	
	// act
	invoker(null, input);
    
    // assert   
    strictEqual(subject.$modelRoutedEventKey, key);
});

testUtils.testWithUtils("_onModelRoutedEvent", "", false, function(methods, classes, subject, invoker) {
    // arrange
    var eventArgs = {
        routedEvent: new wipeout.events.routedEvent(),
        eventArgs: {}
    };
    
    subject.triggerRoutedEvent = methods.method([eventArgs.routedEvent, eventArgs.eventArgs]);
    
    // act
    invoker(eventArgs);
    
    // assert    
});