import { Component, Prop, State, h, Host } from '@stencil/core';

import { RenderedBlog } from '../../models';
import { BlogPost } from './blog-common';

import posts from '../../assets/blog.json';
import { Heading } from '@ionic-internal/sites-shared';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'blog-post',
  styleUrl: 'blog-page.scss',
})
export class BlogPage {
  @Prop() slug: string;

  @State() post?: RenderedBlog;

  async componentWillLoad() {
    const { slug } = this;

    if (slug) {
      this.slug = slug;
      this.post = (posts as RenderedBlog[]).find(p => p.slug === this.slug);
    }
  }

  render() {
    if (this.slug && this.post) {
      return (
        <Host>
          <div class="blog-posts">
            <hgroup class="blog-posts__heading">
              <Heading level={3}><a {...href('/blog')}>Blog</a></Heading>
            </hgroup>
            <BlogPost post={this.post} />
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