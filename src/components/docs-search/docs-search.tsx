import { State, Component, ComponentInterface, Element, Prop, Host, h, Listen } from '@stencil/core';
import { importResource } from '../../utils/common';

declare global {
  interface Window {
    docsearch: any;
  }
}

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss'
})
export class DocsSearch implements ComponentInterface {
  @Element() el: HTMLElement;
  @Prop() placeholder = 'Search';
  @State() backdrop = false;
  @State() searchLeft: number = 0;

  private uniqueId = Math.random().toString().replace('.', '');
  private inputEl: HTMLInputElement;
  private clearEl: HTMLElement;
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
      const searchBarLeft = this.inputEl.getBoundingClientRect().left;
      
      this.searchLeft = (widths.body - searchBarLeft) / 2 - widths.search + 64;
    });
  }

  setupSearch(){
    window.docsearch({
      apiKey: 'b3d47db9759a0a5884cf7807e23c77c5',
      indexName: `capacitorjs`,
      inputSelector: `#id-${this.uniqueId} input[name="search"]`,
      debug: false, // Set debug to true if you want to inspect the dropdown
    });

    this.inputEl = this.el.querySelector(
      `#id-${this.uniqueId} input[name="search"]`
    ) as HTMLInputElement;

    this.inputEl.oninput = () => this.checkInputState();

    this.checkInputState();
    this.handleResize();
  }

  checkInputState() {

    if (this.inputEl.value === '') {
      this.clearEl.style.display = 'none'
      this.backdrop = false;
      document.body.classList.remove('no-scroll');
    } else {
      this.clearEl.style.display = 'inline-block'
      this.backdrop = true;

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
          name="search"
          type="search"
          autocomplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          required
        />
        <ion-icon
          class="close"
          icon="close"
          onClick={() => {
            this.inputEl.value = '';
            this.checkInputState();
          }}
          ref={el => this.clearEl = el}
        />
        <site-backdrop
          visible={this.backdrop} 
          onClick={() => {
            this.inputEl.value = '';
            this.checkInputState();
          }}/>
      </Host>
    );
  }
}
