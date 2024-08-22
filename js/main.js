'use strict';
/* global spellbookData */
let spellData;
// function to query the api for the general list of all spells
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
function swapViews(view) {
  $spellsListView.classList.add('hidden');
  $spellDetailsView.classList.add('hidden');
  $spellbookFormView.classList.add('hidden');
  switch (view) {
    case 'spells list':
      $spellsListView.classList.remove('hidden');
      break;
    case 'spell details':
      $spellDetailsView.classList.remove('hidden');
      break;
    case 'spellbook form':
      $spellbookFormView.classList.remove('hidden');
      break;
  }
}
async function toSpellsList() {
  try {
    cardSort.spellbook = null;
    await filterSpellsList();
    $spellsListHeader.textContent = 'Spells List';
    $spellbookClassLevelHeader.textContent = '';
    resetFilter();
    $spellbookSettingsBtn.classList.add('hidden');
    swapViews('spells list');
  } catch (err) {
    console.error('Error:', err);
  }
}
async function toSpellbook(bookName, bookId) {
  try {
    cardSort.spellbook = { name: bookName, id: bookId };
    await filterSpellsList();
    $spellsListHeader.textContent = bookName;
    const spellbook = spellbookData.spellbooks.find(
      (book) => book.name === bookName,
    );
    let className = spellbook?.class;
    const classLevel = spellbook?.classLevel?.toString();
    if (className) {
      const firstLetter = className.charAt(0).toUpperCase();
      const remainingLetters = className.substring(1);
      className = firstLetter + remainingLetters;
      $spellbookClassLevelHeader.textContent =
        '- ' + className + ' Lvl ' + classLevel;
    } else {
      $spellbookClassLevelHeader.textContent = '';
    }
    resetFilter();
    $spellbookSettingsBtn.classList.remove('hidden');
    swapViews('spells list');
  } catch (err) {
    console.error('Error:', err);
  }
}
function classSpellAccess(className, classLevel) {
  if (
    className === 'cleric' ||
    className === 'druid' ||
    className === 'sorcerer' ||
    className === 'wizard'
  ) {
    if (classLevel <= 18) {
      return Math.ceil(classLevel / 2);
    } else {
      return 9;
    }
  } else if (className === 'paladin' || className === 'ranger') {
    if (classLevel === 1) {
      return 0;
    } else {
      return Math.ceil(classLevel / 4);
    }
  } else if (className === 'warlock') {
    if (classLevel <= 10) {
      return Math.ceil(classLevel / 2);
    } else {
      return 5;
    }
  } else {
    return 0;
  }
}
function clickOffModalClose(target, modal) {
  if (!target.closest('.collision-div') && !target.matches('.collision-div')) {
    modal.close();
  }
}
function indexOfSpellbookById(id) {
  const index = spellbookData.spellbooks.indexOf(
    spellbookData.spellbooks.find((book) => book.id === id),
  );
  return index;
}
function reSortSpellbookLinks() {
  const bookLinkArr = Array.from($menuSpellbooksUl.children);
  bookLinkArr.sort((a, b) => {
    const firstName = a.textContent;
    const secondName = b.textContent;
    return firstName.localeCompare(secondName);
  });
  bookLinkArr.forEach((element) => {
    $menuSpellbooksUl.appendChild(element);
  });
}
const classAbilities = {
  bard: 'Charisma',
  cleric: 'Wisdom',
  druid: 'Wisdom',
  paladin: 'Charisma',
  ranger: 'Wisdom',
  sorcerer: 'Charisma',
  warlock: 'Charisma',
  wizard: 'Intelligence',
};
// NAVBAR =====================================================================
// ============================================================================
const $navbarSpellsListViewAnchor = document.querySelector(
  '#navbar-spells-list-view-anchor',
);
const $navbarNewSpellbookBtn = document.querySelector(
  '#navbar-new-spellbook-btn',
);
if (!$navbarSpellsListViewAnchor)
  throw new Error('$navbarSpellsListViewAnchor query failed');
if (!$navbarNewSpellbookBtn)
  throw new Error('$navbarNewSpellbookBtn query failed');
$navbarSpellsListViewAnchor.addEventListener('click', () => {
  toSpellsList();
});
$navbarNewSpellbookBtn.addEventListener('click', () => {
  $spellbookForm.reset();
  $spellbookFormHeader.textContent = 'New Spellbook';
  $classLevelGroup.classList.add('hidden');
  $abilityModGroup.classList.add('hidden');
  swapViews('spellbook form');
});
// MENU =======================================================================
// ============================================================================
const $menuBtn = document.querySelector('#menu-btn');
const $menuDialog = document.querySelector('#menu-dialog');
const $closeMenuBtn = document.querySelector('#close-menu-btn');
const $menuAllSpellsAnchor = document.querySelector('#menu-all-spells-anchor');
const $menuNewSpellbookAnchor = document.querySelector(
  '#menu-new-spellbook-anchor',
);
const $menuSpellbooksUl = document.querySelector('#menu-spellbooks-ul');
if (!$menuBtn) throw new Error('$menuBtn query failed');
if (!$menuDialog) throw new Error('$menuDialog query failed');
if (!$closeMenuBtn) throw new Error('$closeMenuBtn query failed');
if (!$menuAllSpellsAnchor) throw new Error('$menuAllSpellsAnchor query failed');
if (!$menuNewSpellbookAnchor)
  throw new Error('$menuNewSpellbookAnchor query failed');
if (!$menuSpellbooksUl) throw new Error('$menuSpellbooksUl query failed');
function renderSpellbookLink(bookName, bookId) {
  const $li = document.createElement('li');
  $li.className = 'spellbook-link-li';
  const $anchor = document.createElement('a');
  $anchor.className = 'spellbook-link';
  $anchor.textContent = bookName;
  $anchor.setAttribute('data-id', bookId.toString());
  $li.appendChild($anchor);
  return $li;
}
spellbookData.spellbooks.forEach((element) => {
  const $bookLink = renderSpellbookLink(element.name, element.id);
  $menuSpellbooksUl.appendChild($bookLink);
});
$menuBtn.addEventListener('click', () => {
  $menuDialog.showModal();
});
$menuDialog.addEventListener('click', (event) => {
  const $target = event.target;
  clickOffModalClose($target, $menuDialog);
});
$closeMenuBtn.addEventListener('click', () => {
  $menuDialog.close();
});
$menuAllSpellsAnchor.addEventListener('click', () => {
  toSpellsList();
  $menuDialog.close();
});
$menuNewSpellbookAnchor.addEventListener('click', () => {
  $spellbookForm.reset();
  $spellbookFormHeader.textContent = 'New Spellbook';
  $classLevelGroup.classList.add('hidden');
  $abilityModGroup.classList.add('hidden');
  swapViews('spellbook form');
  $menuDialog.close();
});
$menuSpellbooksUl.addEventListener('click', (event) => {
  const $target = event.target;
  if (!$target.matches('.spellbook-link')) {
    return;
  }
  const targetName = $target.textContent;
  const targetId = Number($target.getAttribute('data-id'));
  if (!targetName || !targetId) return;
  $menuDialog.close();
  toSpellbook(targetName, targetId);
});
// SPELLS LIST ================================================================
// ============================================================================
const $spellsListView = document.querySelector('#spells-list-view');
const $spellsListHeader = document.querySelector('#spells-list-header');
const $spellbookClassLevelHeader = document.querySelector(
  '#spellbook-class-level-header',
);
const $spellsListCardsDiv = document.querySelector('#spells-list-cards-div');
const $noSpellsP = document.querySelector('#no-spells-p');
if (!$spellsListView) throw new Error('$spellsListView query failed');
if (!$spellsListHeader) throw new Error('$spellsListHeader query failed');
if (!$spellbookClassLevelHeader)
  throw new Error('$spellbookClassLevelHeader query failed');
if (!$spellsListCardsDiv) throw new Error('$spellsListCardsDiv query failed');
if (!$noSpellsP) throw new Error('$noSpellsP query failed');
// generates random spell circle url
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
// utility function to change level number into a user-friendly string
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
function resetFilter() {
  cardSort.filter = {
    name: '',
    level: -1,
    school: '',
  };
  $spellsListFilterForm.reset();
  $spellsListSearchSortForm.reset();
  filterSpellsList();
}
const cardsArray = [];
const cardSort = {
  spellbook: null,
  managing: null,
  sort: 'name',
  filter: {
    name: '',
    level: -1,
    school: '',
  },
};
// function that will render a spell card
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
  const $toggleIncludeBtn = document.createElement('button');
  $toggleIncludeBtn.className = 'toggle-include add hidden';
  $toggleIncludeBtn.setAttribute('data-include', '');
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
// a function that will run once at the beginning to get all the spell data,
// render all the cards to an array, and append that array to the DOM
async function renderAllCardsInitial() {
  await getAllSpellData();
  for (let i = 0; i < spellData.results.length; i++) {
    const spellInfo = spellData.results[i];
    cardsArray.push(renderCard(spellInfo.name, spellInfo.level, spellInfo.url));
  }
  sortCards('name');
}
renderAllCardsInitial();
// SPELLBOOK SETTINGS =========================================================
const $spellbookSettingsBtn = document.querySelector('#spellbook-settings-btn');
const $spellbookSettingsDialog = document.querySelector(
  '#spellbook-settings-dialog',
);
const $editSpellbookBtn = document.querySelector('#edit-spellbook-btn');
const $deleteSpellbookBtn = document.querySelector('#delete-spellbook-btn');
const $closeSpellbookSettingsBtn = document.querySelector(
  '#close-spellbook-settings-btn',
);
const $confirmDeleteDialog = document.querySelector('#confirm-delete-dialog');
const $confirmDeleteSpellbookNameSpan = document.querySelector(
  '#confirm-delete-spellbook-name-span',
);
const $cancelDeleteBtn = document.querySelector('#cancel-delete-btn');
const $confirmDeleteBtn = document.querySelector('#confirm-delete-btn');
if (!$spellbookSettingsBtn)
  throw new Error('$spellbookSettingsBtn query failed');
if (!$spellbookSettingsDialog)
  throw new Error('$spellbookSettingsDialog query failed');
if (!$editSpellbookBtn) throw new Error('$editSpellbookBtn query failed');
if (!$deleteSpellbookBtn) throw new Error('$deleteSpellbookBtn query failed');
if (!$closeSpellbookSettingsBtn)
  throw new Error('$closeSpellbookSettingsBtn query failed');
if (!$confirmDeleteDialog) throw new Error('$confirmDeleteDialog query failed');
if (!$confirmDeleteSpellbookNameSpan)
  throw new Error('$confirmDeleteSpellbookNameSpan query failed');
if (!$cancelDeleteBtn) throw new Error('$cancelDeleteBtn query failed');
if (!$confirmDeleteBtn) throw new Error('$confirmDeleteBtn query failed');
$spellbookSettingsBtn.addEventListener('click', () => {
  $spellbookSettingsDialog.showModal();
});
$spellbookSettingsDialog.addEventListener('click', (event) => {
  const $target = event.target;
  clickOffModalClose($target, $spellbookSettingsDialog);
});
$editSpellbookBtn.addEventListener('click', () => {
  spellbookData.editing = spellbookData.spellbooks.find(
    (item) => item.id === cardSort.spellbook?.id,
  );
  const editing = spellbookData.editing;
  $spellbookFormHeader.textContent = 'Edit ' + editing.name;
  $spellbookNameInput.value = spellbookData.editing.name;
  if (
    editing.class &&
    editing.classLevel &&
    (editing.modifier || editing.modifier === 0)
  ) {
    $classSelect.value = editing.class;
    $classLevelGroup.classList.remove('hidden');
    $classLevelSelect.value = editing.classLevel.toString();
    $abilityModGroup.classList.remove('hidden');
    $abilityModLabel.textContent =
      classAbilities[$classSelect.value] + ' Modifier:';
    $abilityModSelect.value = editing.modifier.toString();
  }
  $spellbookSettingsDialog.close();
  swapViews('spellbook form');
});
$deleteSpellbookBtn.addEventListener('click', () => {
  $spellbookSettingsDialog.close();
  $confirmDeleteDialog.showModal();
});
$cancelDeleteBtn.addEventListener('click', () => {
  $confirmDeleteDialog.close();
});
$confirmDeleteBtn.addEventListener('click', () => {
  if (!cardSort.spellbook?.id) return;
  const deleteIndex = indexOfSpellbookById(cardSort.spellbook.id);
  spellbookData.spellbooks.splice(deleteIndex, 1);
  writeData();
  $menuSpellbooksUl.children[deleteIndex].remove();
  reSortSpellbookLinks();
  $confirmDeleteDialog.close();
  toSpellsList();
});
$closeSpellbookSettingsBtn.addEventListener('click', () => {
  $spellbookSettingsDialog.close();
});
// SPELLBOOK MANAGEMENT =======================================================
// SEARCH/SORT/FILTER =========================================================
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
const $cancelFilterBtn = document.querySelector('#cancel-filter-btn');
const $clearFilterBtn = document.querySelector('#clear-filter-btn');
const $spellsListFilterForm = document.querySelector(
  '#spells-list-filter-form',
);
const $spellsListFilterNameInput = document.querySelector(
  '#spells-list-filter-name-input',
);
const $spellsListFilterLevelSelect = document.querySelector(
  '#spells-list-filter-level-select',
);
const $spellsListFilterSchoolSelect = document.querySelector(
  '#spells-list-filter-school-select',
);
if (!$spellsListSortDropdown)
  throw new Error('$spellsListSortDropdown query failed');
if (!$spellsListFilterBtn) throw new Error('$spellsListFilterBtn query failed');
if (!$spellsListFilterDialog)
  throw new Error('$spellsListFilterDialog query failed');
if (!$spellsListSearchSortForm)
  throw new Error('$spellsListSearchSortForm query failed');
if (!$spellsListSearchInput)
  throw new Error('$spellsListSearchInput query failed');
if (!$cancelFilterBtn) throw new Error('$cancelFilterBtn query failed');
if (!$clearFilterBtn) throw new Error('$clearFilterBtn query failed');
if (!$spellsListFilterForm)
  throw new Error('$spellsListFilterForm query failed');
if (!$spellsListFilterNameInput)
  throw new Error('$spellsListFilterNameInput query failed');
if (!$spellsListFilterLevelSelect)
  throw new Error('$spellsListFilterLevelSelect query failed');
if (!$spellsListFilterSchoolSelect)
  throw new Error('$spellsListFilterSchoolSelect query failed');
if (!$noSpellsP) throw new Error('$noSpellsP query failed');
// a function that will sort the cards in both the all cards array and the
// filtered cards array
function sortCards(criteria) {
  if (criteria === 'name') {
    cardsArray.sort((a, b) => {
      const firstName = a.getAttribute('data-name');
      const secondName = b.getAttribute('data-name');
      return firstName.localeCompare(secondName);
    });
  } else if (criteria === 'level') {
    cardsArray.sort(
      (a, b) =>
        Number(a.getAttribute('data-level')) -
        Number(b.getAttribute('data-level')),
    );
  }
  cardsArray.forEach((element) => {
    $spellsListCardsDiv.appendChild(element);
  });
}
// event listener for when the sort order is changed
$spellsListSortDropdown.addEventListener('input', () => {
  // get the sort value from the dropdown
  cardSort.sort = $spellsListSortDropdown.value;
  // re-render cards based on sort value
  sortCards(cardSort.sort);
});
// event listener for when the search bar is submitted
$spellsListSearchSortForm.addEventListener('submit', (event) => {
  event.preventDefault();
  cardSort.filter.name = $spellsListSearchInput.value;
  $spellsListFilterNameInput.value = cardSort.filter.name;
  filterSpellsList();
});
// event listener for when the 'filter' button is clicked
$spellsListFilterBtn.addEventListener('click', () => {
  $spellsListFilterDialog.showModal();
});
/* function to query the api for a filter endpoint, and show or hide cards in
the card array depending on if its name is returned from the fetch */
async function filterSpellsList() {
  try {
    // creates an endpoint url for the fetch command
    // based on the values in the cardSort object
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
    let filteredSpellData;
    // checks if the filter url has any arguments
    // if it doesn't sets the filtered spells as all spells
    // if it does it will query the api and set the response to filtered spells
    if (apiFilterUrl === '?') {
      filteredSpellData = spellData;
    } else {
      const response = await fetch(
        `https://www.dnd5eapi.co/api/spells${apiFilterUrl}`,
      );
      if (!response.ok)
        throw new Error(`Fetch error status: ${response.status}`);
      filteredSpellData = await response.json();
    }
    // loops through the filtered spells object and stores all the names in
    // a new array
    const filteredSpellNames = [];
    filteredSpellData.results.forEach((element) => {
      filteredSpellNames.push(element.name);
    });
    let spellbookViewing;
    const spellbookSpellNames = [];
    const classSpellNames = [];
    const managingClass = spellbookData.spellbooks.find(
      (book) => book.id === cardSort.managing?.id,
    )?.class;
    if (cardSort.managing) {
      if (managingClass) {
        const response = await fetch(
          `https://www.dnd5eapi.co/classes/${managingClass}/spells`,
        );
        if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
        const classSpellsObj = await response.json();
        classSpellsObj.results.forEach((element) => {
          classSpellNames.push(element.name);
        });
      }
      spellbookViewing = spellbookData.spellbooks.find(
        (book) => book.name === cardSort.spellbook?.name,
      );
      spellbookViewing.spells.forEach((element) => {
        spellbookSpellNames.push(element);
      });
    } else if (cardSort.spellbook) {
      spellbookViewing = spellbookData.spellbooks.find(
        (book) => book.name === cardSort.spellbook?.name,
      );
      spellbookViewing.spells.forEach((element) => {
        spellbookSpellNames.push(element);
      });
    }
    // loops through the card array and shows or hides depending if its name
    // is included in the array of names
    cardsArray.forEach((element) => {
      const elementName = element.getAttribute('data-name');
      if (!elementName) return;
      if (cardSort.managing) {
        if (managingClass) {
          if (
            filteredSpellNames.includes(elementName) &&
            classSpellNames.includes(elementName)
          ) {
            element.classList.remove('hidden');
          } else {
            element.classList.add('hidden');
          }
        } else {
          element.classList.remove('hidden');
        }
      } else if (cardSort.spellbook) {
        if (
          filteredSpellNames.includes(elementName) &&
          spellbookSpellNames.includes(elementName)
        ) {
          element.classList.remove('hidden');
        } else {
          element.classList.add('hidden');
        }
      } else if (filteredSpellNames.includes(elementName)) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    });
    // loops through the cards to check if they are all hidden
    let allHidden = true;
    for (let i = 0; i < cardsArray.length; i++) {
      if (!cardsArray[i].classList.contains('hidden')) {
        allHidden = false;
        break;
      }
    }
    // displays a message if all the cards are hidden
    if (allHidden) {
      $noSpellsP.classList.remove('hidden');
    } else {
      $noSpellsP.classList.add('hidden');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
// resets the filter form when the 'reset filters' button is clicked,
// then shows all the cards
$clearFilterBtn.addEventListener('click', () => {
  $spellsListFilterForm.reset();
  $spellsListSearchInput.value = '';
  cardSort.filter = {
    name: '',
    level: -1,
    school: '',
  };
  filterSpellsList();
  $spellsListFilterDialog.close();
});
// resets the filter form to previous state when the 'cancel' button is clicked
$cancelFilterBtn.addEventListener('click', () => {
  $spellsListFilterDialog.close();
  $spellsListFilterNameInput.value = cardSort.filter.name;
  $spellsListFilterLevelSelect.value = cardSort.filter.level.toString();
  $spellsListFilterSchoolSelect.value = cardSort.filter.school;
});
// event listener for filter spells form
$spellsListFilterForm.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();
    // store form values in the cardSort object
    cardSort.filter.name = $spellsListFilterNameInput.value;
    cardSort.filter.level = Number($spellsListFilterLevelSelect.value);
    cardSort.filter.school = $spellsListFilterSchoolSelect.value;
    $spellsListSearchInput.value = cardSort.filter.name;
    $spellsListFilterDialog.close();
    // switches to the all spells list if the filter form is empty,
    // then returns from the function
    if (
      !cardSort.filter.name &&
      cardSort.filter.level < 0 &&
      !cardSort.filter.school
    ) {
      return;
    }
    // if the filter form is not empty, it will filter the spells and
    // switch to the filtered list
    await filterSpellsList();
  } catch (err) {
    console.error('Error:', err);
  }
});
// SPELLS LIST --> SPELL DETAILS ==============================================
// ============================================================================
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
    $spellsListView.classList.add('hidden');
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
// SPELL DETAILS --> SPELLS LIST ==============================================
// ============================================================================
const $spellDetailsBackAnchor = document.querySelector(
  '#spell-details-back-anchor',
);
if (!$spellDetailsBackAnchor)
  throw new Error('$spellDetailsBackAnchor query failed');
$spellDetailsBackAnchor.addEventListener('click', () => {
  swapViews('spells list');
});
// SPELLBOOK FORM =============================================================
// ============================================================================
const $spellbookFormView = document.querySelector('#spellbook-form-view');
const $spellbookForm = document.querySelector('#spellbook-form');
const $spellbookFormHeader = document.querySelector('#spellbook-form-header');
const $spellbookNameInput = document.querySelector('#spellbook-name-input');
const $classSelect = document.querySelector('#class-select');
const $classLevelGroup = document.querySelector('#class-level-group');
const $classLevelSelect = document.querySelector('#class-level-select');
const $abilityModGroup = document.querySelector('#ability-mod-group');
const $abilityModLabel = document.querySelector('#ability-mod-label');
const $abilityModSelect = document.querySelector('#ability-mod-select');
const $autofillGroupDiv = document.querySelector('#autofill-group-div');
const $autofillSpellsCheckbox = document.querySelector(
  '#autofill-spells-checkbox',
);
const $spellbookFormCancelBtn = document.querySelector(
  '#spellbook-form-cancel-btn',
);
if (!$spellbookFormView) throw new Error('$spellbookFormView query failed');
if (!$spellbookForm) throw new Error('$spellbookForm query failed');
if (!$spellbookFormHeader) throw new Error('$spellbookFormHeader query failed');
if (!$spellbookNameInput) throw new Error('$spellbookNameInput query failed');
if (!$classSelect) throw new Error('$classSelect query failed');
if (!$classLevelGroup) throw new Error('$classLevelGroup query failed');
if (!$classLevelSelect) throw new Error('$classLevelSelect query failed');
if (!$abilityModGroup) throw new Error('$abilityModGroup query failed');
if (!$abilityModLabel) throw new Error('$abilityModLabel query failed');
if (!$abilityModSelect) throw new Error('$abilityModSelect query failed');
if (!$autofillGroupDiv) throw new Error('$autofillGroupDiv query failed');
if (!$autofillSpellsCheckbox)
  throw new Error('$autofillSpellsCheckbox query failed');
if (!$spellbookFormCancelBtn)
  throw new Error('$spellbookFormCancelBtn query failed');
$classSelect.addEventListener('input', () => {
  if ($classSelect.value) {
    $classLevelGroup.classList.remove('hidden');
    $abilityModGroup.classList.remove('hidden');
  } else {
    $classLevelGroup.classList.add('hidden');
    $abilityModGroup.classList.add('hidden');
  }
  $autofillSpellsCheckbox.checked = false;
  if (!spellbookData.editing) {
    switch ($classSelect.value) {
      case 'cleric':
      case 'druid':
      case 'paladin':
      case 'ranger':
        $autofillGroupDiv.classList.remove('hidden');
        break;
      default:
        $autofillGroupDiv.classList.add('hidden');
    }
  }
  $abilityModLabel.textContent =
    classAbilities[$classSelect.value] + ' Modifier:';
});
$spellbookForm.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();
    let name;
    if (!$spellbookNameInput.value) {
      name = 'Spellbook ' + spellbookData.nextSpellbookId.toString();
    } else {
      name = $spellbookNameInput.value;
    }
    let id;
    if (!spellbookData.editing) {
      id = spellbookData.nextSpellbookId;
      spellbookData.nextSpellbookId++;
    } else {
      id = spellbookData.editing.id;
    }
    const newSpellbook = {
      name,
      id,
      spells: [],
    };
    if ($classSelect.value) {
      newSpellbook.class = $classSelect.value;
      newSpellbook.classLevel = Number($classLevelSelect.value);
      newSpellbook.modifier = Number($abilityModSelect.value);
    }
    if ($autofillSpellsCheckbox.checked) {
      await getClassSpells($classSelect.value, newSpellbook.spells);
    }
    if (spellbookData.editing) {
      newSpellbook.spells = spellbookData.editing.spells;
      const replaceIndex = spellbookData.spellbooks.indexOf(
        spellbookData.spellbooks.find(
          (spellbook) => spellbook.id === spellbookData.editing?.id,
        ),
      );
      spellbookData.spellbooks.splice(replaceIndex, 1, newSpellbook);
      spellbookData.editing = null;
    } else {
      spellbookData.spellbooks.push(newSpellbook);
      const $bookLink = renderSpellbookLink(newSpellbook.name, newSpellbook.id);
      $menuSpellbooksUl.appendChild($bookLink);
      reSortSpellbookLinks();
    }
    writeData();
    toSpellbook(newSpellbook.name, newSpellbook.id);
    $spellbookForm.reset();
    $classLevelGroup.classList.add('hidden');
    $abilityModGroup.classList.add('hidden');
  } catch (err) {
    console.error('Error:', err);
  }
});
async function getClassSpells(className, spellsArray) {
  try {
    const response = await fetch(
      `https://www.dnd5eapi.co/api/classes/${className}/spells`,
    );
    if (!response.ok) throw new Error(`Fetch error status: ${response.status}`);
    const classSpellsObj = await response.json();
    classSpellsObj.results.forEach((element) => {
      if (
        element.level > 0 &&
        element.level <=
          classSpellAccess(className, Number($classLevelSelect.value))
      ) {
        spellsArray.push(element.name);
      }
    });
  } catch (err) {
    console.error('Error:', err);
  }
}
$spellbookFormCancelBtn.addEventListener('click', () => {
  $spellbookForm.reset();
  spellbookData.editing = null;
  swapViews('spells list');
});
