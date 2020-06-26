import { Component, ComponentInterface, Host, State, h } from '@stencil/core';
import { href } from 'stencil-router-v2';
import Router from '../../router';

@Component({
  tag: 'docs-header',
  styleUrl: 'docs-header.scss',
  scoped: true
})
export class DocsHeader implements ComponentInterface {
  @State() expanded = false;

  isActive(path: string): boolean {
    const prefix = new RegExp("^" + path, "gm");
    const regexRes = prefix.test(Router.activePath);

    return regexRes;
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  render() {
    const { expanded } = this;

    return (
      <Host class={{
        'docs-header--expanded': expanded
      }}>
        <div
          class="docs-header__backdrop"
          onClick={() => this.toggleExpanded()}
        />

        <header>
          <docs-search></docs-search>
          <button class="docs-header__more-button" onClick={() => this.toggleExpanded()}>
            <ion-icon name="ellipsis-vertical" />
          </button>

          <div class="docs-header-links">
            <div class="docs-header-links__internal">
              <a {...href('/docs')} class={{ 'active': this.isActive('/docs') }}>Docs</a>
              {/* TODO enable this when we move the plugins */}
              {/* <a {...href('/api')} class={{ 'active': this.isActive('/api') }}>Plugins</a> */}
              <a {...href('/blog')}>Blog</a>
              <a {...href('/community')}>Community</a>
            </div>
            <div class="docs-header-links__divider"/>
            <div class="docs-header-links__external">
              <a rel="noopener" target="_blank" href="https://twitter.com/capacitorjs" aria-label="Twitter">
                <ion-icon name="logo-twitter"></ion-icon>
                <span>
                  Twitter
                  <ion-icon name="open-outline"></ion-icon>
                </span>
              </a>
              <a rel="noopener" target="_blank" href="https://github.com/ionic-team/capacitor" aria-label="GitHub">
                <ion-icon name="logo-github"></ion-icon>
                <span>
                  GitHub
                  <ion-icon name="open-outline"></ion-icon>
                </span>
              </a>
            </div>
          </div>
        </header>
      </Host>
    );
  }
}
