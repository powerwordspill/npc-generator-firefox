document.getElementById('save-settings').addEventListener('click', saveSettings);
document.addEventListener('DOMContentLoaded', loadSettings);

function saveSettings() {
  const settings = {
    showName: document.getElementById('show-name').checked,
    showNameCustom: document.getElementById('show-name-custom').checked,
    usePrefixSuffix: document.getElementById('use-prefix-suffix').checked,
    namesAfrica: document.getElementById('names-africa').checked,
    namesAsia: document.getElementById('names-asia').checked,
    namesNorthAmerica: document.getElementById('names-north-america').checked,
    namesSouthAmerica: document.getElementById('names-south-america').checked,
    namesEurope: document.getElementById('names-europe').checked,
    namesOceania: document.getElementById('names-oceania').checked,
    firstNames: document.getElementById('firstNames').value.split(',').map(item => item.trim()),
    lastNames: document.getElementById('lastNames').value.split(',').map(item => item.trim()),

    showDescription: document.getElementById('show-description').checked,
    showAge: document.getElementById('show-age').checked,
    showAgeCustom: document.getElementById('show-age-custom').checked,
    ages: document.getElementById('ages').value.split(',').map(item => item.trim()),
    showGender: document.getElementById('show-gender').checked,
    showGenderCustom: document.getElementById('show-gender-custom').checked,
    genders: document.getElementById('genders').value.split(',').map(item => item.trim()),
    showRace: document.getElementById('show-race').checked,
    showRaceCustom: document.getElementById('show-race-custom').checked,
    races: document.getElementById('races').value.split(',').map(item => item.trim()),
    showHairstyle: document.getElementById('show-hairstyle').checked,
    showHairstyleCustom: document.getElementById('show-hairstyle-custom').checked,
    hairstyles: document.getElementById('hairstyles').value.split(',').map(item => item.trim()),
    showUniqueFeature: document.getElementById('show-uniqueFeature').checked,
    showUniqueFeatureCustom: document.getElementById('show-uniqueFeature-custom').checked,
    uniqueFeatures: document.getElementById('uniqueFeatures').value.split(',').map(item => item.trim()),
    showHeight: document.getElementById('show-height').checked,
    showHeightCustom: document.getElementById('show-height-custom').checked,
    heights: document.getElementById('heights').value.split(',').map(item => item.trim()),
    showBuild: document.getElementById('show-build').checked,
    showBuildCustom: document.getElementById('show-build-custom').checked,
    builds: document.getElementById('builds').value.split(',').map(item => item.trim()),
    limitDescriptionItems: document.getElementById('limit-description-items').checked,
    descriptionItemLimit: document.getElementById('description-item-limit').value,
    alwaysShowAge: document.getElementById('always-show-age').checked,
    alwaysShowGender: document.getElementById('always-show-gender').checked,
    alwaysShowRace: document.getElementById('always-show-race').checked,
    alwaysShowHairstyle: document.getElementById('always-show-hairstyle').checked,
    alwaysShowUniqueFeature: document.getElementById('always-show-uniqueFeature').checked,
    alwaysShowHeight: document.getElementById('always-show-height').checked,
    alwaysShowBuild: document.getElementById('always-show-build').checked,

    showVoice: document.getElementById('show-voice').checked,
    showAccentCustom: document.getElementById('show-accent-custom').checked,
    accents: document.getElementById('accents').value.split(',').map(item => item.trim()),
    showPitch: document.getElementById('show-pitch').checked,
    showPitchCustom: document.getElementById('show-pitch-custom').checked,
    pitches: document.getElementById('pitches').value.split(',').map(item => item.trim()),
    showForce: document.getElementById('show-force').checked,
    showForceCustom: document.getElementById('show-force-custom').checked,
    forces: document.getElementById('forces').value.split(',').map(item => item.trim()),
    showSpeed: document.getElementById('show-speed').checked,
    showSpeedCustom: document.getElementById('show-speed-custom').checked,
    speeds: document.getElementById('speeds').value.split(',').map(item => item.trim()),
    showExtras: document.getElementById('show-extras').checked,
    showExtrasCustom: document.getElementById('show-extras-custom').checked,
    extras: document.getElementById('extras').value.split(',').map(item => item.trim()),

    showMannerism: document.getElementById('show-mannerism').checked,
    showMannerismCustom: document.getElementById('show-mannerism-custom').checked,
    mannerisms: document.getElementById('mannerisms').value.split(',').map(item => item.trim()),

    showPlotHook: document.getElementById('show-plotHook').checked,
    showPlotHookCustom: document.getElementById('show-plotHook-custom').checked,
    plotHooks: document.getElementById('plotHooks').value.split(',').map(item => item.trim())
  };

  browser.storage.sync.set(settings).then(() => {
    alert('Settings saved successfully!');
  }).catch(error => {
    console.error('Error saving settings:', error);
  });
}

function loadSettings() {
  browser.storage.sync.get(null).then(settings => {
    document.getElementById('show-name').checked = settings.showName ?? false;
    document.getElementById('show-name-custom').checked = settings.showNameCustom ?? false;
    document.getElementById('use-prefix-suffix').checked = settings.usePrefixSuffix ?? false;
    document.getElementById('names-africa').checked = settings.namesAfrica ?? false;
    document.getElementById('names-asia').checked = settings.namesAsia ?? false;
    document.getElementById('names-north-america').checked = settings.namesNorthAmerica ?? false;
    document.getElementById('names-south-america').checked = settings.namesSouthAmerica ?? false;
    document.getElementById('names-europe').checked = settings.namesEurope ?? false;
    document.getElementById('names-oceania').checked = settings.namesOceania ?? false;
    document.getElementById('firstNames').value = settings.firstNames?.join(', ') ?? '';
    document.getElementById('lastNames').value = settings.lastNames?.join(', ') ?? '';

    document.getElementById('show-description').checked = settings.showDescription ?? false;
    document.getElementById('show-age').checked = settings.showAge ?? false;
    document.getElementById('show-age-custom').checked = settings.showAgeCustom ?? false;
    document.getElementById('ages').value = settings.ages?.join(', ') ?? '';
    document.getElementById('show-gender').checked = settings.showGender ?? false;
    document.getElementById('show-gender-custom').checked = settings.showGenderCustom ?? false;
    document.getElementById('genders').value = settings.genders?.join(', ') ?? '';
    document.getElementById('show-race').checked = settings.showRace ?? false;
    document.getElementById('show-race-custom').checked = settings.showRaceCustom ?? false;
    document.getElementById('races').value = settings.races?.join(', ') ?? '';
    document.getElementById('show-hairstyle').checked = settings.showHairstyle ?? false;
    document.getElementById('show-hairstyle-custom').checked = settings.showHairstyleCustom ?? false;
    document.getElementById('hairstyles').value = settings.hairstyles?.join(', ') ?? '';
    document.getElementById('show-uniqueFeature').checked = settings.showUniqueFeature ?? false;
    document.getElementById('show-uniqueFeature-custom').checked = settings.showUniqueFeatureCustom ?? false;
    document.getElementById('uniqueFeatures').value = settings.uniqueFeatures?.join(', ') ?? '';
    document.getElementById('show-height').checked = settings.showHeight ?? false;
    document.getElementById('show-height-custom').checked = settings.showHeightCustom ?? false;
    document.getElementById('heights').value = settings.heights?.join(', ') ?? '';
    document.getElementById('show-build').checked = settings.showBuild ?? false;
    document.getElementById('show-build-custom').checked = settings.showBuildCustom ?? false;
    document.getElementById('builds').value = settings.builds?.join(', ') ?? '';
    document.getElementById('limit-description-items').checked = settings.limitDescriptionItems ?? false;
    document.getElementById('description-item-limit').value = settings.descriptionItemLimit ?? 7;
    document.getElementById('always-show-age').checked = settings.alwaysShowAge ?? false;
    document.getElementById('always-show-gender').checked = settings.alwaysShowGender ?? false;
    document.getElementById('always-show-race').checked = settings.alwaysShowRace ?? false;
    document.getElementById('always-show-hairstyle').checked = settings.alwaysShowHairstyle ?? false;
    document.getElementById('always-show-uniqueFeature').checked = settings.alwaysShowUniqueFeature ?? false;
    document.getElementById('always-show-height').checked = settings.alwaysShowHeight ?? false;
    document.getElementById('always-show-build').checked = settings.alwaysShowBuild ?? false;

    document.getElementById('show-voice').checked = settings.showVoice ?? false;
    document.getElementById('show-accent-custom').checked = settings.showAccentCustom ?? false;
    document.getElementById('accents').value = settings.accents?.join(', ') ?? '';
    document.getElementById('show-pitch').checked = settings.showPitch ?? false;
    document.getElementById('show-pitch-custom').checked = settings.showPitchCustom ?? false;
    document.getElementById('pitches').value = settings.pitches?.join(', ') ?? '';
    document.getElementById('show-force').checked = settings.showForce ?? false;
    document.getElementById('show-force-custom').checked = settings.showForceCustom ?? false;
    document.getElementById('forces').value = settings.forces?.join(', ') ?? '';
    document.getElementById('show-speed').checked = settings.showSpeed ?? false;
    document.getElementById('show-speed-custom').checked = settings.showSpeedCustom ?? false;
    document.getElementById('speeds').value = settings.speeds?.join(', ') ?? '';
    document.getElementById('show-extras').checked = settings.showExtras ?? false;
    document.getElementById('show-extras-custom').checked = settings.showExtrasCustom ?? false;
    document.getElementById('extras').value = settings.extras?.join(', ') ?? '';

    document.getElementById('show-mannerism').checked = settings.showMannerism ?? false;
    document.getElementById('show-mannerism-custom').checked = settings.showMannerismCustom ?? false;
    document.getElementById('mannerisms').value = settings.mannerisms?.join(', ') ?? '';

    document.getElementById('show-plotHook').checked = settings.showPlotHook ?? false;
    document.getElementById('show-plotHook-custom').checked = settings.showPlotHookCustom ?? false;
    document.getElementById('plotHooks').value = settings.plotHooks?.join(', ') ?? '';

    updateVisibility();
  }).catch(error => {
    console.error('Error retrieving settings:', error);
  });
}

function updateVisibility() {
  // Handle main sections
  ['name', 'description', 'voice', 'mannerism-custom', 'plotHook-custom'].forEach(id => {
      const checkbox = document.getElementById(`show-${id}`);
      const content = checkbox ? checkbox.closest('.field').querySelector('.expandable-content') : null;
      if (content) {
          content.style.maxHeight = checkbox.checked ? "2000px" : "0px";
      }
  });

  // Handle sub-items within the description if the main description checkbox is checked
  if (document.getElementById('show-description').checked) {
      ['age', 'gender', 'race', 'hairstyle', 'uniqueFeature', 'height', 'build'].forEach(item => {
          const checkbox = document.getElementById(`show-${item}-custom`);
          const textArea = document.getElementById(`${item}s`);
          if (checkbox && textArea) {
              textArea.style.display = checkbox.checked ? "block" : "none";
          }
      });
  }
}

// Initialize and add event listeners on load
document.querySelectorAll('.field input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateVisibility);
});

document.addEventListener('DOMContentLoaded', updateVisibility);  // Ensure correct initial visibility

document.querySelectorAll('.field input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateVisibility);
});