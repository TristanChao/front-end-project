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

async function getAllSpellData(): Promise<object> {
  try {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    if (!response.ok)
      throw new Error(`Fetch error. Status: ${response.status}`);
    const basicSpells = (await response.json()) as AllSpells;
    return basicSpells;
  } catch (err) {
    console.error('Error:', err);
    return {};
  }
}

const basicSpellData = getAllSpellData();

console.log(basicSpellData);
