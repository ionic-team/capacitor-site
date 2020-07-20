import { Build, Component, ComponentInterface, Prop, Host, h } from '@stencil/core';

declare var docsearch: any;

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss',
  scoped: true
})
export class DocsSearch implements ComponentInterface {
  @Prop() placeholder = 'Search';

  componentDidLoad(){
    if (Build.isBrowser) {
      docsearch({
        apiKey: 'b3d47db9759a0a5884cf7807e23c77c5',
        indexName: 'capacitorjs',
        inputSelector: 'input[name="search"]',
        debug: false // Set debug to true if you want to inspect the dropdown
      });
    }
  }

  render() {
    const { placeholder } = this;

    return (
      <Host>
        <ion-icon icon="search" />
        <input
          name="search"
          type="search"
          autocomplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          required/>
      </Host>
    );
  }
}
