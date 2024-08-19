// GLOBAL

function swapViews(view: string): void {
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

// NAVBAR ---------------------------------------------------------------------
// ----------------------------------------------------------------------------

const $navbarSpellsListViewAnchor = document.querySelector(
  '#navbar-spells-list-view-anchor',
) as HTMLAnchorElement;

if (!$navbarSpellsListViewAnchor)
  throw new Error('$navbarSpellsListViewAnchor query failed');

$navbarSpellsListViewAnchor.addEventListener('click', () => {
  swapViews('spells list');
});

// SPELLS LIST ----------------------------------------------------------------
// ----------------------------------------------------------------------------

const $spellsListView = document.querySelector(
  '#spells-list-view',
) as HTMLDivElement;
const $spellsListCardsDiv = document.querySelector(
  '#spells-list-cards-div',
) as HTMLDivElement;
const $spellsListSortDropdown = document.querySelector(
  '#spells-list-sort-dropdown',
) as HTMLSelectElement;
const $spellsListFilterBtn = document.querySelector(
  '#spells-list-filter-btn',
) as HTMLButtonElement;
const $spellsListFilterDialog = document.querySelector(
  '#spells-list-filter-dialog',
) as HTMLDialogElement;
const $spellsListSearchSortForm = document.querySelector(
  '#spells-list-search-sort-form',
) as HTMLFormElement;
const $spellsListSearchInput = document.querySelector(
  '#spells-list-search-input',
) as HTMLInputElement;
const $spellsListFilteredCardsDiv = document.querySelector(
  '#spells-list-filtered-cards-div',
) as HTMLDivElement;
const $cancelFilterBtn = document.querySelector(
  '#cancel-filter-btn',
) as HTMLButtonElement;
const $clearFilterBtn = document.querySelector(
  '#clear-filter-btn',
) as HTMLButtonElement;
const $spellsListFilterForm = document.querySelector(
  '#spells-list-filter-form',
) as HTMLFormElement;
const $spellsListFilterNameInput = document.querySelector(
  '#spells-list-filter-name-input',
) as HTMLInputElement;
const $spellsListFilterLevelSelect = document.querySelector(
  '#spells-list-filter-level-select',
) as HTMLSelectElement;
const $spellsListFilterSchoolSelect = document.querySelector(
  '#spells-list-filter-school-select',
) as HTMLSelectElement;

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

// generates random spell circle url
function randomSpellCircleColor(): string {
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
function levelNumberToString(level: number): string {
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

function switchCardsList(list: string): void {
  if (list === 'all cards') {
    if (!$spellsListFilteredCardsDiv.className.includes('hidden')) {
      $spellsListFilteredCardsDiv.className += ' hidden';
    }
    if ($spellsListCardsDiv.className.includes('hidden')) {
      $spellsListCardsDiv.classList.remove('hidden');
    }
  } else if (list === 'filtered cards') {
    if (!$spellsListCardsDiv.className.includes('hidden')) {
      $spellsListCardsDiv.className += ' hidden';
    }
    if ($spellsListFilteredCardsDiv.className.includes('hidden')) {
      $spellsListFilteredCardsDiv.classList.remove('hidden');
    }
  }
}

interface GeneralSpell {
  index: string;
  name: string;
  level: number;
  url: string;
}

interface AllSpells {
  count: number;
  results: GeneralSpell[];
}

let spellData: AllSpells;

const cardsArray: HTMLDivElement[] = [];
let filteredArray: HTMLDivElement[] = [];

const cardSort = {
  sort: 'name',
  filter: {
    name: '',
    level: -1,
    school: '',
  },
};

// function to query the api for the general list of all spells
async function getAllSpellData(): Promise<void> {
  try {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    if (!response.ok)
      throw new Error(`Fetch error. Status: ${response.status}`);

    // get spellData value
    spellData = (await response.json()) as AllSpells;
  } catch (err) {
    console.error('Error:', err);
  }
}

// function that will render a spell card
function renderCard(
  spellName: string,
  spellLevel: number,
  spellUrl: string,
): HTMLDivElement {
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
  let nameTxtCnt: string;
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
async function renderAllCardsInitial(): Promise<void> {
  await getAllSpellData();

  for (let i = 0; i < spellData.results.length; i++) {
    const spellInfo = spellData.results[i];
    cardsArray.push(renderCard(spellInfo.name, spellInfo.level, spellInfo.url));
  }

  sortCards('name');
}

renderAllCardsInitial();

// an array.sort callback function to sort cards by their data-name attribute
function nameSort(a: HTMLDivElement, b: HTMLDivElement): number {
  const firstName = a.getAttribute('data-name') as string;
  const secondName = b.getAttribute('data-name') as string;
  return firstName.localeCompare(secondName);
}

// an array.sort callback function to sort cards by their data-level attribute
function numberSort(a: HTMLDivElement, b: HTMLDivElement): number {
  return (
    Number(a.getAttribute('data-level')) - Number(b.getAttribute('data-level'))
  );
}

// a function that will sort the cards in both the all cards array and the
// filtered cards array
function sortCards(criteria: string): void {
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

// event listener for when the sort order is changed
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

// event listener for when the search bar is submitted
$spellsListSearchSortForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  if ($spellsListSearchInput.value) {
    cardSort.filter.name = $spellsListSearchInput.value;
    $spellsListFilterNameInput.value = cardSort.filter.name;
    filterSpellsList();
    switchCardsList('filtered cards');
  } else {
    sortCards(cardSort.sort);
    switchCardsList('all cards');
  }
});

// event listener for when the 'filter' button is clicked
$spellsListFilterBtn.addEventListener('click', () => {
  $spellsListFilterDialog.showModal();
});

/* function to query the api for a filter endpoint, and render those cards to
 the filtered cards array */
// the filtered cards div is cleared before the new cards are added in
async function filterSpellsList(): Promise<void> {
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
    const response = await fetch(
      `https://www.dnd5eapi.co/api/spells${apiFilterUrl}`,
    );

    if (!response.ok) throw new Error(`Fetch error status: ${response.status}`);

    const filteredSpellData = await response.json();

    filteredArray = [];

    // clears the filtered cards div
    while ($spellsListFilteredCardsDiv.childNodes.length > 0) {
      if (!$spellsListFilteredCardsDiv.firstChild) continue;
      $spellsListFilteredCardsDiv.removeChild(
        $spellsListFilteredCardsDiv.firstChild,
      );
    }

    // renders cards into the filtered cards array
    for (let i = 0; i < filteredSpellData.count; i++) {
      const spellInfo = filteredSpellData.results[i];
      filteredArray.push(
        renderCard(spellInfo.name, spellInfo.level, spellInfo.url),
      );
    }
    // appends cards into the filtered cards div
    filteredArray.forEach((element) => {
      $spellsListFilteredCardsDiv.appendChild(element);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

// resets the filter form when the 'reset filters' button is clicked,
// then switches to the all cards view
$clearFilterBtn.addEventListener('click', () => {
  $spellsListFilterForm.reset();
  $spellsListSearchInput.value = '';
  cardSort.filter = {
    name: '',
    level: -1,
    school: '',
  };
  $spellsListFilterDialog.close();
  switchCardsList('all cards');
});

// resets the filter form to previous state when the 'cancel' button is clicked
$cancelFilterBtn.addEventListener('click', () => {
  $spellsListFilterDialog.close();
  $spellsListFilterNameInput.value = cardSort.filter.name;
  $spellsListFilterLevelSelect.value = cardSort.filter.level.toString();
  $spellsListFilterSchoolSelect.value = cardSort.filter.school;
});

// event listener for filter spells form
$spellsListFilterForm.addEventListener('submit', async (event: Event) => {
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
      switchCardsList('all cards');
      return;
    }

    // if the filter form is not empty, it will filter the spells and
    // switch to the filtered list
    await filterSpellsList();
    switchCardsList('filtered cards');
  } catch (err) {
    console.error('Error:', err);
  }
});

// SPELLS LIST --> SPELL DETAILS ----------------------------------------------
// ----------------------------------------------------------------------------

const $spellDetailsView = document.querySelector(
  '#spell-details-view',
) as HTMLDivElement;
const $spellDetailsName = document.querySelector(
  '#spell-details-name',
) as HTMLHeadElement;
const $spellDetailsLevelSchool = document.querySelector(
  '#spell-details-level-school',
) as HTMLSpanElement;
const $spellDetailsCastTime = document.querySelector(
  '#spell-details-cast-time',
) as HTMLSpanElement;
const $spellDetailsRange = document.querySelector(
  '#spell-details-range',
) as HTMLSpanElement;
const $spellDetailsComponents = document.querySelector(
  '#spell-details-components',
) as HTMLSpanElement;
const $spellDetailsDuration = document.querySelector(
  '#spell-details-duration',
) as HTMLSpanElement;
const $spellDetailsDescriptionDiv = document.querySelector(
  '#spell-details-description-div',
) as HTMLDivElement;
const $spellDetailsHigherLevelDiv = document.querySelector(
  '#spell-details-higher-levels-div',
) as HTMLDivElement;
const $spellDetailsClasses = document.querySelector(
  '#spell-details-classes',
) as HTMLSpanElement;
const $spellDetailsSubclasses = document.querySelector(
  '#spell-details-subclasses',
) as HTMLSpanElement;

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

interface SpellDetails {
  name: string;
  level: number;
  school: {
    name: string;
  };
  casting_time: string;
  range: string;
  components: string[];
  duration: string;
  desc: string[];
  higher_level: string[] | null[];
  classes: { name: string }[];
  subclasses: { name: string }[];
}

function generateFullSubclassName(subclass: string): string {
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

let spellDetails: SpellDetails;

$spellsListView.addEventListener('click', async (event: Event) => {
  try {
    const $target = event.target as HTMLElement;

    const $targetCard = $target.closest('div.card') as HTMLDivElement;

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

async function getSpellDetails(spellUrl: string): Promise<void> {
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
) as HTMLAnchorElement;

if (!$spellDetailsBackAnchor)
  throw new Error('$spellDetailsBackAnchor query failed');

$spellDetailsBackAnchor.addEventListener('click', () => {
  swapViews('spells list');
});
