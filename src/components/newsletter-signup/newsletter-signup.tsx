import { Component, h } from '@stencil/core';
import { ResponsiveContainer, Heading, Grid, Col, Button } from '@ionic-internal/sites-shared';

@Component({
  tag: 'newsletter-signup',
  styleUrl: 'newsletter-signup.scss',
  scoped: true
})
export class NewsletterSignup {
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
              <form action="https://codiqa.createsend.com/t/t/s/flhuhj/" method="post">
                <input aria-label="Email address" type="email" placeholder="Email address" id="fieldEmail" name="cm-flhuhj-flhuhj" required />
                <Button type='submit'>Subscribe</Button>
              </form>
            </Col>
          </Grid>
        </ResponsiveContainer>
      </section>
    );
  }
}
