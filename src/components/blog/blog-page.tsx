import { Component, Prop, h, Fragment } from '@stencil/core';
import { Heading, ResponsiveContainer } from '@ionic-internal/ionic-ds';

import { BlogPost } from './blog-common';
import { BlogData } from '../../data.server/blog';

@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss',
})
export class BlogPage {
  @Prop() data: BlogData[];

  render() {
    const { AllPosts } = this;

    if (this.data) {
      return (
        <Fragment>
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
