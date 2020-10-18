import {
  Component,
  ComponentInterface,
  Host,
  Prop,
  State,
  h,
} from '@stencil/core';
import { href } from '../../stencil-router-v2';
import Router, { docsVersionHref } from '../../router';
import { DocsTemplate } from '../../data.server/docs';

@Component({
  tag: 'docs-header',
  styleUrl: 'docs-header.scss',
  scoped: true,
})
export class DocsHeader implements ComponentInterface {
  @Prop() template: DocsTemplate = 'guide';

  @State() expanded = false;

  isActive(path: string): boolean {
    const prefix = new RegExp('^' + path, 'gm');
    const regexRes = prefix.test(Router.path);

    return regexRes;
  }

  toggleExpanded = () => (this.expanded = !this.expanded);

  render() {
    const { expanded, template } = this;

    return (
      <Host
        class={{
          'docs-header--expanded': expanded,
        }}
      >
        <site-backdrop
          mobileOnly
          visible={expanded}
          onClick={() => this.toggleExpanded()}
        />

        <header>
          <docs-search
            placeholder="Search docs..."
            class="docs-search--mobile"
          />
          <more-button onClick={() => this.toggleExpanded()} />

          <nav class="docs-header-links">
            <div class="docs-header-links__internal hide-mobile">
              <a
                {...href(docsVersionHref('/docs'))}
                class={{
                  'docs-header-links__internal-section': true,
                  active: template === 'guide'
                }}
              >
                Guides
              </a>
              <a
                {...href(docsVersionHref('/docs/plugins'))}
                class={{
                  'docs-header-links__internal-section': true,
                  active: template === 'plugins'
                }}
              >
                Plugins
              </a>
              <a
                {...href(docsVersionHref('/docs/reference/cli'))}
                class={{
                  'docs-header-links__internal-section': true,
                  active: template === 'reference'
                }}
              >
                CLI
              </a>
            </div>

            <div class="docs-header-links__divider hide-mobile" />

            <docs-search class="docs-search--default"></docs-search>

            <div class="docs-header-links__internal">
              <a {...href('/community')}>Community</a>
              <a {...href('/blog')}>Blog</a>
            </div>

            <div class="docs-header-links__divider" />

            <div class="docs-header-links__external">
              <a
                rel="noopener"
                target="_blank"
                href="https://twitter.com/capacitorjs"
                aria-label="Twitter"
              >
                <ion-icon name="logo-twitter"></ion-icon>
                <span>
                  Twitter
                  <ion-icon name="open-outline"></ion-icon>
                </span>
              </a>
              <a
                rel="noopener"
                target="_blank"
                href="https://github.com/ionic-team/capacitor"
                aria-label="GitHub"
              >
                <ion-icon name="logo-github"></ion-icon>
                <span>
                  GitHub
                  <ion-icon name="open-outline"></ion-icon>
                </span>
              </a>
            </div>
          </nav>
        </header>
      </Host>
    );
  }
}
