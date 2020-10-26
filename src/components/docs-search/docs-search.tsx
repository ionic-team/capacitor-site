import {
  State,
  Component,
  ComponentInterface,
  Element,
  Prop,
  Host,
  h,
  Listen,
} from '@stencil/core';
import Router from '../../router';
import { importResource } from '../../utils/common';

declare global {
  interface Window {
    docsearch: (opts?: {}) => any;
  }
}

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss',
})
export class DocsSearch implements ComponentInterface {
  private siteContent: HTMLElement;
  private contentWidth = 736;

  @Element() el: HTMLElement;
  @Prop() placeholder = 'Search';
  @State() input: {
    el?: HTMLInputElement;
    isPristine: boolean;
    isEmpty: boolean;
  } = {
    isPristine: true,
    isEmpty: true,
  };
  @State() searchStats: {
    width?: string;
    left?: string;
  } = {};

  private uniqueId = Math.random().toString().replace('.', '');
  private algolia: { linkEl?: HTMLLinkElement; js: string; css: string } = {
    js: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js',
    css:
      'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css',
  };

  componentWillLoad() {
    const linkEls = document.head.querySelectorAll('link');

    const hasAlgoliaCss = Array.from(linkEls).some(link => {
      return link.href === this.algolia.css;
    });

    if (!hasAlgoliaCss) {
      this.algolia.linkEl = document.createElement('link');
      this.algolia.linkEl.rel = 'stylesheet';
      this.algolia.linkEl.href = this.algolia.css;
      document.head.append(this.algolia.linkEl);
    }
  }

  componentDidLoad() {
    importResource({ propertyName: 'docsearch', link: this.algolia.js }, () =>
      this.setupSearch(),
    );

    this.el.addEventListener(
      'focus',
      () => {
        this.siteContent =
          document.querySelector('docs-component .measure-lg') ||
          document.querySelector('section.ui-container');
        this.getContentStats();
      },
      true,
    );
  }

  disconnectedCallback() {
    this.algolia.linkEl?.remove();

    const scripts = document.head.querySelectorAll('script');
    scripts.forEach(script => {
      if ((script.src = this.algolia.js)) script.remove();
    });
  }

  @Listen('resize', { target: 'window' })
  getContentStats() {
    requestAnimationFrame(() => {
      if (!this.siteContent) return;

      let left =
        this.siteContent.getBoundingClientRect().left -
        this.el.getBoundingClientRect().left;
      let width = this.siteContent.offsetWidth;

      if (width > this.contentWidth) {
        left -= (this.contentWidth - width) / 2;

        this.searchStats = {
          width: this.contentWidth.toString().concat('px'),
          left: left.toString().concat('px'),
        };
      } else {
        this.searchStats = {
          width: width.toString().concat('px'),
          left: left.toString().concat('px'),
        };
      }
    });
  }

  setupSearch() {
    window.docsearch({
      apiKey: 'b3d47db9759a0a5884cf7807e23c77c5',
      indexName: `capacitorjs`,
      inputSelector: `#input-${this.uniqueId}`,
      debug: false, // Set debug to true if you want to inspect the dropdown
      queryHook: () => {
        if (this.input.isPristine) {
          this.input.isPristine = false;

          this.input.el = this.el.querySelector(
            `#id-${this.uniqueId} input[name="search"]`,
          ) as HTMLInputElement;

          this.input.el.oninput = () => this.handleInput();

          this.handleInput();
          this.getContentStats();
        }
      },
      handleSelected: (_, __, suggestion) => {
        const url = suggestion.url.replace('https://capacitorjs.com', '');
        this.clearSearch();
        Router.push(url);
      },
    });
  }

  clearSearch = () => {
    this.input.el.value = '';
    this.input = {
      ...this.input,
      isEmpty: true,
    };
  };

  handleInput() {
    if (this.input.el.value === '') {
      this.input = { ...this.input, isEmpty: true };
    } else {
      this.input = { ...this.input, isEmpty: false };
    }
  }

  render() {
    const { placeholder } = this;

    return (
      <Host
        id={`id-${this.uniqueId}`}
        style={{
          '--search-left': this.searchStats.left,
          '--search-width': this.searchStats.width,
        }}
      >
        <svg
          class="search-icon"
          width="14"
          height="14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.7854 12.5947L10.6117 9.421a5.8626 5.8626 0 001.1752-3.5276C11.7869 2.6438 9.1431 0 5.8934 0 2.6438 0 0 2.6438 0 5.8934c0 3.2497 2.6438 5.8935 5.8934 5.8935a5.8626 5.8626 0 003.5276-1.1752l3.1737 3.1737a.8436.8436 0 001.1583-.0324.8436.8436 0 00.0324-1.1583zM1.6838 5.8934a4.2096 4.2096 0 114.2096 4.2096 4.2145 4.2145 0 01-4.2096-4.2096z"
            fill="#B2BECD"
          />
        </svg>
        <input
          id={`input-${this.uniqueId}`}
          name="search"
          type="search"
          autocomplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          required
          style={{
            visibility: 'hidden',
          }}
        />
        <ion-icon
          style={{
            display: this.input.isEmpty ? 'none' : 'block',
          }}
          class="close"
          icon="close"
          onClick={() => this.clearSearch()}
        />
        <site-backdrop
          mobileOnly
          visible={!this.input.isEmpty}
          onClick={() => this.clearSearch()}
        />
      </Host>
    );
  }
}
