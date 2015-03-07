
function viewModel (name, extend) {
		
	extend = extend || wipeout.viewModels.view;

	var methods = {statics: true}, 
		values = {},
		valuesAsConstructorArgs = {},
		statics = {},
		_built = false, 
		$constructor,
		bindingTypes = {},
		parsers = {},
		inheritanceTree;

	function check () {
		if (_built) throw 'You cannot add any more functionality using this DSL as this view model has already been built. You can still add methods to the view model by adding them directly to the build output, e.g.\nvar myClass = wo.viewModel("myClass").build();\nmyClass.doSomething = function () { ... };';
	}

	var output = {

		build: function () {

			if (_built)
				return $constructor.prototype;

			_built = true;

			if (wipeout.utils.obj.getObject(name))
				throw name + " already exists.";
			
			if (!$constructor) {
				var getParentConstructorArgs = function (args) {
					/*
					if (!getParentConstructorArgs.getArgs) {
						var tmp, args = (tmp = extend
							.toString()
							.replace(/(\/\*.*\*\/)|(\/\/.*$)/g, ""))
							.slice(tmp.indexOf('(') + 1, tmp.indexOf(')')).match(/([^\s,]+)/g) || [];
						
						var templateId = args.indexOf("templateId");
						var model = args.indexOf("model");
						
					
					// TODO: this
					//			- cache result
					//			- populate valuesAsConstructorArgs
					}*/
					
					return [];
				};
				
				var split = name.split(".");
				$constructor = new Function("extend", "getParentConstructorArgs", "values", "valuesAsConstructorArgs", 
"return function " + split[split.length - 1] + " (templateId, model) {\n" +
"	extend.apply(this, getParentConstructorArgs(arguments));\n" +
"\n" +
"	for (var i in values)\n" +
"		if (!valuesAsConstructorArgs[i])\n" +
"			this[i] = values[i] instanceof Function ?\n" +
"				values[i].apply(this, arguments) :\n" +
"				values[i];\n" +
"}")(extend, getParentConstructorArgs, values, valuesAsConstructorArgs);
			}

			Class(name, function () {
				return objjs.object.extend.call(extend, $constructor);
			});

			methods.statics = $constructor;
			for (var i in methods)
				$constructor.prototype[i] = methods[i];
			for (var i in statics)
				$constructor[i] = statics[i];

			for (var i in parsers)
				$constructor.addGlobalParser(i, parsers[i]);
			for (var i in bindingTypes)
				$constructor.addGlobalBindingType(i, bindingTypes[i]);

			methods = undefined;
			statics = undefined;
			bindingTypes = undefined;
			parser = undefined;
			inheritanceTree = undefined;

			return output.build();
		},

		// core functions
		constructor: function (constructor, ignoreConstructorWarnings) {
			check();

			//TODO: test for this._super();

			if ($constructor)
				throw "You have already added a constructor for this view model";
			
			for (var i in values)
				throw 'You have already added a value for this view model. In order to add a value and constructor you must use the following code within the constructor function: "this.value = value;"';

			if (!(constructor instanceof Function))
				throw "A constructor must be a Function.";

			$constructor = constructor;
			return output;
		},

		method: function (name, method) {
			check();

			if (!(method instanceof Function))
				return output.value(name, method);

			if (methods[name])
				throw "You have already added a function: " + name;

			methods[name] = method;				
			return output;
		},

		value: function (name, value) {
			check();

			if (name === "constructor")
				return output.constructor(value);					

			if ($constructor)
				throw 'You have added a constructor for this view model. In order to add a value you must use the following code within the constructor function: "this.value = value;"';

			if (value instanceof Function)
				return output.method(name, value);

			if (values[name])
				throw "You have already added a value: " + name;

			values[name] = value;				
			return output;
		},
		dynamicValue: function (name, value) {
			check();

			if (name === "constructor")
				return output.constructor(value);					

			if ($constructor)
				throw 'You have added a constructor for this view model. In order to add a value you must use the following code within the constructor function: "this.value = value;"';

			if (!(value instanceof Function))
				throw "A dynamic value must be a function which returns the value.";

			if (values[name])
				throw "You have already added a value: " + name;

			values[name] = value;				
			return output;
		},

		staticMethod: function (name, method) {
			return output.staticValue(name, method);
		},
		staticValue: function (name, value) {
			check();

			if (statics[name])
				throw "You have already added a static value: " + name;

			statics[name] = value;
			return output;
		},

		parser: function (propertyName, parser) {
			check();

			if (parsers[propertyName])
				throw "A parser has already been set for this object";

			inheritanceTree = inheritanceTree || objjs.object.getInheritanceChain.apply(extend);
			if (inheritanceTree.indexOf(wipeout.base.bindable) === -1)
				throw "You must inherit from wipeout.base.bindable to use global parsers. Alternatively you can inherit from any view model, such as wo.view, wo.contentCOntrol, wo.itemsControl etc...";

			parsers[propertyName] = parser;
			return output;
		},
		binding: function (propertyName, bindingType) {
			check();

			if (bindingTypes[propertyName])
				throw "A binding type has already been set for this object";

			inheritanceTree = inheritanceTree || objjs.object.getInheritanceChain(extend);
			if (inheritanceTree.indexOf(wipeout.base.bindable) === -1)
				throw "You must inherit from wipeout.base.bindable to use global parsers. Alternatively you can inherit from any view model, such as wo.view, wo.contentCOntrol, wo.itemsControl etc...";

			bindingTypes[propertyName] = bindingType;
			return output;
		},

		// convenience functions
		templateId: function (templateId) {
			return output.value("templateId", templateId);
		},
		onInitialized: function (onInitialized) {
			return output.method("onInitialized", onInitialized);
		},
		onModelChanged: function (onModelChanged) {
			return output.method("onModelChanged", onModelChanged);
		},
		onRendered: function (onRendered) {
			return output.method("onRendered", onRendered);
		},
		onUnrendered: function (onUnrendered) {
			return output.method("onUnrendered", onUnrendered);
		},
		dispose: function (dispose) {
			return output.method("dispose", dispose);
		},
		onApplicationInitialized: function (onApplicationInitialized) {
			return output.method("onApplicationInitialized", onApplicationInitialized);
		}
	};

	return output;
};