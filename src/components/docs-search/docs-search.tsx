import { Component, ComponentInterface, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss',
  scoped: true
})
export class DocsSearch implements ComponentInterface {
  @Prop() placeholder = 'Search';

  render() {
    const { placeholder } = this;

    return (
      <Host>
        <ion-icon name="search" />
        <input placeholder={placeholder}></input>
      </Host>
    );
  }
}
