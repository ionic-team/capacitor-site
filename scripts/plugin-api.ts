import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

const API_DIR =  path.join(__dirname,'..','pages','docs', 'v3', 'apis');

const pluginApis = [
  'action-sheet',
  'app',
  'app-launcher',
  'browser',
  'camera',
  'clipboard',
  'device',
  'dialog',
  'filesystem',
  'geolocation',
  'haptics',
  'keyboard',
  'motion',
  'network',
  'screen-reader',
  'share',
  'splash-screen',
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

async function writeListToIndex(pluginIds: string[]) {
  const indexPath = path.join(API_DIR, 'index.md');
  const content = fs.readFileSync(indexPath, 'utf-8');
  const re = /## List of Official Plugins[\s\S]+?(?=^#)/gm;
  const result = content.replace(re, '## List of Official Plugins\n\n' + pluginIds.map(id => `- [${toTitleCase(id)}](/docs/apis/${id})`).join('\n') + '\n\n');

  fs.writeFileSync(indexPath, result);
}

async function main() {
  await Promise.all(pluginApis.map(buildPluginApiDocs));
  await writeListToIndex(pluginApis);
  console.log(`Plugin API Files Updated 🎸`);
}

function toTitleCase(str) {
  return str.replace(/(^\w|-\w)/g, (s: string) => {
    return s.replace(/-/, " ").toUpperCase();
  });
}


main();
