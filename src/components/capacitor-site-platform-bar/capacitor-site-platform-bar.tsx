import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'capacitor-site-platform-bar',
  styleUrl: 'capacitor-site-platform-bar.scss',
})
export class PlatformBar implements ComponentInterface {
  render() {
    return (
      <a
        class="platform-bar"
        href="https://ionicframework.com/signup?source=capacitor-site&product=appflow"
        target="_blank"
        rel="noopener"
      >
        <svg
          width="23"
          height="20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="11.5" cy="13.91" rx="2.57" ry="2.44" fill="#EBF2FF" />
          <path d="M23 20 14.16 0h-5.3l8.84 20H23Z" fill="#EBF2FF" />
          <path
            opacity=".2"
            d="M12.45 8.13 14.16 0h-5.3l2.2 5 1.11 2.5.14.31.14.32Z"
            fill="#4F68FF"
          />
          <path d="M0 20 8.84 0h5.3L5.3 20H0Z" fill="#fff" />
        </svg>
        <span class="text">
          Build, publish, and deploy Capacitor apps in the cloud with{' '}
          <em>Ionic Appflow</em>
        </span>
        <div class="button">
          Try it free <ion-icon name="arrow-forward-outline"></ion-icon>
        </div>
      </a>
    );
  }
}
