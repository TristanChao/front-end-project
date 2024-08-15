'use strict';
const $spellsListCardsDiv = document.querySelector('#spells-list-cards-div');
if (!$spellsListCardsDiv) throw new Error('$spellsListCardsDiv query failed');
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
let basicSpellData;
async function getAllSpellData() {
  try {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    if (!response.ok)
      throw new Error(`Fetch error. Status: ${response.status}`);
    basicSpellData = await response.json();
    console.log(basicSpellData);
  } catch (err) {
    console.error('Error:', err);
  }
}
function renderCard(spellName, spellLevel) {
  if (!$spellsListCardsDiv) throw new Error('$spellsListCardsDiv query failed');
  const $card = document.createElement('div');
  $card.className = 'card';
  const $topDiv = document.createElement('div');
  const $levelSpan = document.createElement('span');
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
  $nameSpan.textContent = spellName;
  $card.appendChild($topDiv);
  $topDiv.appendChild($levelSpan);
  $card.appendChild($spellCircleDiv);
  $spellCircleDiv.appendChild($spellCircleImg);
  $card.appendChild($nameDiv);
  $nameDiv.appendChild($nameSpan);
  $spellsListCardsDiv.appendChild($card);
}
async function renderAllCards() {
  await getAllSpellData();
  for (let i = 0; i < basicSpellData.count; i++) {
    renderCard(basicSpellData.results[i].name, basicSpellData.results[i].level);
  }
}
renderAllCards();
