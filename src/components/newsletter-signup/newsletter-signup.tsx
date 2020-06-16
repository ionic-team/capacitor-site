import { Component, State, h } from '@stencil/core';
import { ResponsiveContainer, Heading, Grid, Col, Button } from '@ionic-internal/sites-shared';

@Component({
  tag: 'newsletter-signup',
  styleUrl: 'newsletter-signup.scss',
  scoped: true
})
export class NewsletterSignup {
  private emailForm: HTMLFormElement;

  @State() emailInvalid: boolean = false;
  @State() emailSuccess: boolean = false;

  sendToHubspot = async (e: UIEvent) => {
    e.preventDefault();
    const url: string = "https://api.hsforms.com/submissions/v3/integration/submit/3776657/c8d355e3-a5ad-4f91-a2c0-c9dc93e10658"

    const data = {
      "submittedAt": Date.now(),
      "fields": [
        {
          "name": "email",
          "value": this.emailForm.email.value
        },
        {
          "name": "first_campaign_conversion",
          "value": "Ionic Newsletter"
        }
      ],
      "context": {
        "hutk": document.cookie.match(/(hubspotutk=).*?(?=;)/g)[0].split("hubspotutk=")[1],
        "pageUri": "https://capacitorjs.com/",
        "pageName": "Capacitor Home"
      }
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });

    response.status == 200 ? this.emailSuccess = true : this.emailInvalid = true;
  }

  render() {
    return (
      <section class="newsletter">
        <ResponsiveContainer>
          <Grid>
            <Col md={6} sm={6} xs={6} cols={12}>
              <hgroup>
                <img src="/assets/img/newsletter-icon.png" alt="newsletter" />
                <div>
                  <Heading level={4}>The Capacitor Newsletter</Heading>
                  <p>Keep up to date with the latest Capacitor news and updates</p>
                </div>
              </hgroup>
            </Col>
            <Col md={6} sm={6} xs={6} cols={12}>
            { !this.emailSuccess &&
            <form onSubmit={this.sendToHubspot}
                  ref={e => this.emailForm = e}
                  class="sc-newsletter-signup">
                <input class="sc-newsletter-signup" aria-label="Email address" type="email" placeholder="Email address" name="email" required />
                { this.emailInvalid && <div class="error__message">invalid email address</div> }
                <Button>Subscribe</Button>      
            </form> }
            
            { this.emailSuccess &&
            <div class="success__message">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 42c11.598 0 21-9.402 21-21S32.598 0 21 0 0 9.402 0 21s9.402 21 21 21z" fill="#D3F3DB"/>
                <path d="M13.87 20.97a1.75 1.75 0 00-2.54 2.408l2.54-2.407zm3.588 6.33l-1.27 1.204a1.75 1.75 0 002.54 0l-1.27-1.204zM30.67 15.904a1.75 1.75 0 00-2.54-2.408l2.54 2.408zm-19.34 7.474l4.858 5.126 2.54-2.408-4.858-5.125-2.54 2.407zm7.398 5.126l11.942-12.6-2.54-2.408-11.942 12.6 2.54 2.408z" fill="#43C465"/>
              </svg>
              <p>Success! You will now receive our email newsletter.</p>
            </div> }
            </Col>
          </Grid>
        </ResponsiveContainer>
      </section>
    );
  }
}
