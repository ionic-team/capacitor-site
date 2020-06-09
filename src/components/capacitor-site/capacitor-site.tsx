import { Component, Element, State, h } from '@stencil/core';

import state from '../../store';

@Component({
  tag: 'capacitor-site',
  styleUrl: 'capacitor-site.scss'
})
export class App {
  @Element() el: HTMLElement;

  @State() isLeftSidebarIn: boolean;

  render() {
    return (
      <site-root>
        <div class={`page-theme--${state.pageTheme}`}>
          <site-platform-bar productName="Capacitor" />
          <capacitor-site-header />
          <capacitor-site-routes />
        </div>
      </site-root>
    );
  }
}
