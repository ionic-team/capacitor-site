import { Component, Prop, h, Host } from '@stencil/core';
import { BlogPost } from './blog-common';
import { Heading } from '@ionic-internal/ionic-ds';
import { href } from '@stencil/router';
import Helmet from '@stencil/helmet';
import { BlogData } from '../../data.server/blog';
import Router from '../../router';

@Component({
  tag: 'blog-post',
  styleUrl: 'blog-page.scss',
})
export class BlogPage {
  @Prop() data: BlogData;


  render() {
    console.log(this.data);
    if (this.data) {
      return (
        <Host>
          <Helmet>
            <title>{this.data.title} - Capacitor Blog - Cross-platform native runtime for web apps</title>
            <meta
              name="description"
              content={this.data.description}
            />
            <meta name="twitter:description" content={`${this.data.description} - Capacitor Blog`} />
            <meta property="og:image" content={this.data.featuredImage || 'https://capacitorjs.com/assets/img/og.png'} />
          </Helmet>
          <div class="blog-posts">
            <hgroup class="blog-posts__heading">
              <Heading level={3}><a {...href('/blog', Router)}>Blog</a></Heading>
            </hgroup>
            <BlogPost data={this.data} />
          </div>
          <pre-footer />
          <newsletter-signup />
          <capacitor-site-footer />
        </Host>
      )
    }
    return null;
  }
}