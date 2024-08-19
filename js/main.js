'use strict';
// GLOBAL
function swapViews(view) {
  $spellsListView.className = 'view hidden';
  $spellDetailsView.className = 'view hidden';
  switch (view) {
    case 'spells list':
      $spellsListView.classList.remove('hidden');
      break;
    case 'spell details':
      $spellDetailsView.classList.remove('hidden');
      break;
  }
}
// NAVBAR
const $navbarSpellsListViewAnchor = document.querySelector(
  '#navbar-spells-list-view-anchor',
);
if (!$navbarSpellsListViewAnchor)
  throw new Error('$navbarSpellsListViewAnchor query failed');
$navbarSpellsListViewAnchor.addEventListener('click', () => {
  swapViews('spells list');
});
// SPELLS LIST -----------------------------------------------------------------
const $spellsListView = document.querySelector('#spells-list-view');
const $spellsListCardsDiv = document.querySelector('#spells-list-cards-div');
const $spellsListSortDropdown = document.querySelector(
  '#spells-list-sort-dropdown',
);
const $spellsListFilterBtn = document.querySelector('#spells-list-filter-btn');
const $spellsListFilterDialog = document.querySelector(
  '#spells-list-filter-dialog',
);
const $spellsListSearchSortForm = document.querySelector(
  '#spells-list-search-sort-form',
);
const $spellsListSearchInput = document.querySelector(
  '#spells-list-search-input',
);
const $spellsListFilteredCardsDiv = document.querySelector(
  '#spells-list-filtered-cards-div',
);
if (!$spellsListView) throw new Error('$spellsListView query failed');
if (!$spellsListCardsDiv) throw new Error('$spellsListCardsDiv query failed');
if (!$spellsListSortDropdown)
  throw new Error('$spellsListSortDropdown query failed');
if (!$spellsListFilterBtn) throw new Error('$spellsListFilterBtn query failed');
if (!$spellsListFilterDialog)
  throw new Error('$spellsListFilterDialog query failed');
if (!$spellsListSearchSortForm)
  throw new Error('$spellsListSearchSortForm query failed');
if (!$spellsListSearchInput)
  throw new Error('$spellsListSearchInput query failed');
if (!$spellsListFilteredCardsDiv)
  throw new Error('$spellsListFilteredCardsDiv query failed');
function randomSpellCircleColor() {
  const randInt = Math.floor(Math.random() * 7);
  switch (randInt) {
    case 0:
      return 'images/magic-circle-red.png';
    case 1:
      return 'images/magic-circle-orange.png';
    case 2:
      return 'images/magic-circle-yellow.png';
    case 3:
      return 'images/magic-circle-green.png';
    case 4:
      return 'images/magic-circle-blue.png';
    case 5:
      return 'images/magic-circle-purple.png';
    default:
      return 'images/magic-circle-pink.png';
  }
}
function levelNumberToString(level) {
  switch (level) {
    case 0:
      return 'Cantrip';
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    default:
      return level.toString() + 'th';
  }
}
function clearArray(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    delete array[i];
  }
}
let spellData;
const cardsArray = [];
const filteredArray = [];
const cardSort = {
  sort: 'name',
  filter: {
    apply: false,
    name: '',
    level: -1,
    school: 0,
  },
};
async function getAllSpellData() {
  try {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    if (!response.ok)
      throw new Error(`Fetch error. Status: ${response.status}`);
    // get spellData value
    spellData = await response.json();
  } catch (err) {
    console.error('Error:', err);
  }
}
function renderCard(spellName, spellLevel, spellUrl) {
  if (!$spellsListCardsDiv) throw new Error('$spellsListCardsDiv query failed');
  const $card = document.createElement('div');
  $card.className = 'card';
  $card.setAttribute('data-url', spellUrl);
  $card.setAttribute('data-name', spellName);
  $card.setAttribute('data-level', spellLevel.toString());
  const $topDiv = document.createElement('div');
  $topDiv.className = 'card-top-div';
  const $levelSpan = document.createElement('span');
  $levelSpan.className = 'card-level-span';
  $levelSpan.textContent = levelNumberToString(spellLevel);
  const $spellCircleDiv = document.createElement('div');
  $spellCircleDiv.className = 'spell-circle-div';
  const $spellCircleImg = document.createElement('img');
  $spellCircleImg.className = 'spell-circle-img';
  $spellCircleImg.setAttribute('src', randomSpellCircleColor());
  $spellCircleImg.setAttribute('alt', 'Spell Circle');
  const $nameDiv = document.createElement('div');
  $nameDiv.className = 'spell-card-name-div';
  const $nameSpan = document.createElement('span');
  let nameTxtCnt;
  switch (spellName) {
    case 'Antipathy/Sympathy':
      nameTxtCnt = 'Antipathy/ Sympathy';
      break;
    case 'Blindness/Deafness':
      nameTxtCnt = 'Blindness/ Deafness';
      break;
    case 'Enlarge/Reduce':
      nameTxtCnt = 'Enlarge/ Reduce';
      break;
    default:
      nameTxtCnt = spellName;
  }
  $nameSpan.textContent = nameTxtCnt;
  $nameSpan.className = 'spell-card-name-span';
  $card.appendChild($topDiv);
  $topDiv.appendChild($levelSpan);
  $card.appendChild($spellCircleDiv);
  $spellCircleDiv.appendChild($spellCircleImg);
  $card.appendChild($nameDiv);
  $nameDiv.appendChild($nameSpan);
  return $card;
}
async function renderAllCardsInitial() {
  await getAllSpellData();
  for (let i = 0; i < spellData.results.length; i++) {
    const spellInfo = spellData.results[i];
    cardsArray.push(renderCard(spellInfo.name, spellInfo.level, spellInfo.url));
  }
  sortCards('name');
}
renderAllCardsInitial();
function nameSort(a, b) {
  const firstName = a.getAttribute('data-name');
  const secondName = b.getAttribute('data-name');
  return firstName.localeCompare(secondName);
}
function numberSort(a, b) {
  return (
    Number(a.getAttribute('data-level')) - Number(b.getAttribute('data-level'))
  );
}
function sortCards(criteria) {
  if (criteria === 'name') {
    cardsArray.sort(nameSort);
    filteredArray.sort(nameSort);
  } else if (criteria === 'level') {
    cardsArray.sort(numberSort);
    filteredArray.sort(numberSort);
  }
  cardsArray.forEach((element) => {
    $spellsListCardsDiv.appendChild(element);
  });
  filteredArray.forEach((element) => {
    $spellsListFilteredCardsDiv.appendChild(element);
  });
}
$spellsListSortDropdown.addEventListener('input', () => {
  cardSort.sort = $spellsListSortDropdown.value;
  // clear cards
  while ($spellsListCardsDiv.childNodes.length > 0) {
    if (!$spellsListCardsDiv.firstElementChild) break;
    $spellsListCardsDiv.removeChild($spellsListCardsDiv.firstElementChild);
  }
  // re-render cards based on sort value
  sortCards(cardSort.sort);
});
$spellsListSearchSortForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if ($spellsListSearchInput.value) {
    cardSort.filter.name = $spellsListSearchInput.value;
    cardSort.filter.apply = true;
    filterSpellsList();
    $spellsListCardsDiv.className += ' hidden';
    $spellsListFilteredCardsDiv.classList.remove('hidden');
  } else {
    sortCards(cardSort.sort);
    $spellsListFilteredCardsDiv.className += ' hidden';
    $spellsListCardsDiv.classList.remove('hidden');
  }
});
$spellsListFilterBtn.addEventListener('click', () => {
  $spellsListFilterDialog.showModal();
});
async function filterSpellsList() {
  try {
    let apiFilterUrl = '?';
    if (cardSort.filter.name) {
      const urlName = cardSort.filter.name.replace(' ', '%20');
      apiFilterUrl += `name=${urlName}`;
    }
    if (cardSort.filter.level > -1) {
      apiFilterUrl += `&level=${cardSort.filter.level}`;
    }
    if (cardSort.filter.school) {
      apiFilterUrl += `&school=${cardSort.filter.school}`;
    }
    const response = await fetch(
      `https://www.dnd5eapi.co/api/spells${apiFilterUrl}`,
    );
    if (!response.ok) throw new Error(`Fetch error status: ${response.status}`);
    const filteredSpellData = await response.json();
    clearArray(filteredArray);
    while ($spellsListFilteredCardsDiv.childNodes.length > 0) {
      if (!$spellsListFilteredCardsDiv.firstChild) continue;
      $spellsListFilteredCardsDiv.removeChild(
        $spellsListFilteredCardsDiv.firstChild,
      );
    }
    for (let i = 0; i < filteredSpellData.count; i++) {
      const spellInfo = filteredSpellData.results[i];
      filteredArray.push(
        renderCard(spellInfo.name, spellInfo.level, spellInfo.url),
      );
    }
    filteredArray.forEach((element) => {
      $spellsListFilteredCardsDiv.appendChild(element);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}
// SPELLS LIST --> SPELL DETAILS ----------------------------------------------
// ----------------------------------------------------------------------------
const $spellDetailsView = document.querySelector('#spell-details-view');
const $spellDetailsName = document.querySelector('#spell-details-name');
const $spellDetailsLevelSchool = document.querySelector(
  '#spell-details-level-school',
);
const $spellDetailsCastTime = document.querySelector(
  '#spell-details-cast-time',
);
const $spellDetailsRange = document.querySelector('#spell-details-range');
const $spellDetailsComponents = document.querySelector(
  '#spell-details-components',
);
const $spellDetailsDuration = document.querySelector('#spell-details-duration');
const $spellDetailsDescriptionDiv = document.querySelector(
  '#spell-details-description-div',
);
const $spellDetailsHigherLevelDiv = document.querySelector(
  '#spell-details-higher-levels-div',
);
const $spellDetailsClasses = document.querySelector('#spell-details-classes');
const $spellDetailsSubclasses = document.querySelector(
  '#spell-details-subclasses',
);
if (!$spellDetailsView) throw new Error('$spellDetailsView query failed');
if (!$spellDetailsName) throw new Error('$spellDetailsName query failed');
if (!$spellDetailsLevelSchool)
  throw new Error('$spellDetailsLevelSchool query failed');
if (!$spellDetailsCastTime)
  throw new Error('$spellDetailsCastTime query failed');
if (!$spellDetailsRange) throw new Error('$spellDetailsRange query failed');
if (!$spellDetailsComponents)
  throw new Error('$spellDetailsComponents query failed');
if (!$spellDetailsDuration)
  throw new Error('$spellDetailsDuration query failed');
if (!$spellDetailsDescriptionDiv)
  throw new Error('$spellDetailsDescriptionDiv query failed');
if (!$spellDetailsHigherLevelDiv)
  throw new Error('$spellDetailsHigherLevelDiv query failed');
if (!$spellDetailsClasses) throw new Error('$spellDetailsClasses query failed');
if (!$spellDetailsSubclasses)
  throw new Error('$spellDetailsSubclasses query failed');
function generateFullSubclassName(subclass) {
  switch (subclass) {
    case 'Berserker':
      return 'Barbarian Path of the Berserker';
    case 'Champion':
      return 'Fighter Champion Archetype';
    case 'Devotion':
      return 'Paladin Oath of Devotion';
    case 'Draconic':
      return 'Sorcerer Draconic Bloodline';
    case 'Evocation':
      return 'Wizard School of Evocation';
    case 'Fiend':
      return 'Warlock Fiend Patron';
    case 'Hunter':
      return 'Ranger Hunter Archetype';
    case 'Land':
      return 'Druid Circle of the Land';
    case 'Life':
      return 'Cleric Life Domain';
    case 'Lore':
      return 'Bard College of Lore';
    case 'Open Hand':
      return 'Monk Way of the Open Hand';
    case 'Thief':
      return 'Rogue Thief Archetype';
    default:
      return '';
  }
}
let spellDetails;
$spellsListView.addEventListener('click', async (event) => {
  try {
    const $target = event.target;
    const $targetCard = $target.closest('div.card');
    if (!$targetCard) {
      return;
    }
    const cardSpellUrl = $targetCard.getAttribute('data-url');
    $spellsListView.className += ' hidden';
    if (!cardSpellUrl) throw new Error('cardSpellUrl does not exist');
    await getSpellDetails(cardSpellUrl);
    // NAME
    $spellDetailsName.textContent = spellDetails.name;
    // LEVEL, SCHOOL
    $spellDetailsLevelSchool.textContent = levelNumberToString(
      spellDetails.level,
    );
    if (spellDetails.level !== 0) {
      $spellDetailsLevelSchool.textContent += ' Level ';
    } else {
      $spellDetailsLevelSchool.textContent += ' ';
    }
    $spellDetailsLevelSchool.textContent += spellDetails.school.name;
    // CAST TIME
    $spellDetailsCastTime.textContent = spellDetails.casting_time;
    // RANGE
    $spellDetailsRange.textContent = spellDetails.range;
    // COMPONENTS
    if (spellDetails.components.length === 1) {
      $spellDetailsComponents.textContent = spellDetails.components[0];
    } else {
      for (let i = 0; i < spellDetails.components.length; i++) {
        if (i === 0) {
          $spellDetailsComponents.textContent =
            spellDetails.components[i] + ', ';
        } else if (i < spellDetails.components.length - 1) {
          $spellDetailsComponents.textContent +=
            spellDetails.components[i] + ', ';
        } else {
          $spellDetailsComponents.textContent += spellDetails.components[i];
        }
      }
    }
    // DURATION
    $spellDetailsDuration.textContent = spellDetails.duration;
    // CLEAR DESCRIPTIONS
    while ($spellDetailsDescriptionDiv.childNodes.length > 0) {
      if (!$spellDetailsDescriptionDiv.firstElementChild) break;
      $spellDetailsDescriptionDiv.removeChild(
        $spellDetailsDescriptionDiv.firstElementChild,
      );
    }
    // ADD DESCRIPTIONS
    for (let i = 0; i < spellDetails.desc.length; i++) {
      const $descPar = document.createElement('div');
      $descPar.textContent = spellDetails.desc[i];
      $spellDetailsDescriptionDiv.appendChild($descPar);
    }
    // CLEAR HIGHER LEVELS
    while ($spellDetailsHigherLevelDiv.childNodes.length > 0) {
      if (!$spellDetailsHigherLevelDiv.firstElementChild) break;
      $spellDetailsHigherLevelDiv.removeChild(
        $spellDetailsHigherLevelDiv.firstElementChild,
      );
    }
    // ADD HIGHER LEVELS
    if (spellDetails.higher_level.length > 0) {
      const $labelSpan = document.createElement('span');
      $labelSpan.textContent = 'At Higher Levels: ';
      $labelSpan.setAttribute('style', 'font-weight: 700');
      const $textSpan = document.createElement('span');
      $textSpan.textContent = spellDetails.higher_level[0];
      $spellDetailsHigherLevelDiv.appendChild($labelSpan);
      $spellDetailsHigherLevelDiv.appendChild($textSpan);
    }
    // CLASSES
    if (spellDetails.classes.length === 1) {
      $spellDetailsClasses.textContent = spellDetails.classes[0].name;
    } else {
      for (let i = 0; i < spellDetails.classes.length; i++) {
        if (i === 0) {
          $spellDetailsClasses.textContent =
            spellDetails.classes[i].name + ', ';
        } else if (i < spellDetails.classes.length - 1) {
          $spellDetailsClasses.textContent +=
            spellDetails.classes[i].name + ', ';
        } else {
          $spellDetailsClasses.textContent += spellDetails.classes[i].name;
        }
      }
    }
    // SUBCLASSES
    if (spellDetails.subclasses.length === 0) {
      $spellDetailsSubclasses.textContent = 'none';
    } else if (spellDetails.subclasses.length === 1) {
      $spellDetailsSubclasses.textContent = generateFullSubclassName(
        spellDetails.subclasses[0].name,
      );
    } else {
      for (let i = 0; i < spellDetails.subclasses.length; i++) {
        if (i === 0) {
          $spellDetailsSubclasses.textContent =
            generateFullSubclassName(spellDetails.subclasses[i].name) + ', ';
        } else if (i < spellDetails.subclasses.length - 1) {
          $spellDetailsSubclasses.textContent +=
            generateFullSubclassName(spellDetails.subclasses[i].name) + ', ';
        } else {
          $spellDetailsSubclasses.textContent += generateFullSubclassName(
            spellDetails.subclasses[i].name,
          );
        }
      }
    }
    swapViews('spell details');
  } catch (err) {
    console.error('Error:', err);
  }
});
async function getSpellDetails(spellUrl) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co${spellUrl}`);
    if (!response.ok)
      throw new Error(`Fetch error. Status: ${response.status}`);
    spellDetails = await response.json();
  } catch (err) {
    console.error('Error:', err);
  }
}
// SPELL DETAILS --> SPELLS LIST -----------------------------------------------
// ----------------------------------------------------------------------------
const $spellDetailsBackAnchor = document.querySelector(
  '#spell-details-back-anchor',
);
if (!$spellDetailsBackAnchor)
  throw new Error('$spellDetailsBackAnchor query failed');
$spellDetailsBackAnchor.addEventListener('click', () => {
  swapViews('spells list');
});
