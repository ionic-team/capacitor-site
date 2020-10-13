import marked from 'marked';
import Prism from 'prismjs';
import path from 'path';
import loadLanguages from 'prismjs/components/';
import { SiteStructureItem, MarkdownContent } from '../src/global/definitions';

const languages = [
  'bash',
  'diff',
  'css',
  'java',
  'json',
  'json5',
  'kotlin',
  'markup',
  'objectivec',
  'shell',
  'swift',
  'tsx',
  'typescript',
  'xml'
];
loadLanguages(languages);

export function findItem(siteStructureList: SiteStructureItem[], filePath: string): SiteStructureItem {
  for (const item of siteStructureList) {
    if (item.filePath === filePath) {
      return item;
    } else if (item.children && item.children.length > 0) {
      const foundItem = findItem(item.children, filePath);
      if (foundItem != null) {
        return foundItem;
      }
    }
  }
}

export function generateSiteStructure(nodes: any): SiteStructureItem[] {
  const metadataList: SiteStructureItem[] = [];
  const listItems = nodes.children.find(child => child.type === 'list').children;
  for (const listItem of listItems) {
    const [title, ...items] = listItem.children;
    let heading = title.children[0];
    let headingItem: any = {
      text: heading.value,
      parent: true
    };
    if (heading.type === 'link') {
      const filePath = heading.url;
      heading = title.children[0].children[0];
      headingItem = {
        text: heading.value,
        filePath,
        parent: true
      };
    }
    let listChildren = [];
    if (items.length > 0) {
      for (const child of items[0].children) {
        const link = child.children[0].children[0];
        const text = link.children[0].value;
        const filePath = link.url;
        listChildren.push({
          text,
          filePath
        });
      }
      headingItem.children = listChildren;
    }
    metadataList.push(headingItem);
  }
  return metadataList;
}

export function localizeMarkdownLink(renderer: marked.Renderer, filePath: string, metadataList: SiteStructureItem[]) {
  const prevLink = renderer.link;

  renderer.link = function(href: string, title: string, text: string) {
    if (!(href.startsWith('/') || href.startsWith('#') || href.startsWith('http'))) {
      let [pathname, fragment] = href.split('#');
      fragment = fragment ? `#${fragment}` : '';
      const newPath = path.resolve(path.dirname(filePath), pathname) + '.json';
      const item = findItem(metadataList, newPath);
      if (item && item.url != null) {
        return `<a ${title ? `title=${title}` : ''} href=${item.url}${fragment}>${text}</a>>`;
      }
    }
    return prevLink.call(this, href, title, text);
  }
}

export function collectHeadingMetadata(renderer: marked.Renderer, metadata: MarkdownContent) {
  renderer.heading = function(text, level, raw) {
    const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
    metadata.headings.push({
      id,
      level,
      text
    });

    return `
<h${level} id="${id}">
  ${(level !== 1) ? `<a class="heading-link" href="#${id}"><ion-icon name="link"></ion-icon>` : ''}
  ${text}
  ${(level !== 1) ? `</a>` : ''}
</h${level}>
`;
  };
}

export function changeCodeCreation(renderer: marked.Renderer) {
  function highlight(code: string, lang?: string) {
    if (lang != null && languages.indexOf(lang) !== -1) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    }
    return code;
  }

  renderer.code = function (code, lang, escaped) {
    const hcl = [];
    code = code
      .split('\n')
      .map((line, index) => {
        if (line.charAt(0) === '|') {
          hcl.push(index + 1);
          return line.substring(1);
        }
        return line;
      })
      .join('\n');

    const out = highlight(code, lang);

    if (out != null) {
      escaped = true;
      code = out;
    }

    if (!lang) {
      return `<pre><code>${(escaped ? code : escape(code))}</code></pre>`;
    }

    return `
  <highlight-code-line ${hcl.length > 0 ? `lines="${hcl.join()}"`: ``}>
    <pre class="language-${escape(lang)}"><code>${(escaped ? code : escape(code))}</code></pre>
  </highlight-code-line>
  `;
  };
}
