
module("wipeout.template.initialization.propertySetter", {
    setup: function() {
    },
    teardown: function() {
    }
});

testUtils.testWithUtils("constructor", "2 parsers and a binding type", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {}, name = {};
	subject._super = methods.method([name, val]);
    
	// act
	invoker(name, val, ["ow", "s", "i"]);
	
    // assert
    strictEqual(subject.bindingType, "ow");
    strictEqual(subject.parser("234"), 234);
});

testUtils.testWithUtils("constructor", "2 binding types", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = {}, name = {};
	subject._super = methods.method([name, val]);
    
	// act
	// assert
	throws(function () {
		invoker(name, val, ["ow", "tw"]);
	});
});

testUtils.testWithUtils("getParser", "has parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var p = subject.parser = {};
    
	// act
    // assert
    strictEqual(invoker(), p);
});

testUtils.testWithUtils("getParser", "has global parser", false, function(methods, classes, subject, invoker) {
    // arrange
	var vm = wipeout.base.bindable.extend(function () { this._super(); });
	vm.addGlobalParser("aaaa", "s");
    subject.name = "aaaa";
	
	// act
    // assert
    strictEqual(invoker(new vm()), wipeout.template.initialization.parsers.s);
});

testUtils.testWithUtils("getValue", "has val", false, function(methods, classes, subject, invoker) {
    // arrange
	subject._valueAsString = "LKBLKNLBLJB";
    
	// act
    // assert
    strictEqual(invoker(), subject._valueAsString);
});

testUtils.testWithUtils("getValue", "no val", false, function(methods, classes, subject, invoker) {
    // arrange
	var val = "KJBKJBKJBKJBJ";
	subject._value = {
		serializeContent: methods.method([], val)
	};
    
	// act
    // assert
    strictEqual(invoker(), val);
    strictEqual(val, subject._valueAsString);
});

function sssss () {
	
	// override
	propertySetter.prototype.getValue = function() {
		
        return this.hasOwnProperty("_valueAsString") ?
            this._valueAsString :
            (this._valueAsString = this._value.serializeContent());
    };
	
	propertySetter.prototype.parseOrExecute = function (viewModel, renderContext) {
		
		var parser = this.getParser(viewModel);
		
		return parser ?
			parser(parser.xmlParserTempName ? this._value : this.getValue(), this.name, renderContext) :
			this.build().apply(null, renderContext.asGetterArgs());
	};
	
	propertySetter.prototype.applyToViewModel = function (viewModel, renderContext) {
		
		if (!this.bindingType)
			this.bindingType = 
				(viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBindingType(this.name)) || 
				"ow";
		
		if (!wipeout.htmlBindingTypes[this.bindingType]) throw "Invalid binding type :\"" + this.bindingType + "\" for property: \"" + this.name + "\".";
		
		var op = [];
		op.push.apply(op, this.cacheAllWatched((function () {
			var o = wipeout.htmlBindingTypes[this.bindingType](viewModel, this, renderContext)
			if (o instanceof Function)
				op.push({ dispose: o });
			else if (o && o.dispose instanceof Function)
				op.push(o);
		}).bind(this)));
		
		return op;
	};
	
	return propertySetter;
}













