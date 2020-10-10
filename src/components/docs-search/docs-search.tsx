import { Build, Component, ComponentInterface, Element, Prop, Host, h } from '@stencil/core';
import Helmet from '@stencil/helmet';
import { importResource } from '../../utils/common';
import algoliasearch from 'algoliasearch';

declare var docsearch: any;

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss'
})
export class DocsSearch implements ComponentInterface {
  @Element() el: HTMLElement;
  @Prop() placeholder = 'Search';

  // private pristine: boolean = true;
  private uniqueId = new Date().getTime();
  private inputEl: HTMLInputElement;
  private clearEl: HTMLElement;
  private algoliaCdn = 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js';

  componentWillLoad() {
    importResource(
      { propertyName: 'docsearch', link: this.algoliaCdn },
      () => this.setupSearch(),
    )
  }

  setupSearch(){
    docsearch({
      apiKey: 'b3d47db9759a0a5884cf7807e23c77c5',
      indexName: `capacitorjs`,
      inputSelector: `id-${this.uniqueId} input[name="search"]`,
      debug: false, // Set debug to true if you want to inspect the dropdown
    });

    this.inputEl = this.el.querySelector('.algolia-autocomplete input[name="search"]') as HTMLInputElement;
    console.log(this.inputEl);
    this.inputEl.oninput = () => this.handleTextInput();
    // this.pristine = false;
    this.handleTextInput();
  }

  handleTextInput() {
    
    this.clearEl.style.display = this.inputEl.value === ''
      ? 'none'
      : 'inline-block';   
  }

  render() {
    const { placeholder } = this;

    return (
      <Host class={`id-${this.uniqueId}`}>
        <Helmet>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />
        </Helmet>
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
          style={{
            display: 'none'
          }}
          class="close"
          icon="close"
          onClick={() => {
            this.inputEl.value = '';
            this.handleTextInput();
          }}
          ref={el => this.clearEl = el}
        />
      </Host>
    );
  }
}
