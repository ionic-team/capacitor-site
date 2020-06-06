import { Component, State, h } from '@stencil/core';
import { Heading } from '@ionic-internal/sites-shared';

import { getBlogPosts } from '../../prismic';
import { BlogPostsResponse } from '../../models';
import { BlogPost } from './blog-common';


@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss',
  scoped: true
})
export class BlogPage {
  @State() posts?: BlogPostsResponse;

  async componentWillLoad() {
    this.posts = await getBlogPosts();
  }

  render() {
    if (this.posts) {
      return (
        <AllPosts posts={this.posts} />
      )
    }

    return null;
  }
}


const AllPosts = ({ posts }: { posts: BlogPostsResponse }) => {

  return (
    <div class="blog-posts">
      <hgroup class="blog-posts__heading">
        <Heading level={3}>Blog</Heading>
      </hgroup>
      {posts.docs.map(p => <BlogPost post={p} single={false} />)}
    </div>
  )
}