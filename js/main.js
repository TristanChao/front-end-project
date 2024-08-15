'use strict';
async function getAllSpellData() {
  try {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    if (!response.ok)
      throw new Error(`Fetch error. Status: ${response.status}`);
    const basicSpells = await response.json();
    return basicSpells;
  } catch (err) {
    console.error('Error:', err);
    return {};
  }
}
const basicSpellData = getAllSpellData();
console.log(basicSpellData);
