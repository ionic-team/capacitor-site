import { Component, Prop, Host, h } from '@stencil/core';
import type { PageNavigation } from '@stencil/ssg';
import { href } from '@stencil/router';

@Component({
  tag: 'lower-content-nav',
  styleUrl: 'lower-content-nav.css',
  scoped: true,
})
export class LowerContentNav {
  @Prop() navigation: PageNavigation;

  render() {
    const n = this.navigation;
    if (!n) {
      return null;
    }
    return (
      <Host role="navigation">
        {n.previous?.url ? (
          <a {...href(n.previous.url)} class="nav-previous">
            <div class="direction">Previous</div>
            <div>
              <svg viewBox="0 0 512 512">
                <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
              </svg>
              <span>{n.previous.title}</span>
            </div>
          </a>
        ) : null}
        {n.next?.url ? (
          <a {...href(n.next.url)} class="nav-next">
            <div class="direction">Next</div>
            <div>
              <span>{n.next.title}</span>
              <svg viewBox="0 0 512 512">
                <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
              </svg>
            </div>
          </a>
        ) : null}
      </Host>
    );
  }
}
