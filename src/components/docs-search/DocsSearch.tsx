import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { importResource } from '../../util/import-resource';
import SiteBackdrop from '../site/SiteBackdrop';
import DocsSearchStyles from './DocsSearch.styles';

interface Props {
  theme?: 'light' | 'dark';
  placeholder?: string;
}

declare var window: any;

const contentWidth = 736;

const DocsSearch: React.FC<Props> = ({ theme = 'light', placeholder = 'Search' }) => {
  // This component doesn't like being SSRed at the moment
  if (!process.browser) {
    return null;
  }

  const [uniqueId, setUniqueId] = useState(() => Math.random().toString().replace('.', ''));
  console.log('Looking for uniqye id', uniqueId);
  const router = useRouter();
  const el = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState<{
    el?: HTMLInputElement;
    isPristine: boolean;
    isEmpty: boolean;
  }>({
    isPristine: true,
    isEmpty: true,
  });

  const [searchStats, setSearchStats] = useState<{
    width?: string;
    left?: string;
  }>({});

  const [siteContent, setSiteContent] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    console.log('Initializing search on input', el.current);

    importResource({ propertyName: 'docsearch', link: algolia }, () => setupSearch());

    const listener = () => {
      setSiteContent(
        (document.querySelector('docs-component .measure-lg') as HTMLElement) ||
          (document.querySelector('section.ui-container') as HTMLElement)
      );
      getContentStats();
    };

    console.log('Add listener');

    el.current.addEventListener('focus', listener, true);

    return () => {
      el.current?.removeEventListener('focus', listener);
    };
  }, [el]);

  useEffect(() => {
    window.addEventListener('resize', getContentStats);
    return () => {
      window.removeEventListener('resize', getContentStats);
    };
  }, []);

  const getContentStats = useCallback(() => {
    requestAnimationFrame(() => {
      if (!siteContent) return;

      let left = siteContent.getBoundingClientRect().left - el.current?.getBoundingClientRect().left;
      let width = siteContent.offsetWidth;

      if (width > contentWidth) {
        left -= (contentWidth - width) / 2;

        setSearchStats({
          width: contentWidth.toString().concat('px'),
          left: left.toString().concat('px'),
        });
      } else {
        setSearchStats({
          width: `${width}px`,
          left: `${left}px`,
        });
      }
    });
  }, [siteContent, searchStats]);

  const setupSearch = useCallback(() => {
    window.docsearch({
      apiKey: 'b3d47db9759a0a5884cf7807e23c77c5',
      indexName: `capacitorjs`,
      inputSelector: `#input-${uniqueId}`,
      debug: false, // Set debug to true if you want to inspect the dropdown
      queryHook: () => {
        if (input.isPristine) {
          input.isPristine = false;

          input.el = el.current.querySelector(`#id-${uniqueId} input[name="search"]`) as HTMLInputElement;

          input.el.oninput = () => handleInput();

          handleInput();
          getContentStats();
        }
      },
      handleSelected: (_, __, suggestion) => {
        const url = suggestion.url.replace('https://capacitorjs.com', '');
        clearSearch();
        router.push(url);
      },
    });
  }, [el, uniqueId]);

  const clearSearch = useCallback(() => {
    input.el.value = '';
    setInput({
      ...input,
      isEmpty: true,
    });
  }, [input]);

  const handleInput = useCallback(() => {
    if (input.el.value === '') {
      setInput({ ...input, isEmpty: true });
    } else {
      setInput({ ...input, isEmpty: false });
    }
  }, [input]);

  return (
    <DocsSearchStyles
      ref={el}
      id={`id-${uniqueId}`}
      style={
        {
          '--search-left': searchStats.left,
          '--search-width': searchStats.width,
        } as any
      }
      className={`theme--${theme}`}
    >
      <svg className="search-icon" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.7854 12.5947L10.6117 9.421a5.8626 5.8626 0 001.1752-3.5276C11.7869 2.6438 9.1431 0 5.8934 0 2.6438 0 0 2.6438 0 5.8934c0 3.2497 2.6438 5.8935 5.8934 5.8935a5.8626 5.8626 0 003.5276-1.1752l3.1737 3.1737a.8436.8436 0 001.1583-.0324.8436.8436 0 00.0324-1.1583zM1.6838 5.8934a4.2096 4.2096 0 114.2096 4.2096 4.2145 4.2145 0 01-4.2096-4.2096z"
          fill="#B2BECD"
        />
      </svg>
      <input
        id={`input-${uniqueId}`}
        name="search"
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        aria-label={placeholder}
        required
        style={{
          visibility: 'hidden',
        }}
      />
      {/*
      <ion-icon
        style={{
          display: this.input.isEmpty ? "none" : "block",
        }}
        class="close"
        icon="close"
        onClick={() => this.clearSearch()}
      />
      */}
      <SiteBackdrop mobileOnly={true} visible={!input.isEmpty} onClick={clearSearch} />
    </DocsSearchStyles>
  );
};

const algolia = `https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js`;

export default DocsSearch;
