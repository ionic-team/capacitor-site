import { Component, h } from '@stencil/core';
import {
  ResponsiveContainer,
  Button,
} from '@ionic-internal/ionic-ds';

import Parallax from 'parallax-js'

import Capacitor3Rainbow from '../assets/capacitor-3-rainbow.svg';
import { Background } from '../assets/bg-3-only.svg';
// import { Background } from '../assets/bg-boxes.svg';

@Component({
  tag: 'top-parallax',
  styleUrl: 'top-parallax.scss',
  scoped: true,
})
export class LandingPage {
  $shapes!: HTMLDivElement;
  libID = 'parallax-lib';
  parallaxInstance: Parallax;

  disconnectedCallback() {
    this.parallaxInstance.distroy();
  }

  componentDidLoad() {
    this.parallaxInstance = new Parallax(this.$shapes, {
      invertX: false,
      invertY: false,
      scalarX: 1,
      scalarY: 1,
    });
  }

  render() {
    return (
      <section id="top">
        <ResponsiveContainer>
          <div id="shapes" ref={(el) => this.$shapes = el as HTMLDivElement}>
            <div id="circle-1" data-depth="0.8"/>
            <div id="circle-2" data-depth="0.3"/>
            <div id="circle-3" data-depth="0.6"/>
            <div id="square-1" data-depth="0.7"/>
            <div id="square-2" data-depth="0.7"/>
            <div id="square-3" data-depth="0.6"/>
            <div id="square-4" data-depth="0.3"/>
            <div id="square-5" data-depth="0.1"/>
            <div id="square-6" data-depth="0.2"/>
            <div id="square-7" data-depth="0.3"/>
            <div id="square-8" data-depth="0.5"/>
            <Background id="bg" data-depth="0.3"/>
          </div>
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