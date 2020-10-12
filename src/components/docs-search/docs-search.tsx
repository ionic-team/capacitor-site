import { State, Component, ComponentInterface, Element, Prop, Host, h, Listen } from '@stencil/core';
import { importResource } from '../../utils/common';

declare global {
  interface Window {
    docsearch: (opts?: {}) => any;
  }
}

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss'
})
export class DocsSearch implements ComponentInterface {
  @Element() el: HTMLElement;
  @Prop() placeholder = 'Search';
  @State() searchLeft: number = 0;
  @State() input: {
    el?: HTMLInputElement,
    isPristine: boolean,
    isEmpty: boolean }
  = {
    isPristine: true,
    isEmpty: true
  }

  private uniqueId = Math.random().toString().replace('.', '');
  private algoliaCdn = {
    js: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js',
    css: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css'
  }  

  componentWillLoad() {
    const linkEls = document.head.querySelectorAll('link');
    
    const hasAlgoliaCss = Array.from(linkEls).some(link => {
      return link.href === this.algoliaCdn.css;
    });

    if (!hasAlgoliaCss) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.algoliaCdn.css;
      document.head.append(link);
    }    
  }

  componentDidLoad() {
    importResource(
      { propertyName: 'docsearch', link: this.algoliaCdn.js },
      () => this.setupSearch(),
    )
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    requestAnimationFrame(() => {
      const widths = {
        body: document.body.offsetWidth,
        search: 600,
      }
      const searchBarLeft = this.input.el?.getBoundingClientRect()?.left;
      
      this.searchLeft = (widths.body - searchBarLeft) / 2 - widths.search + 64;
    });
  }

  setupSearch(){
    window.docsearch({
      apiKey: 'b3d47db9759a0a5884cf7807e23c77c5',
      indexName: `capacitorjs`,
      inputSelector: `#input-${this.uniqueId}`,
      debug: false, // Set debug to true if you want to inspect the dropdown
      queryHook: () => {
        if (this.input.isPristine) {
          this.input.isPristine = false;

          this.input.el = this.el.querySelector(
            `#id-${this.uniqueId} input[name="search"]`
          ) as HTMLInputElement;
      
          this.input.el.oninput = () => this.handleInput();
          
          this.handleInput();
          this.handleResize();
        }
      }
    });    
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
          '--search-left': this.searchLeft.toString().concat('px')
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
            display: this.input.isEmpty ? 'none' : 'block'
          }}
          class="close"
          icon="close"
          onClick={() => {
            this.input.el.value = '';
            this.input = {
              ...this.input,
              isEmpty: true,
            }
          }}
        />
        <site-backdrop
          visible={!this.input.isEmpty}
          onClick={() => {
            this.input.el.value = '';
            this.input = {
              ...this.input,
              isEmpty: true,
            }
          }}  
        />
      </Host>
    );
  }
}
