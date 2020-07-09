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
    const prefix = new RegExp("^" + path, "gm");
    const regexRes = prefix.test(Router.activePath);

    return regexRes;
  }

  render() {
    return (
      <Host>
        <docs-search></docs-search>
        <div class="docs-header__links">
          <a {...href('/docs')} class={{ 'active': this.isActive('/docs') }}>Docs</a>
          {/* TODO enable this when we move the plugins */}
          {/* <a {...href('/plugins')} class={{ 'active': this.isActive('/plugins') }}>Plugins</a> */}
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
