//TODM: all exposed items
function expose (name, value) {
	if (!name || value == null) throw "Invalid input";
	if (wo[name]) throw name + " is already taken!";
	wo[name] = value;
}

expose("viewModel", viewModel);

expose("routedEvent", wipeout.events.routedEvent);
expose("array", wipeout.base.array);
expose("observable", obsjs.observable);

expose("bindings", wipeout.htmlBindingTypes);
expose("parsers", wipeout.template.initialization.parsers);

expose("addHtmlAttribute", HtmlAttr);

enumerateObj(wipeout.viewModels, function(vm, name) {
	expose(name, vm);
});

}());