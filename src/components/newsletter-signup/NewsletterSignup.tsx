import { useEffect, useState } from 'react';
import { importResource } from '../../util/import-resource';
import Heading from '../ui/Heading';
import Paragraph from '../ui/Paragraph';
import NewsletterSignupStyles from './NewsletterSignup.styles';

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

const NewsletterSignup = () => {
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

  const createForm = () => {
    window.hbspt.forms.create({
      portalId: '3776657',
      formId: 'c8d355e3-a5ad-4f91-a2c0-c9dc93e10658',
      cssClass: '',
      target: `#${uniqueFormId}`,
    });
  };

  return (
    <NewsletterSignupStyles>
      <div className="wrapper">
        <div className="heading-group">
          <Heading>The latest updates. Delivered monthly.</Heading>
          <Paragraph>
            Capacitor is getting better every day. Sign up for a monthly email on the latest updates, releases,
            articles, and news!
          </Paragraph>
        </div>
        {process.browser && <div className="form-group" id={uniqueFormId}></div>}
      </div>
    </NewsletterSignupStyles>
  );
};

export default NewsletterSignup;
