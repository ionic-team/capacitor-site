import { Component, Element, h } from '@stencil/core';

import state from '../../store';

@Component({
  tag: 'capacitor-site',
  styleUrl: 'capacitor-site.scss'
})
export class App {
  @Element() el: HTMLElement;

  render() {
    return (
      <site-root>
        <div class={`page-theme--${state.pageTheme}`}>
          {state.showTopBar ? ([
          <site-platform-bar productName="Capacitor" />,
          <capacitor-site-header />
          ]) : null}
          <capacitor-site-routes />
        </div>
      </site-root>
    );
  }
}
