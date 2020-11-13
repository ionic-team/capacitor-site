import { Component, Element, Prop, h, Fragment } from '@stencil/core';
import { Heading, ResponsiveContainer } from '@ionic-internal/ionic-ds';

import { BlogPost } from './blog-common';
import { BlogData } from '../../data.server/blog';

@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss',
})
export class BlogPage {
  @Prop() data: BlogData[];

  @Element() el;

  render() {
    const { AllPosts } = this;

    if (this.data) {
      return (
        <Fragment>
          <meta-tags
            page-title={`Blog`}
            description={'The lastest news and updates from the Copacitor team'}
            ogType="blog"
          />
          <AllPosts posts={this.data} />

          <ResponsiveContainer>
            <newsletter-signup />
          </ResponsiveContainer>

          <pre-footer />
          <capacitor-site-footer />
        </Fragment>
      );
    }

    return null;
  }

  AllPosts = ({ posts }: { posts: BlogData[] }) => {
    return (
      <div class="blog-posts">
        <hgroup class="blog-posts__heading">
          <Heading level={3}>Blog</Heading>
        </hgroup>
        {posts.map(p => (
          <BlogPost data={p} single={false} />
        ))}
      </div>
    );
  };
}
