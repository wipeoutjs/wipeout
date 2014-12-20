Class("wipeout.settings", function() {
    function settings (settings) {
        enumerateObj(wipeout.settings, function(a,i) {
            delete wipeout.settings[i];
        });
        
        enumerateObj(settings, function(setting, i) {
            wipeout.settings[i] = setting;
        });        
    }

    settings.suppressWarnings = false;
    settings.asynchronousTemplates = true;
    settings.htmlAsyncTimeout = 10000;
    settings.useObjectObserve = !window.wipeoutDoNotUseObjectObserve; //TODO: document
    
    settings.wipeoutAttributes = {
        viewModelName: "wo-view-model"
    };
    
    return settings;
});