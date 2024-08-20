/* exported spellbookData, writeData */

interface Spellbook {
  name: string;
  id: number;
  class?: string;
  classLevel?: number;
  modifier?: number;
  spells: string[];
}

interface SpellbookData {
  nextSpellbookId: number;
  spellbooks: Spellbook[];
  editing: Spellbook | null;
}

const spellbookData: SpellbookData = readData();

function writeData(): void {
  spellbookData.spellbooks.sort((a, b) => {
    const first = a.name as string;
    const second = b.name as string;
    return first.localeCompare(second);
  });
  const dataJson = JSON.stringify(spellbookData);
  localStorage.setItem('spellbook-data', dataJson);
}

function readData(): SpellbookData {
  const dataJson = localStorage.getItem('spellbook-data');

  if (!dataJson) {
    return {
      nextSpellbookId: 1,
      spellbooks: [],
      editing: null,
    };
  }

  return JSON.parse(dataJson);
}
