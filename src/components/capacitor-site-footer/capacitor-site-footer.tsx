import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'capacitor-site-footer',
  styleUrl: 'capacitor-site-footer.css',
  scoped: true,
})
export class CapacitorSiteFooter {
  render() {
    return (
      <Host>
        <footer>
          <div class="container">
            <div id="open-source">
              <a href="http://ionicframework.com/" title="IonicFramework.com" rel="noopener">
                <div class="ionic-oss-logo"></div>
              </a>
              <p>Released under <span id="mit">MIT License</span> | Copyright @ {(new Date()).getFullYear()} Drifty Co.</p>
            </div>

            <div id="footer-icons">
              <iframe
                title="Github Star Count" 
                class="star-button"
                src="https://ghbtns.com/github-btn.html?user=ionic-team&repo=capacitor&type=star&count=true"
                frameBorder="0"
                scrolling="0"
                width="100px"
                height="20px"
              ></iframe>

              <a class="svg-button"
                id="capacitor-twitter"
                href="https://twitter.com/getcapacitor"
                target="_blank"
                rel="noopener"
                title="Open the Capacitor account on twitter"
                style={{fill: 'white'}}
                >
                <app-icon name="twitter"></app-icon>
              </a>
              <a class="svg-button" id="cap-forum" href="https://getcapacitor.herokuapp.com/" target="_blank" rel="noopener"
                title="Join the Capacitor slack">
                <app-icon name="slack"></app-icon>
              </a>
            </div>
          </div>
        </footer>
      </Host>
    );
  }

}
