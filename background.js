// Set settings to true on first install
browser.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        const defaultSettings = {
            showName: true,
            showNameCustom: true,
            usePrefixSuffix: true,
            namesAfrica: false,
            namesAsia: false,
            namesNorthAmerica: false,
            namesSouthAmerica: false,
            namesEurope: false,
            namesOceania: false,
            showDescription: true,
            showAge: true,
            showAgeCustom: true,
            showGender: true,
            showGenderCustom: true,
            showRace: true,
            showRaceCustom: true,
            showHairstyle: true,
            showHairstyleCustom: true,
            showUniqueFeature: true,
            showUniqueFeatureCustom: true,
            showHeight: true,
            showHeightCustom: true,
            showBuild: true,
            alwaysShowAge: false,
            alwaysShowGender: false,
            alwaysShowRace: false,
            alwaysShowHairstyle: false,
            alwaysShowUniqueFeature: false,
            alwaysShowHeight: false,
            alwaysShowBuild: false,
            limitDescriptionItems: false,
            showBuildCustom: true,
            showVoice: true,
            showAccentCustom: false,
            showPitch: true,
            showForce: true,
            showForceCustom: true,
            showSpeed: true,
            showSpeedCustom: true,
            showExtras: true,
            showExtrasCustom: true,
            showMannerism: true,
            showMannerismCustom: true,
            showPlotHook: true,
            showPlotHookCustom: true,
        };
  
        browser.storage.sync.set(defaultSettings).then(() => {
            console.log("Default settings saved on first install.");
        }).catch(error => {
            console.error('Error saving settings:', error);
        });
    }
  });