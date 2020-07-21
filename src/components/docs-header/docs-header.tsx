import { Component, ComponentInterface, Host, Prop, State, h } from '@stencil/core';
import { href } from 'stencil-router-v2';
import Router from '../../router';

@Component({
  tag: 'docs-header',
  styleUrl: 'docs-header.scss',
  scoped: true
})
export class DocsHeader implements ComponentInterface {
  @Prop() template: 'guide' | 'reference' = 'guide';

  @State() expanded = false;

  isActive(path: string): boolean {
    const prefix = new RegExp("^" + path, "gm");
    const regexRes = prefix.test(Router.activePath);

    return regexRes;
  }

  toggleExpanded = () => this.expanded = !this.expanded;

  render() {
    const { expanded, template } = this;

    return (
      <Host class={{
        'docs-header--expanded': expanded
      }}>
        <site-backdrop visible={expanded} onClick={() => this.toggleExpanded()} />

        <header>
          <docs-search class="docs-search--mobile"></docs-search>
          <more-button onClick={() => this.toggleExpanded()} />

          <div class="docs-header-links">
            <div class="docs-header-links__internal hide-mobile">
              <a {...href('/docs')} class={{ 'active': template === 'guide' }}>Guide</a>
              <a {...href('/docs/apis')} class={{ 'active': template === 'reference' }}>Reference</a>
            </div>

            <div class="docs-header-links__divider hide-mobile"/>

            <docs-search class="docs-search--default"></docs-search>

            <div class="docs-header-links__internal">
              <a {...href('/community')}>Community</a>
              <a {...href('/blog')}>Blog</a>
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
