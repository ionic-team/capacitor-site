import { useEffect, useRef } from 'react';
import { importResource } from '../../util/import-resource';
import CodeSnippetStyles from './CodeSnippet.styles';

interface Props {
  language: string;
  code: string;
}

declare var window: any;

const prismCdn = `https://cdn.jsdelivr.net/npm/prismjs@1.21.0`;

const CodeSnippet: React.FC<Props> = ({ language, code }) => {
  // use an exact version so the cdn response is heavily cached
  const codeEl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    importResource({ propertyName: 'Prism', link: `${prismCdn}/prism.min.js` }, loadInPrismLanguage);
  }, []);

  const loadInPrismLanguage = () => {
    importResource(
      {
        propertyName: `Prism.languages.${language}`,
        link: `${prismCdn}/components/prism-${language}.min.js`,
      },
      highlightCode
    );
  };

  const highlightCode = async () => {
    window.Prism.hooks.add('before-insert', (env) => {
      switch (env.language) {
        case 'shell-session':
          const lines = env.code.split('\n');

          const code = lines.map((line) => {
            return line.trim() === '' || line.trim()[0] === '#'
              ? `<span class="token output">${line}</span>\n`
              : `<span class="dollar-sign token output">${line}</span>\n`;
          });
          env.highlightedCode = code.join('');
          break;
        default:
      }
    });

    window.Prism.highlightElement(codeEl.current, false);
  };

  if (!code) {
    return null;
  }

  return (
    <CodeSnippetStyles className="code-snippet">
      <pre className={`language-${language}`}>
        <code ref={codeEl}>{code.trim()}</code>
      </pre>
    </CodeSnippetStyles>
  );
};

export default CodeSnippet;
