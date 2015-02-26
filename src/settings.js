Class("wipeout.settings", function() {
    function settings (settings) {
        enumerateObj(wipeout.settings, function(a,i) {
            delete wipeout.settings[i];
        });
        
        enumerateObj(settings, function(setting, i) {
            wipeout.settings[i] = setting;
        });        
    }

    settings.asynchronousTemplates = true;
    
    settings.wipeoutAttributes = {
        viewModelName: "wo-view-model"
    };
	
    return settings;
});