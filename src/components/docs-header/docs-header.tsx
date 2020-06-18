import { Component, ComponentInterface, Host, h } from '@stencil/core';
import { href } from 'stencil-router-v2';
import Router from '../../router';

@Component({
  tag: 'docs-header',
  styleUrl: 'docs-header.scss',
  scoped: true
})
export class DocsHeader implements ComponentInterface {

  isActive(path: string): boolean {
    return path === Router.activePath;
  }

  render() {
    return (
      <Host>
        <docs-search></docs-search>
        <div class="docs-header-links">
          <a {...href('/docs')} class={{ 'active': this.isActive('/docs') }}>Docs</a>
          <a {...href('/plugins')} class={{ 'active': this.isActive('/plugins') }}>API Plugins</a>
          <a {...href('/blog')}>Blog</a>
          <a {...href('/community')}>Community</a>
        </div>
        <div class="docs-header-link-divider"/>
        <div class="docs-header-external-links">
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
