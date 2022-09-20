import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'portals-for-capacitor-bar',
  styleUrl: 'portals-for-capacitor-bar.scss',
  scoped: true,
})
export class PortalsForCapacitorBar implements ComponentInterface {
  render() {
    return (
      <Host>
        <nav>
          <h6>NEW</h6>
          <p>Introducing Portals for Capacitor</p>
          <button>
            <a
              href="https://ionic.io/blog/introducing-portals-for-capacitor"
              target="_blank"
              rel="noopener"
            >
              Learn more <span class="arrow">-&gt;</span>
            </a>
          </button>
        </nav>
      </Host>
    );
  }
}
