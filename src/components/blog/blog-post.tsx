import { Component, Prop, State, h } from '@stencil/core';

import { RenderedBlog } from '../../models';
import { BlogPost } from './blog-common';

import posts from '../../assets/blog.json';

@Component({
  tag: 'blog-post',
  styleUrl: 'blog-page.scss',
  scoped: true
})
export class BlogPage {
  @Prop() slug: string;

  @State() post?: RenderedBlog;

  async componentWillLoad() {
    console.log('BLOG COMPONENT WILL LOAD');
    const { slug } = this;

    if (slug) {
      this.slug = slug;
      this.post = (posts as RenderedBlog[]).find(p => p.slug === this.slug);
      console.log('Fetching blog post', slug, this.post);
    }
  }

  render() {
    if (this.slug && this.post) {
      return (
        <BlogPost post={this.post} />
      )
    }
    return null;
  }
}