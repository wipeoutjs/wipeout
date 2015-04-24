Class("wipeout.settings", function() {
    function settings (settings) {
        ///<summary>Change all settings</summary>
        ///<param name="settings" type="Object">A dictionary of new settings</param>
		
        enumerateObj(wipeout.settings, function(a,i) {
            delete wipeout.settings[i];
        });
        
        enumerateObj(settings, function(setting, i) {
            wipeout.settings[i] = setting;
        });        
    }

    settings.asynchronousTemplates = true;
    settings.displayWarnings = true;
    settings.useElementClassName = false;
	
    return settings;
});