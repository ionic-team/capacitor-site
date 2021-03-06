import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';
import { Breakpoint } from '@ionic-internal/ionic-ds';

@Component({
  tag: 'capacitor-site-platform-bar',
  styleUrl: 'capacitor-site-platform-bar.scss',
})
export class PlatformBar implements ComponentInterface {
  @Prop() productName?: string;
  @Prop() containerClass = 'ui-container';

  render() {
    return (
      <Host>
        <div class={`wrapper ${this.containerClass}`}>
          <div class="platform-bar__logo">
            <a href="https://ionic.io/">
              <svg
                width="70"
                height="24"
                viewBox="0 0 70 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="image"
                aria-label="Ionic Logo"
              >
                <path
                  d="M66.805 14.2224C66.4881 15.0748 65.6974 15.5478 64.7204 15.5478C63.2704 15.5478 62.095 14.3723 62.095 12.9223C62.095 11.4723 63.2704 10.2969 64.7204 10.2969C65.6975 10.2969 66.4638 10.7137 66.805 11.6224H69.4826C69.0392 9.29243 67.102 7.79688 64.7204 7.79688C61.8897 7.79688 59.595 10.0916 59.595 12.9223C59.595 15.753 61.8897 18.0478 64.7204 18.0478C67.102 18.0478 69.1606 16.3746 69.4826 14.2224H66.805Z"
                  fill="white"
                />
                <path
                  d="M55.778 8.05437H58.5659V17.8665H55.778V8.05437Z"
                  fill="white"
                />
                <path
                  d="M58.8464 5.68306C58.8464 6.61259 58.0928 7.36613 57.1633 7.36613C56.2338 7.36613 55.4802 6.61259 55.4802 5.68306C55.4802 4.75353 56.2338 4 57.1633 4C58.0928 4 58.8464 4.75353 58.8464 5.68306Z"
                  fill="white"
                />
                <path
                  d="M47.7925 9.25525C48.2599 8.41119 49.3224 7.83496 50.8523 7.83496C53.3258 7.83496 54.6347 9.40945 54.6347 11.7468V17.8663H51.8468V12.039C51.8468 10.8947 51.3368 10.1074 50.1044 10.1074C48.7529 10.1074 48.0049 10.9353 48.0049 12.2419V17.8581H45.217V8.05409H47.7925V9.25525Z"
                  fill="white"
                />
                <circle
                  cx="39.1897"
                  cy="12.9226"
                  r="3.87526"
                  stroke="white"
                  stroke-width="2.5"
                />
                <path
                  d="M30.2975 8.05437H33.0854V17.8665H30.2975V8.05437Z"
                  fill="white"
                />
                <path
                  d="M33.3659 5.68306C33.3659 6.61259 32.6124 7.36613 31.6828 7.36613C30.7533 7.36613 29.9998 6.61259 29.9998 5.68306C29.9998 4.75353 30.7533 4 31.6828 4C32.6124 4 33.3659 4.75353 33.3659 5.68306Z"
                  fill="white"
                />
                <path
                  d="M12 17.1431C14.8336 17.1431 17.1428 14.8383 17.1428 12.0002C17.1428 9.16657 14.838 6.85735 12 6.85735C9.16192 6.85735 6.85711 9.16657 6.85711 12.0002C6.85711 14.8338 9.16633 17.1431 12 17.1431Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 2.88C6.96316 2.88 2.88 6.96316 2.88 12C2.88 17.0368 6.96316 21.12 12 21.12C17.0368 21.12 21.12 17.0368 21.12 12C21.12 10.6394 20.823 9.35203 20.2916 8.196L22.9084 6.99318C23.6097 8.51886 24 10.2158 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C15.4654 0 18.5895 1.47078 20.7781 3.81796L18.6717 5.78204C17.005 3.9946 14.6338 2.88 12 2.88Z"
                  fill="#fff"
                />
                <path
                  opacity="0.4"
                  d="M20.5 11C22.433 11 24 9.433 24 7.5C24 5.567 22.433 4 20.5 4C18.567 4 17 5.567 17 7.5C17 9.433 18.567 11 20.5 11Z"
                  fill="#03060B"
                />
                <path
                  d="M20.5714 9.42843C22.4649 9.42843 24 7.89341 24 5.99986C24 4.10631 22.4649 2.57129 20.5714 2.57129C18.6778 2.57129 17.1428 4.10631 17.1428 5.99986C17.1428 7.89341 18.6778 9.42843 20.5714 9.42843Z"
                  fill="#03060B"
                />
                <path
                  d="M19.7143 7.71415C21.1344 7.71415 22.2857 6.56288 22.2857 5.14272C22.2857 3.72256 21.1344 2.57129 19.7143 2.57129C18.2941 2.57129 17.1428 3.72256 17.1428 5.14272C17.1428 6.56288 18.2941 7.71415 19.7143 7.71415Z"
                  fill="white"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(23 8.5) rotate(162.35) scale(11.5434 5.28499)"
                  >
                    <stop stop-color="white" stop-opacity="0.7" />
                    <stop offset="1" stop-color="white" />
                  </radialGradient>
                </defs>
              </svg>
            </a>
          </div>
          <Breakpoint md={true} class="platform-bar__desc">
            See how <strong>{this.productName}</strong> fits into the entire{' '}
            <span class="nowrap">
              <a href="https://ionic.io/">Ionic Ecosystem</a>{' '}
              <span style={{ 'letter-spacing': '0' }}>-&gt;</span>
            </span>
          </Breakpoint>
          <Breakpoint xs={true} md={false} class="platform-bar__desc">
            <strong>{this.productName}</strong> is part of the{' '}
            <span class="nowrap">
              <a href="https://ionic.io/">Ionic Ecosystem</a>{' '}
              <span style={{ 'letter-spacing': '0' }}>-&gt;</span>
            </span>
          </Breakpoint>
        </div>
      </Host>
    );
  }
}
