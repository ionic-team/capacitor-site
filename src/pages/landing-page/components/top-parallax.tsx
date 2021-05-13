import { Component, h } from '@stencil/core';
import {
  ResponsiveContainer,
  Button,
} from '@ionic-internal/ionic-ds';

import Capacitor3Rainbow from '../assets/capacitor-3-rainbow.svg';
import BgBoxes from '../assets/bg-boxes.svg';

@Component({
  tag: 'top-parallax',
  styleUrl: 'top-parallax.scss',
  scoped: true,
})
export class LandingPage {

  render() {
    return (
      <section id="top">
        <ResponsiveContainer>
          <BgBoxes/>
          <Capacitor3Rainbow />
          <h1>
            <span class="reveal">Faster.</span>
            <span class="reveal">Smaller.</span>
            <span class="reveal">Simpler.</span>
          </h1>
          <p class="reveal">
            A brand new approach to building native apps with the Web — now even
            faster, more modular, and more enjoyable to build with than ever.
          </p>
          <div class="btns">
            <Button
              class="reveal"
              kind="round"
              color="indigo"
              variation="light"
              href="/docs/getting-started"
              anchor={true}
            >
              Try Capacitor 3 <span>{'->'}</span>
            </Button>
            <Button
              class="reveal"
              kind="round"
              color="indigo"
              href="https://ionicframework.com/blog/announcing-capacitor-3-0/"
              anchor={true}
            >
              Read the Blog post <span>{'->'}</span>
            </Button>
          </div>
        </ResponsiveContainer>
      </section>
    );
  }
}