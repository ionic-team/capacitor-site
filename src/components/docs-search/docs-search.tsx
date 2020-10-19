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
  private docsContent: HTMLElement;

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
    width?: string,
    left?: string,
  } = {}

  private uniqueId = Math.random().toString().replace('.', '');
  private algolia: { linkEl?: HTMLLinkElement, js: string, css: string } = {
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
    importResource(
      { propertyName: 'docsearch', link: this.algolia.js },
      () => this.setupSearch(),
    );

    this.docsContent = document.querySelector('.doc-content .measure-lg');
  }

  disconnectedCallback() {
    this.algolia.linkEl?.remove();

    const scripts = document.head.querySelectorAll('script');
    scripts.forEach((script) => {
      if (script.src = this.algolia.js) script.remove();
    });
  }

  @Listen('resize', { target: 'window' })
  getContentStats() {    
    requestAnimationFrame(() => {
      const left = this.docsContent.getBoundingClientRect().left -
                   this.el.getBoundingClientRect().left;

      this.searchStats = {
        width: this.docsContent.offsetWidth.toString().concat('px'),
        left: left.toString().concat('px'),
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
        const url = suggestion.url.replace('https://capacitorjs.com', '')
        Router.push(url);

        this.clearSearch();
      },
    });
  }

  clearSearch = () => {
    this.input.el.value = '';
    this.input = {
      ...this.input,
      isEmpty: true,
    };
  }

  handleInput() {
    if (this.input.el.value === '') {
      document.body.classList.remove('no-scroll');
      this.input = { ...this.input, isEmpty: true };
    } else {
      this.input = { ...this.input, isEmpty: false };

      if (document.body.offsetWidth < 768) {
        document.body.classList.add('no-scroll');
      }
    }
  }

  render() {
    const { placeholder } = this;

    return (
      <Host
        id={`id-${this.uniqueId}`}
        style={{
          '--search-left': this.searchStats.left,
          '--search-width': this.searchStats.width
        }}
      >
        <ion-icon class="search" icon="search" />
        <input
          id={`input-${this.uniqueId}`}
          name="search"
          type="search"
          autocomplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          required
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
