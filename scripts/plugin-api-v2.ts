import { 
  parse, 
  outputReadme 
} from '@capacitor/docgen';
import { readdirSync } from 'fs';
import path from 'path';

const API_DIR =  path.join(__dirname,'..','pages','docs','apis');
const PLUGIN_DIR = path.join(
  __dirname,
  '..',
  'node_modules',
  '@capacitor',
  'core',
  'dist',
  'esm',
  'core-plugin-definitions.d.ts',
)

async function main() {
  // parse the core plugin dts file
  const apiFinder = parse({
    inputFiles: [PLUGIN_DIR],
  });

  // get all the mardown files we want to update
  const plugins = listPlugins();

  // loop through all the markdown files and update them
  await Promise.all(
    plugins.map(async plugin => {
      try {
        const pluginData = apiFinder(`${snakeToPascal(plugin)}Plugin`);
        console.log(`${snakeToPascal(plugin)}Plugin`, plugin);
        if (
          pluginData && 
          (pluginData.api || pluginData.interfaces.length || pluginData.enums.length)
        ) {
          await outputReadme(path.join(API_DIR, plugin, 'index.md'), pluginData);
          console.log(`Updated: ${plugin}`);
        }
      } catch(e) {
        console.warn(`${plugin} error`, e);
      }
      
    })
  );

  console.log(`Plugin V2 API Files Updated 🤖`);
}

function listPlugins() {
  // return a list of all the markdown files in the
  // pages/docs/apis directory we want to parse and add docs to
  return readdirSync(API_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function snakeToPascal(str) {
  return str.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}

main();
