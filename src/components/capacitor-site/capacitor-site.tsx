import { Component, Element, State, h } from '@stencil/core';

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
        <site-platform-bar productName="Capacitor" />
        <capacitor-site-header />
        <capacitor-site-routes />
      </site-root>
    );
  }
}
