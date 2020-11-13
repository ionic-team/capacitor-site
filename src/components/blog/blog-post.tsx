import { Component, Prop, h, Host } from '@stencil/core';
import { BlogPost } from './blog-common';
import { Heading, ResponsiveContainer } from '@ionic-internal/ionic-ds';
import { BlogData } from '../../data.server/blog';

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
          <meta-tags
            page-title={`${this.data.title} - Blog`}
            description={this.data.description}
            image={
              this.data.featuredImage ||
              'https://capacitorjs.com/assets/img/og.png'
            }
            authorTwitter={getTwitterUserFromURL(this.data.authorUrl)}
            ogType="blog"
          />
          <div class="blog-posts">
            <hgroup class="blog-posts__heading">
              <Heading level={3}>Blog</Heading>
            </hgroup>
            <BlogPost data={this.data} />
          </div>

          <ResponsiveContainer>
            <newsletter-signup />
          </ResponsiveContainer>

          <pre-footer />
          <capacitor-site-footer />
        </Host>
      );
    }
    return null;
  }
}

const getTwitterUserFromURL = (url: string): string | undefined => {
  return url.indexOf('twitter.com') != -1
    ? `@${url.replace('https://twitter.com/', '')}`
    : undefined;
};
