import { Component, Prop, State, h } from '@stencil/core';

import { getBlogPost } from '../../prismic';
import { BlogPostDocument } from '../../models';
import { BlogPost } from './common';


@Component({
  tag: 'blog-post',
  styleUrl: 'blog-page.scss',
  scoped: true
})
export class BlogPage {
  @Prop() slug: string;

  @State() post?: BlogPostDocument;

  async componentWillLoad() {
    console.log('BLOG COMPONENT WILL LOAD');
    const { slug } = this;

    if (slug) {
      this.slug = slug;
      this.post = await getBlogPost(slug);
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