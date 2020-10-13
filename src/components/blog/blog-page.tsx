import { Component, Prop, h } from '@stencil/core';
import { Heading } from '@ionic-internal/ionic-ds';

import { BlogPost } from './blog-common';
import { BlogData } from '../../data.server/blog';



@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss',
})
export class BlogPage {
  @Prop() data: BlogData[] ;

  render() {
    const { AllPosts } = this;

    if (this.data) {
      return [
        <AllPosts posts={this.data} />,
        <pre-footer />,
        <newsletter-signup />,
        <capacitor-site-footer />
      ]
    }

    return null;
  }

  AllPosts = ({ posts }: { posts: BlogData[] }) => {

    return (
      <div class="blog-posts">
        <hgroup class="blog-posts__heading">
          <Heading level={3}>Blog</Heading>
        </hgroup>
        {posts.map(p => <BlogPost data={p} single={false} />)}
      </div>
    )
  }
}


