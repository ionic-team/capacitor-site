import { Component, Element, h } from '@stencil/core';

@Component({
  tag: 'newsletter-signup',
  styleUrl: 'newsletter-signup.scss'
})
export class NewsletterSignup {
  @Element() el: HTMLElement;

  async sendToHubspot(e: UIEvent) {
    e.preventDefault();
    const form: HTMLFormElement = this.el.querySelector('form');
    const url: string = "https://api.hsforms.com/submissions/v3/integration/submit/3776657/c8d355e3-a5ad-4f91-a2c0-c9dc93e10658"

    const data = {
      "submittedAt": Date.now(),
      "fields": [
        {
          "name": "email",
          "value": form.email.value
        },
        {
          "name": "first_campaign_conversion",
          "value": "Ionic Newsletter"
        }
      ],
      "context": {
        "hutk": document.cookie.match(/(?<=hubspotutk=).*?(?=;)/g)[0],
        "pageUri": "https://capacitor.ionicframework.com/",
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

    if (response.status == 200) {
      this.displaySuccess();
    }

  }

  displaySuccess() {
    const form: HTMLFormElement = this.el.querySelector('form');
    form.style.display = 'none';

    const successMsg: HTMLElement = this.el.querySelector('.success__message');
    successMsg.style.display = 'flex';
  }

  render() {
    return (
      <section class="newsletter">
        <div class="container">
          <hgroup>
            <h2>Subscribe to our newsletter</h2>
            <p>The latest Capacitor news and resources sent straight to your inbox.</p>
          </hgroup>
          <form onSubmit={this.sendToHubspot.bind(this)}>
            <div class="input-with-button">
              <input aria-label="Email address" type="email" placeholder="Email address" name="email" required />
              <button>Subscribe</button>
            </div>
          </form>
          <div class="success__message">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 42c11.598 0 21-9.402 21-21S32.598 0 21 0 0 9.402 0 21s9.402 21 21 21z" fill="#D3F3DB"/>
              <path d="M13.87 20.97a1.75 1.75 0 00-2.54 2.408l2.54-2.407zm3.588 6.33l-1.27 1.204a1.75 1.75 0 002.54 0l-1.27-1.204zM30.67 15.904a1.75 1.75 0 00-2.54-2.408l2.54 2.408zm-19.34 7.474l4.858 5.126 2.54-2.408-4.858-5.125-2.54 2.407zm7.398 5.126l11.942-12.6-2.54-2.408-11.942 12.6 2.54 2.408z" fill="#43C465"/>
            </svg>
            <p>Success! You will now receive our email newsletter.</p>
          </div>
        </div>
      </section>
    );
  }
}
