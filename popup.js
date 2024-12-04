document.addEventListener('DOMContentLoaded', () => {
  loadNPCData();
  loadLastNPC();  // Load the last saved NPC
  initializeVisibility();  // Initialize visibility based on saved settings
  updateProjects();  // Update the projects section
  document.getElementById('generate-npc').addEventListener('click', generateNPC);
  document.getElementById('copy-to-clipboard').addEventListener('click', copyToClipboard);

  // Event listeners for regenerating specific parts
  document.getElementById('npc-name-label').addEventListener('click', () => regenerateSpecific('name'));
  document.getElementById('npc-description-label').addEventListener('click', () => regenerateSpecific('description'));
  document.getElementById('npc-voice-label').addEventListener('click', () => regenerateSpecific('voice'));
  document.getElementById('npc-mannerism-label').addEventListener('click', () => regenerateSpecific('mannerism'));
  document.getElementById('npc-plotHook-label').addEventListener('click', () => regenerateSpecific('plotHook'));
});

let npcData = {};

function loadNPCData() {
  // Assuming the npcData.json is stored locally within the extension
  fetch(browser.runtime.getURL('npcData.json'))
    .then(response => response.json())
    .then(data => {
      npcData = data;
    })
    .catch(error => console.error('Error loading NPC data:', error));
}

function generateNPC() {
  browser.storage.sync.get(null).then(settings => {
      // Fetch the visibility settings and generate each part of the NPC accordingly
      const npc = {
          name: settings.showName ? generateName(settings) : '',
          description: settings.showDescription ? generateDescription(settings) : '',
          voice: settings.showVoice ? generateVoice(settings) : '',
          mannerism: generateMannerism(settings),
          plotHook: generatePlotHook(settings)
      };

      // Display NPC details
      document.getElementById('npc-name').textContent = npc.name;
      document.getElementById('npc-description').textContent = npc.description;
      document.getElementById('npc-voice').textContent = npc.voice;
      document.getElementById('npc-mannerism').textContent = npc.mannerism;
      document.getElementById('npc-plotHook').textContent = npc.plotHook;

      // Save the generated NPC details for future sessions
      browser.storage.sync.set({ lastNPC: npc });
    }).catch(error => {
      console.error('Error retrieving settings:', error);
    });
}

function regenerateSpecific(part) {
  browser.storage.sync.get(null).then(settings => {
    if (settings[`show${part.charAt(0).toUpperCase() + part.slice(1)}`]) {
      switch(part) {
        case 'name':
          document.getElementById('npc-name').textContent = generateName(settings);
          break;
        case 'description':
          document.getElementById('npc-description').textContent = generateDescription(settings);
          break;
        case 'voice':
          document.getElementById('npc-voice').textContent = generateVoice(settings);
          break;
        case 'mannerism':
          document.getElementById('npc-mannerism').textContent = getRandomElement(filterAndCombineArrays(settings.mannerisms, npcData.mannerisms));
          break;
        case 'plotHook':
          document.getElementById('npc-plotHook').textContent = getRandomElement(filterAndCombineArrays(settings.plotHooks, npcData.plotHooks));
          break;
      }
    }
    // Update the lastNPC object in storage after regeneration
    browser.storage.sync.get('lastNPC').then(data => {
      const lastNPC = data.lastNPC || {};
      lastNPC[part] = document.getElementById(`npc-${part}`).textContent;
      browser.storage.sync.set({ lastNPC });
    }).catch(error => {
      console.error('Error retrieving last NPC:', error);
    });
  }).catch(error => {
    console.error('Error retrieving settings:', error);
  });
}

function generateName(settings) {
  let potentialFirstNames = [];
  let potentialLastNames = [];

  // Handle prefix and suffix if enabled
  if (settings.usePrefixSuffix) {
      potentialFirstNames.push(generateFantasyName(filterAndCombineArrays(settings.firstNamePrefix, npcData.firstNamePrefix), filterAndCombineArrays(settings.firstNameSuffix, npcData.firstNameSuffix)));
      potentialLastNames.push(generateFantasyName(filterAndCombineArrays(settings.lastNamePrefix, npcData.lastNamePrefix), filterAndCombineArrays(settings.lastNameSuffix, npcData.lastNameSuffix)));
  }

  // Handle custom names if enabled
  if (settings.showNameCustom) {
      potentialFirstNames.push(...filterAndCombineArrays(settings[`firstNames`]));
      potentialLastNames.push(...filterAndCombineArrays(settings[`lastNames`]));
  }

  // Collect names from enabled regions
  const regions = ['Africa', 'Asia', 'NorthAmerica', 'SouthAmerica', 'Europe', 'Oceania'];
  regions.forEach(region => {
      if (settings[`names${region}`]) {
          const regionFirstNames = filterAndCombineArrays(npcData[`firstNames${region}`]);
          const regionLastNames = filterAndCombineArrays(npcData[`lastNames${region}`]);

          if (regionFirstNames.length > 0) {
              potentialFirstNames.push(...regionFirstNames);
          }
          if (regionLastNames.length > 0) {
              potentialLastNames.push(...regionLastNames);
          }
      }
  });

  // Randomly select one first name and one last name from the collected potential names
  if (potentialFirstNames.length > 0) {
      const firstName = getRandomElement(potentialFirstNames);
      const lastName = potentialLastNames.length > 0 ? getRandomElement(potentialLastNames) : '';
      return `${firstName} ${lastName}`;
  }

  // Fallback if no names are available
  return "No valid names available";
}

function generateDescription(settings) {
  const descriptionConfig = [
      { key: 'ages', setting: 'showAge' },
      { key: 'genders', setting: 'showGender' },
      { key: 'races', setting: 'showRace' },
      { key: 'hairstyles', setting: 'showHairstyle' },
      { key: 'heights', setting: 'showHeight' },
      { key: 'builds', setting: 'showBuild' },
      { key: 'uniqueFeatures', setting: 'showUniqueFeature' }
  ];

  let descriptionParts = descriptionConfig.reduce((acc, { key, setting }) => {
      if (settings[setting] || settings[`${setting}Custom`]) {
        const customData = settings[`${setting}Custom`] ? settings[key] : [];
        const defaultData = settings[setting] ? npcData[key] : [];
        const data = filterAndCombineArrays(customData, defaultData);
            const element = getRandomElement(data);
            if (element && settings.limitDescriptionItems && settings[`always${setting.charAt(0).toUpperCase()+setting.slice(1)}`]) {
                acc.alwaysShow.push(element); // Only add non-empty elements
            } else if (element) {
                acc.maybeShow.push(element); // Only add non-empty elements
            }
      }
      return acc;
  }, { alwaysShow: [], maybeShow: [] });

  // Combine the always-show and maybe-show parts into a single array
  if(settings.limitDescriptionItems) {
    // Calculate the number of random items to add
    let numberOfRandomItems = settings.descriptionItemLimit - descriptionParts.alwaysShow.length;
    if (numberOfRandomItems > 0) {
        // If the limit is not reached, add random items from the maybe-show parts
        descriptionParts = [...descriptionParts.alwaysShow, getRandomElement(descriptionParts.maybeShow, numberOfRandomItems)];
    } else {
        // If the limit is reached, only show the always-show parts
        descriptionParts = descriptionParts.alwaysShow;
    }
  } else {
    descriptionParts = [...descriptionParts.alwaysShow, ...descriptionParts.maybeShow];
  }
  console.log(descriptionParts);
  return descriptionParts.flat().join(', ');
}

function generateVoice(settings) {
  const voiceConfig = [
      { key: 'accents', setting: 'showAccent' },
      { key: 'pitches', setting: 'showPitch' },
      { key: 'forces', setting: 'showForce' },
      { key: 'speeds', setting: 'showSpeed' },
      { key: 'extras', setting: 'showExtras' }
  ];

  let voiceParts = voiceConfig.reduce((acc, { key, setting }) => {
      if (settings[setting] || settings[`${setting}Custom`]) {
        const customData = settings[`${setting}Custom`] ? settings[key] : [];
        const defaultData = settings[setting] ? npcData[key] : [];
        const data = filterAndCombineArrays(customData, defaultData);
        const element = getRandomElement(data);
        if (element) {
            acc.push(element); // Only add non-empty elements
        }
      }
      return acc;
  }, []);

  return voiceParts.join(', ');
}

function generateMannerism(settings) {
  const customData = settings.showMannerismCustom ? settings.mannerisms : [];
  const defaultData = settings.showMannerism ? npcData.mannerisms : [];
  const data = filterAndCombineArrays(customData, defaultData);
  return getRandomElement(data);
}

function generatePlotHook(settings) {
  const customData = settings.showPlotHookCustom ? settings.plotHooks : [];
  const defaultData = settings.showPlotHook ? npcData.plotHooks : [];
  const data = filterAndCombineArrays(customData, defaultData);
  return getRandomElement(data);
}

function getRandomElement(array, count = 1) {
  // Check if the array is valid
  if (!array || !Array.isArray(array) || !array.length) {
    return [];
  }

  // Handle case where count is invalid or greater than array length
  if (count < 1 || count > array.length) {
    return [];
  }

  // Handle case where count is 1
  if (count === 1) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generate unique random elements
  const result = [];
  const usedIndexes = new Set();

  while (result.length < count) {
    const index = Math.floor(Math.random() * array.length);
    if (!usedIndexes.has(index)) {
      usedIndexes.add(index);
      result.push(array[index]);
    }
  }

  return result;
}


function filterAndCombineArrays(...arrays) {
  // Combine all provided arrays into a single array
  const combinedData = arrays.flat();

  // Filter out any empty or whitespace-only entries
  const filteredData = combinedData.filter(item => item && item.trim() !== '');

  // Remove duplicates by creating a Set from the filtered data
  const uniqueData = [...new Set(filteredData)];

  return uniqueData;
}

function copyToClipboard() {
  // IDs and corresponding settings for elements to check
  const elements = {
      'npc-name': 'showName',
      'npc-description': 'showDescription',
      'npc-voice': 'showVoice',
      'npc-mannerism': 'showMannerism',
      'npc-plotHook': 'showPlotHook'
  };

  browser.storage.sync.get(null).then(settings => {
      let npcText = Object.entries(elements).reduce((acc, [elementId, settingKey]) => {
        console.log(`${settingKey}Custom`);
          if (settings[settingKey] || settings[`${settingKey}Custom`]) {
              const content = document.getElementById(elementId).textContent.trim();
              if (content) {
                  acc.push(`${elementId.replace('npc-', '').replace('-', ' ').capitalize()}: ${content}`);
              }
          }
          return acc;
      }, []).join('\n');

      if (npcText) {
          navigator.clipboard.writeText(npcText)
              .then(() => alert('NPC copied to clipboard'))
              .catch(err => console.error('Error copying to clipboard:', err));
      } else {
          console.log('No content to copy.');
      }
  }).catch(error => {
    console.error('Error retrieving settings:', error);
  });
}

// Adding a helper function on String prototype for capitalization
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function loadLastNPC() {
  browser.storage.sync.get(['lastNPC', 'showAge', 'showGender', 'showRace', 'showHairstyle', 'showUniqueFeature', 'showHeight', 'showBuild']).then(data => {
      if (data.lastNPC) {
          updateNPCDisplay(data.lastNPC);
      } else {
          // If there's no saved NPC, generate a new one
          generateNPC();
      }
  }).catch(error => {
    console.error('Error retrieving settings:', error);
  });
}

function updateNPCDisplay(npc) {
  document.getElementById('npc-name').textContent = npc.name;
  document.getElementById('npc-description').textContent = npc.description;
  document.getElementById('npc-voice').textContent = npc.voice;
  document.getElementById('npc-mannerism').textContent = npc.mannerism;
  document.getElementById('npc-plotHook').textContent = npc.plotHook;
}

function initializeVisibility() {
  browser.storage.sync.get(null).then(settings => {
    setVisibility('name', settings.showName);
    setVisibility('description', settings.showDescription);
    setVisibility('voice', settings.showVoice);
    setVisibility('mannerism', settings.showMannerism, settings.showMannerismCustom);
    setVisibility('plotHook', settings.showPlotHook, settings.showPlotHookCustom);
    
    // Voice sub-items
    setVisibility('accents', settings.showAccent);
    setVisibility('pitches', settings.showPitch);
    setVisibility('forces', settings.showForce);
    setVisibility('speeds', settings.showSpeed);
    setVisibility('extras', settings.showExtras);
  }).catch(error => {
    console.error('Error retrieving settings:', error);
  });
}

function setVisibility(id, isVisible, isVisibleCustom = false) {
  const element = document.getElementById(`npc-${id}-label`);
  if (element) {
    if(isVisible || isVisibleCustom) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  }
}

function generateFantasyName(prefixes, suffixes) {
  // Helper function to pick a random element from an array
  function getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
  }

  // Helper function to check if a character is a vowel
  function isVowel(char) {
      return "aeiou".includes(char.toLowerCase());
  }

  // Helper function to check for hard consonant pairings
  function isHardConsonantPair(prefixEnd, suffixStart) {
      const hardPairs = [
          "Bf", "Bk", "Bv", "Cg", "Cn", "Cp", "Cv", "Cx", "Cz", "Db", 
          "Dc", "Df", "Dg", "Dj", "Dl", "Dn", "Dp", "Dq", "Drz", "Dk", 
          "Dt", "Dv", "Dz", "Fb", "Fc", "Fd", "Fh", "Fj", "Fk", "Fm",  
          "Fq", "Fv", "Fx", "Gf", "Gk", "Gp", "Gv", "Gx", "Hl", "Hp", 
          "Hv", "Hx", "Jb", "Jf", "Jg", "Jk", "Jl", "Jm", "Jp", "Jq", 
          "Jv", "Jx", "Kb", "Kd", "Kf", "Kg", "Kj", "Kz", "Kq", "Kx", 
          "Kv", "Lk", "Lp", "Lq", "Lv", "Lx", "Mb", "Mf", "Mg", "Mk", 
          "Ml", "Mp", "Mq", "Mv", "Mx", "Nb", "Nc", "Ndv", "Ngk", "Nf", 
          "Nj", "Nk", "Nl", "Np", "Nq", "Ns", "Ntj", "Nx", "Pv", "Pz", 
          "Qb", "Qd", "Qf", "Qk", "Ql", "Qm", "Qp", "Qv", "Qx", "Qz", 
          "Rj", "Rv", "Rz", "Sb", "Sf", "Sj", "Sq", "Sv", "Fp", "Rs",
          "Sz", "Tl", "Tm", "Tp", "Tq", "Tz", "Vb", "Vc", "Vd", "Vf", 
          "Vg", "Vk", "Vq", "Vz", "Xb", "Xc", "Xf", "Xg", "Xj", "Xl", 
          "Xm", "Xp", "Xq", "Xv", "Xz", "Zb", "Zf", "Zg", "Zk", "Zm", 
          "Zp", "Zq", "Zv"
      ];
      return hardPairs.includes(prefixEnd + suffixStart);
  }

  // Select a random prefix and suffix
  let prefix = getRandomElement(prefixes);
  let suffix = getRandomElement(suffixes);

  // Phonetic pattern adjustment:
  const prefixEnd = prefix.slice(-1);
  const suffixStart = suffix.charAt(0);

  // If the prefix ends in a vowel and the suffix starts with a vowel, adjust the suffix
  if (isVowel(prefixEnd) && isVowel(suffixStart)) {
      suffix = suffix.charAt(1) + suffix.slice(2); // Drop first letter of suffix
  } 
  // If the prefix ends in a consonant and the suffix starts with a consonant
  else if (!isVowel(prefixEnd) && !isVowel(suffixStart)) {
      // Check for hard consonant pairings
      if (isHardConsonantPair(prefixEnd, suffixStart)) {
          suffix = 'a' + suffix; // Add a connecting vowel if it's a hard consonant pairing
      }
  }

  // Combine the prefix and suffix to form the name
  const name = prefix + suffix;

  // Capitalize the first letter of the name
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function updateProjects() {
  displayFallbackContent();
  const gistUrl = 'https://gist.github.com/powerwordspill/fecde8e022c3d08505d3f7819e4b7ae6/raw';

  fetch(gistUrl)
    .then(response => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("text/plain")) {
            throw new TypeError("Invalid MIME type: " + contentType);
        }
        return response.json();
    })
    .then(data => {
      const container = document.getElementById('projects-container');
      container.innerHTML = ''; // Clear existing content
      container.innerHTML = `<p>Created by <strong>Power Word Spill</strong></p>`;
      data.projects.forEach(project => {
          const div = document.createElement('div');
          const projectName = sanitizeHTML(project.name);
          const projectDescription = sanitizeHTML(project.description);
          const projectUrl = sanitizeHTML(project.url);
          div.innerHTML = `<strong>${projectName}</strong>: <br/><a href="${projectUrl}" target="_blank" rel="noopener noreferrer">${projectDescription}</a><br/>`;
          container.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Error fetching project data:', error);
      displayFallbackContent();
    });
}

function displayFallbackContent() {
  const container = document.getElementById('projects-container');
  container.innerHTML = `
      <p>Created by <strong>Power Word Spill</strong></p>
      <p><a href="https://powerwordspill.com" target="_blank">powerwordspill.com</a></p>
      <p><a href="https://www.youtube.com/@powerwordspill" target="_blank">youtube.com/@powerwordspill</a></p>
  `;
}

function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}