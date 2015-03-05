
function createViewModel (name, extend) {
		
	extend = extend || wipeout.viewModels.view;

	function getParentConstructorArgs (parentConstructor, args, argOverrides) {
		// TODO: this
		//			- cache result
		//			- populate valuesAsConstructorArgs

		return [];
	}

	var methods = {statics: true}, 
		values = {},
		valuesAsConstructorArgs = {},
		statics = {},
		_built = false, 
		_constructor = false, 
		$constructor = function (templateId, model) {
			extend.apply(this, getParentConstructorArgs({
				templateId: templateId,
				model: model
			}, values));

			for (var i in values)
				if (!valuesAsConstructorArgs[i])
					this[i] = values[i] instanceof Function ?
						values[i].apply(this, arguments) :
						values[i];
		},
		bindingTypes = {},
		parser = {},
		inheritanceTree;

	function check () {
		if (_built) throw 'This view model has already been built. You cannot add functionality using this DSL. You can still add methods to the view model by adding them directly to the build output, e.g.\nvar myClass = wo.createViewModel("myClass").build();\nmyClass.doSomething = function () { ... };';
	}

	var output = {

		build: function () {

			if (_built)
				return $constructor.prototype;

			_built = true;

			if (wipeout.utils.obj.getObject(name))
				throw name + " already exists.";

			//TODO: class still requires root namespace to be "wipeout"
			Class(name, function () {
				return obsjs.object.extend.call(extend, $constructor);
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
			_constructor = undefined;
			bindingTypes = undefined;
			parser = undefined;
			inheritanceTree = undefined;

			return output.build();
		},

		// core functions
		constructor: function (constructor) {
			check();

			//TODO: test for this._super();

			if (_constructor)
				throw "You have already added a constructor for this view model";

			if (!(constructor instanceof Function))
				throw "A constructor must be a Function.";

			_constructor = true;
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

			if (_constructor)
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

			if (_constructor)
				throw "You have added a constructor for this view model. ";

			if (!(value instanceof Function))
				throw "A dynamic value must be a function which returns the value.";

			if (values[name])
				throw "You have already added a value: " + name;

			values[name] = value;				
			return output;
		},

		staticMethod: function (name, method) {
			check();

			return output.staticValue(name, method);
		},
		staticValue: function (name, value) {
			check();

			if (statics[name])
				throw "You have already added a static value: " + name;

			statics[name] = value;
			return output;
		},

		propertyParser: function (name, parser) {
			check();

			if (parsers[name])
				throw "A parser has already been set for this object";

			inheritanceTree = inheritanceTree || objjs.object.getInheritanceChain.apply(extend);
			if (inheritanceTree.indexOf(wipeout.base.bindable) === -1)
				throw "You must inherit from wipeout.base.bindable to use global parsers. Alternatively you can inherit from any view model, such as wo.view, wo.contentCOntrol, wo.itemsControl etc...";

			parsers[name] = parser;
			return output;
		},
		propertyBinding: function (name, bindingType) {
			check();

			if (bindingTypes[name])
				throw "A binding type has already been set for this object";

			inheritanceTree = inheritanceTree || objjs.object.getInheritanceChain.apply(extend);
			if (inheritanceTree.indexOf(wipeout.base.bindable) === -1)
				throw "You must inherit from wipeout.base.bindable to use global parsers. Alternatively you can inherit from any view model, such as wo.view, wo.contentCOntrol, wo.itemsControl etc...";

			bindingTypes[name] = bindingType;
			return output;
		}

		// convenience functions
		template: function (templateId) {
			return output.value("templateId", templateId);
		},
		model: function (model) {
			return output.value("model", model);
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