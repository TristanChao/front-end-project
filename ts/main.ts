// SPELLS LIST -----------------------------------------------------------------

const $spellsListView = document.querySelector(
  '#spells-list-view',
) as HTMLDivElement;
const $spellsListCardsDiv = document.querySelector(
  '#spells-list-cards-div',
) as HTMLDivElement;

if (!$spellsListView) throw new Error('$spellsListView query failed');
if (!$spellsListCardsDiv) throw new Error('$spellsListCardsDiv query failed');

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

let basicSpellData: AllSpells;

async function getAllSpellData(): Promise<void> {
  try {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    if (!response.ok)
      throw new Error(`Fetch error. Status: ${response.status}`);
    basicSpellData = (await response.json()) as AllSpells;
  } catch (err) {
    console.error('Error:', err);
  }
}

function renderCard(
  spellName: string,
  spellLevel: number,
  spellUrl: string,
): HTMLDivElement {
  if (!$spellsListCardsDiv) throw new Error('$spellsListCardsDiv query failed');

  const $card = document.createElement('div');
  $card.className = 'card';
  $card.setAttribute('data-url', spellUrl);

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

async function renderAllCards(): Promise<void> {
  await getAllSpellData();

  for (let i = 0; i < basicSpellData.count; i++) {
    const spellInfo = basicSpellData.results[i];
    const $card = renderCard(spellInfo.name, spellInfo.level, spellInfo.url);
    $spellsListCardsDiv.appendChild($card);
  }
}

renderAllCards();

// SPELLS LIST --> SPELL DETAILS ----------------------------------------------

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

$spellsListCardsDiv.addEventListener('click', async (event: Event) => {
  try {
    const $target = event.target as HTMLElement;

    if (!$target.closest('div.card')) {
      console.log('not a card');
      return;
    }

    const $targetCard = $target.closest('div.card') as HTMLDivElement;
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

    $spellDetailsCastTime.textContent = spellDetails.casting_time;
    $spellDetailsRange.textContent = spellDetails.range;
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
    $spellDetailsDuration.textContent = spellDetails.duration;

    while ($spellDetailsDescriptionDiv.childNodes.length > 0) {
      if (!$spellDetailsDescriptionDiv.firstElementChild) break;
      $spellDetailsDescriptionDiv.removeChild(
        $spellDetailsDescriptionDiv.firstElementChild,
      );
    }
    for (let i = 0; i < spellDetails.desc.length; i++) {
      const $descPar = document.createElement('div');
      $descPar.textContent = spellDetails.desc[i];
      $spellDetailsDescriptionDiv.appendChild($descPar);
    }

    while ($spellDetailsHigherLevelDiv.childNodes.length > 0) {
      if (!$spellDetailsHigherLevelDiv.firstElementChild) break;
      $spellDetailsHigherLevelDiv.removeChild(
        $spellDetailsHigherLevelDiv.firstElementChild,
      );
    }
    if (spellDetails.higher_level.length > 0) {
      const $labelSpan = document.createElement('span');
      $labelSpan.textContent = 'At Higher Levels: ';
      $labelSpan.setAttribute('style', 'font-weight: 700');

      const $textSpan = document.createElement('span');
      $textSpan.textContent = spellDetails.higher_level[0];

      $spellDetailsHigherLevelDiv.appendChild($labelSpan);
      $spellDetailsHigherLevelDiv.appendChild($textSpan);
    }

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

    if (spellDetails.subclasses.length === 1) {
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

    $spellDetailsView.classList.remove('hidden');
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

const $spellDetailsBackAnchor = document.querySelector(
  '#spell-details-back-anchor',
) as HTMLAnchorElement;

if (!$spellDetailsBackAnchor)
  throw new Error('$spellDetailsBackAnchor query failed');

$spellDetailsBackAnchor.addEventListener('click', () => {
  $spellDetailsView.className += ' hidden';
  $spellsListView.classList.remove('hidden');
});
