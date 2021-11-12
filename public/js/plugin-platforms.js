window.customElements.define(
  'plugin-platforms',
  class PluginPlatforms extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
      const platforms = this.getAttribute('platforms') ?? '';

      this.shadowRoot.innerHTML = `
      <style>
        :host {
            display: block;
        }
        .platforms {
          display: inline-flex;

          .platform {
            display: inline-block;
          }

        }
        img + img {
          margin-left: 12px;
        }
      </style>

      <div class="platforms">
      ${platforms
        .split(',')
        .map(
          (platform) =>
            `<img
            src="/assets/img/plugin-platforms/${platform}@2x.png"
            alt="${platform}"
            title="${platform}"
            width="32"
            height="32"
          />`
        )
        .join('')}
      </div>
      `;
    }
  }
);
