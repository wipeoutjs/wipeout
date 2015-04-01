
wo.viewModel = viewModel;

wo.routedEvent = wipeout.events.routedEvent;
wo.array = wipeout.base.array;
wo.observe = obsjs.observable.observe;

enumerateObj(wipeout.viewModels, function(vm, name) {
    wo[name] = vm;
});

}());