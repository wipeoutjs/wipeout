module("integration: wipeout.template.propertyValue", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("cacheAllWatched and watch: computed", function() {
	// arrange
	var subject = new wipeout.template.propertyValue("hello", "$this.value || 555");
	var model = obsjs.makeObservable({value: 666});
	var assert = {
		assert: function (oldVal, newVal) {
			strictEqual(oldVal, undefined);
			strictEqual(newVal, 666);
			
			assert.assert = function (oldVal, newVal) {
				strictEqual(oldVal, 666);
				strictEqual(newVal, 555);
				
				enumerateArr(disp, function(d) { d.dispose(); });
				model.value = 999;
			
				assert.assert = function (oldVal, newVal) {
					ok(false);
				}
				
				start();
			}
		}
	};
	
	// act
	// assert
	var disp = subject.cacheAllWatched(model, function () {
		subject.watch(new wipeout.template.context(model), function (oldVal, newVal) {
			assert.assert(oldVal, newVal);
		}, true);
	});
	
	model.value = 0;
	strictEqual(disp.length, 1);
	ok(disp[0] instanceof obsjs.observeTypes.computed);
	
	stop();
});

test("cacheAllWatched and watch: pathObserver", function() {
	// arrange
	var subject = new wipeout.template.propertyValue("hello", "$this.value");
	var model = obsjs.makeObservable({value: 666});
	var assert = {
		assert: function (oldVal, newVal) {
			strictEqual(oldVal, undefined);
			strictEqual(newVal, 666, "new val");
			
			assert.assert = function (oldVal, newVal) {
				strictEqual(oldVal, 666);
				strictEqual(newVal, 0, "new val");
				
				enumerateArr(disp, function(d) { d.dispose(); });
				model.value = 999;
			
				assert.assert = function (oldVal, newVal) {
					ok(false);
				};
				
				start();
			}
		}
	};
	
	// act
	// assert
	var disp = subject.cacheAllWatched(model, function () {
		subject.watch(new wipeout.template.context(model), function (oldVal, newVal) {
			assert.assert(oldVal, newVal);
		}, true);
	});
	
	model.value = 0;
	strictEqual(disp.length, 1);
	ok(disp[0] instanceof obsjs.observeTypes.pathObserver);
	
	stop();
});

test("execute, $context", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$context");
	
	// act
	// assert
	subject.cacheAllWatched({}, function () {
		strictEqual(context, subject.get(context));
	});
});

test("execute, $this", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$this");
	
	// act
	// assert
	subject.cacheAllWatched({}, function () {
		ok(context.$this);
		strictEqual(context.$this, subject.get(context));
	});
});

test("execute, $parent", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$parent");
	
	// act
	// assert
	subject.cacheAllWatched({}, function () {
		ok(context.$parent);
		strictEqual(context.$parent, subject.get(context));
	});
});

test("execute, $parents", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$parents");
	
	// act
	// assert
	subject.cacheAllWatched({}, function () {
		ok(context.$parents);
		strictEqual(context.$parents, subject.get(context));
	});
});

test("execute, $index", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$index");
	
	// act
	// assert
	subject.cacheAllWatched({}, function () {
		ok(context.$index);
		strictEqual(context.$index, subject.get(context));
	});
});