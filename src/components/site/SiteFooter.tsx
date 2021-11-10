import { useCallback, useEffect, useState } from 'react';
import { importResource } from '../../util/import-resource';
import Col from '../ui/Col';
import Grid from '../ui/Grid';
import Heading from '../ui/Heading';
import Paragraph from '../ui/Paragraph';
import ResponsiveContainer from '../ui/ResponsiveContainer';
import SiteFooterStyles from './SiteFooter.styles';

declare global {
  interface Window {
    hbspt: {
      forms: {
        create: ({}) => any;
      };
    };
    jQuery: () => {
      // these are methods required by HubSpot
      change: () => void;
      trigger: () => void;
    };
  }
}

const hubspotCdn = '//js.hsforms.net/forms/v2.js';

const SiteFooter = () => {
  // Very DOM-heavy, ported from stencil
  const [uniqueFormId, _] = useState(() => `id-${Math.random().toString().replace('.', '')}`);

  useEffect(() => {
    importResource({ propertyName: 'hbspt', link: hubspotCdn }, createForm);

    return () => {
      const scripts = document.head.querySelectorAll('script');
      scripts.forEach((script) => {
        if ((script.src = hubspotCdn)) script.remove();
      });
    };
  }, []);

  const createForm = useCallback(() => {
    // This hates being SSRed
    if (process.browser) {
      window.hbspt.forms.create({
        portalId: '3776657',
        formId: 'c8d355e3-a5ad-4f91-a2c0-c9dc93e10658',
        cssClass: '',
        target: `#${uniqueFormId}`,
      });
    }
  }, [uniqueFormId]);

  return (
    <SiteFooterStyles>
      <footer>
        <ResponsiveContainer>
          <div className="newsletter">
            <div>
              <Heading level={4}>Join our Newsletter</Heading>
              <Paragraph level={4}>Keep up to date with all the latest Capacitor news and updates</Paragraph>
            </div>
            {process.browser && <div className="form-group" id={uniqueFormId}></div>}
          </div>
          <Grid>
            <Col md={6} sm={4} xs={12} cols={12} className="copyright">
              <img
                src="/assets/img/logo-white2.png"
                alt="Capacitor Logo"
                className="logo"
                width="212"
                height="40"
                loading="lazy"
              />
              <p>© {new Date().getFullYear()} Capacitor</p>
              <p>
                <a href="https://ionic.io">Ionic Open Source</a> | Released under <span id="mit">MIT License</span>
              </p>
            </Col>
            <Col md={6} sm={8} xs={12} cols={12}>
              <div className="routes-group">
                <div>
                  <Heading level={5}>Developers</Heading>
                  <ul className="routes">
                    <li>
                      <a className="ui-paragraph-4" href="/docs/getting-started">
                        Install
                      </a>
                    </li>
                    <li>
                      <a className="ui-paragraph-4" href="/docs">
                        Docs
                      </a>
                    </li>
                    <li>
                      <a className="ui-paragraph-4" href="/docs/apis">
                        Plugins
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <Heading level={5}>Resources</Heading>
                  <ul className="routes">
                    <li>
                      <a className="ui-paragraph-4" href="/community">
                        Community
                      </a>
                    </li>
                    <li>
                      <a className="ui-paragraph-4" href="/blog">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a className="ui-paragraph-4" href="https://github.com/ionic-team/capacitor/discussions">
                        Discussions
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <Heading level={5}>Connect</Heading>
                  <ul className="routes">
                    <li>
                      <a className="ui-paragraph-4" href="https://github.com/ionic-team/capacitor">
                        GitHub
                      </a>
                    </li>
                    <li>
                      <a className="ui-paragraph-4" href="https://twitter.com/capacitorjs">
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a className="ui-paragraph-4" href="https://ionic.io">
                        Ionic
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Grid>
        </ResponsiveContainer>
      </footer>
    </SiteFooterStyles>
  );
};

export default SiteFooter;
