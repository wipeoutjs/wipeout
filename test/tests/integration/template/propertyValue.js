module("integration: wipeout.template.propertyValue", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("prime and watch: computed", function() {
	// arrange
	var subject = new wipeout.template.propertyValue("hello", "$this.value || 555");
	var model = busybody.makeObservable({value: 666});
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
	var disp = subject.prime(model, new wipeout.template.context(model), function () {
		subject.watch(new wipeout.template.context(model), function (oldVal, newVal) {
			assert.assert(oldVal, newVal);
		}, true);
	});
	
	model.value = 0;
	strictEqual(disp.length, 1);
	ok(disp[0] instanceof busybody.observeTypes.computed);
	
	stop();
});

test("prime and watch: pathObserver", function() {
	// arrange
	var subject = new wipeout.template.propertyValue("hello", "$this.value");
	var model = busybody.makeObservable({value: 666});
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
	var disp = subject.prime(model, new wipeout.template.context(model), function () {
		subject.watch(new wipeout.template.context(model), function (oldVal, newVal) {
			assert.assert(oldVal, newVal);
		}, true);
	});
	
	model.value = 0;
	strictEqual(disp.length, 1);
	ok(disp[0] instanceof busybody.observeTypes.pathObserver);
	
	stop();
});

test("execute, $context", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$context");
	
	// act
	// assert
	subject.prime({}, context, function () {
		strictEqual(context, subject.get(context));
	});
});

test("execute, $this", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$this");
	
	// act
	// assert
	subject.prime({}, context, function () {
		ok(context.$this);
		strictEqual(context.$this, subject.get(context));
	});
});

test("execute, $this", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$this");
	
	// act
	// assert
	subject.prime({}, context, function () {
		ok(context.$this);
		strictEqual(context.$this, subject.get(context));
	});
});

test("execute, $parents", function() {
	// arrange
	var context = new wipeout.template.context({}).contextFor({}, 333);
	var subject = new wipeout.template.propertyValue("hello", "$parents");
	
	// act
	// assert
	subject.prime({}, context, function () {
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
	subject.prime({}, context, function () {
		ok(context.$index);
		strictEqual(context.$index, subject.get(context));
	});
});