'use strict';
/* exported spellbookData, writeData */
const spellbookData = readData();
function writeData() {
  const dataJson = JSON.stringify(spellbookData);
  localStorage.setItem('spellbook-data', dataJson);
}
function readData() {
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
