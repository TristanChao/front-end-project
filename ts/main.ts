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
  switch (spellLevel) {
    case 0:
      $levelSpan.textContent = 'Cantrip';
      break;
    case 1:
      $levelSpan.textContent = '1st';
      break;
    case 2:
      $levelSpan.textContent = '2nd';
      break;
    case 3:
      $levelSpan.textContent = '3rd';
      break;
    default:
      $levelSpan.textContent = spellLevel.toString() + 'th';
  }

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

// SPELL DETAILS ---------------------------------------------------------------

const $spellDetailsView = document.querySelector('#spell-details-view');
const $spellDetailsBackAnchor = document.querySelector(
  '#spell-details-back-anchor',
) as HTMLAnchorElement;

if (!$spellDetailsView) throw new Error('$spellDetailsView query failed');
if (!$spellDetailsBackAnchor)
  throw new Error('$spellDetailsBackAnchor query failed');

$spellDetailsBackAnchor.addEventListener('click', () => {
  $spellDetailsView.className += 'hidden';
  $spellsListView.classList.remove('hidden');
});
