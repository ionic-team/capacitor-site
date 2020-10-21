import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

const API_DIR =  path.join(__dirname,'..','pages','docs', 'v3', 'apis');

const pluginApis = [
  'action-sheet',
  'browser',
  'clipboard',
  'device',
  'dialog',
  'haptics',
  'keyboard',
  'motion',
  'network',
  'screen-reader',
  'share',
  'status-bar',
  'storage',
  'text-zoom',
  'toast',
];

async function buildPluginApiDocs(pluginId: string) {
  const [ readme, pkgJson ] = await Promise.all([
    getReadme(pluginId),
    getPkgJsonData(pluginId),
  ]);

  const apiContent = createApiPage(pluginId, readme, pkgJson);
  const fileName = `${pluginId}.md`;
  const filePath = path.join(API_DIR, fileName);
  fs.writeFileSync(filePath, apiContent);
}

function createApiPage(pluginId: string, readme: string, pkgJson: any) {
  const title = `${toTitleCase(pluginId)} Capacitor Plugin API`;
  const desc = pkgJson.description ? pkgJson.description.replace(/\n/g, ' ') : title;
  const editUrl = `https://github.com/ionic-team/capacitor-plugins/blob/main/${pluginId}/src/definitions.ts`;

  return `
---
title: ${title}
description: ${desc}
editUrl: ${editUrl}
---

${readme}`.trim();
}

async function getReadme(pluginId: string) {
  const url = `https://cdn.jsdelivr.net/npm/@capacitor/${pluginId}/README.md`;
  const rsp = await fetch(url);
  return rsp.text();
}

async function getPkgJsonData(pluginId: string) {
  const url = `https://cdn.jsdelivr.net/npm/@capacitor/${pluginId}/package.json`;
  const rsp = await fetch(url);
  return rsp.json();
}

async function main() {
  await Promise.all(pluginApis.map(buildPluginApiDocs));
  console.log(`Plugin API Files Updated 🎸`);
}

function toTitleCase(str) {
  return str.replace(/(^\w|-\w)/g, (s: string) => {
    return s.replace(/-/, " ").toUpperCase();
  });
}


main();
