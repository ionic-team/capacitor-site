import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'docs-header',
  styleUrl: 'docs-header.scss',
  scoped: true
})
export class DocsHeader implements ComponentInterface {
  @Prop() template: 'docs' | 'plugins' = 'docs';

  render() {
    const { template } = this;

    return (
      <Host>
        <div class="docs-header__links">
          <a {...href('/docs')} class={{ 'active': template === 'docs' }}>Guide</a>
          <a {...href('/docs/plugins')} class={{ 'active': template === 'plugins' }}>Reference</a>
        </div>
        <div class="docs-header__link-divider"/>
        <docs-search></docs-search>
        <div class="docs-header__links">
          <a {...href('/community')}>Community</a>
          <a {...href('/blog')}>Blog</a>
        </div>
        <div class="docs-header__link-divider"/>
        <div class="docs-header__external-links">
          <a rel="noopener" target="_blank" href="https://twitter.com/capacitorjs" aria-label="Twitter">
            <ion-icon name="logo-twitter"></ion-icon>
          </a>
          <a rel="noopener" target="_blank" href="https://github.com/ionic-team/capacitor" aria-label="GitHub">
            <ion-icon name="logo-github"></ion-icon>
          </a>
        </div>
      </Host>
    );
  }
}
