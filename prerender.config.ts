import { PrerenderConfig } from '@stencil/core';

const fs = require('fs');
 
const solutions = JSON.parse(fs.readFileSync('./data/solutions.json', 'utf-8'));

console.log('Rendering', solutions.all.length, 'urls');

const getEntryUrls = (solutions) => {
  return solutions.map(s => `/solution/${s.id}`);
}

export const config: PrerenderConfig = {
  entryUrls: getEntryUrls(solutions.all)
}