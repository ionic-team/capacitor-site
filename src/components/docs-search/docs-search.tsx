import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'docs-search',
  styleUrl: 'docs-search.scss',
  scoped: true
})
export class DocsSearch implements ComponentInterface {
  render() {
    return (
      <Host></Host>
    );
  }
}
