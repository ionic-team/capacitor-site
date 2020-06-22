import { Component, State, h } from '@stencil/core';

import { RenderedBlog } from '../../models';
import { BlogPost } from './blog-common';

import posts from '../../assets/blog.json';


@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss'
  // Not scoped since blog content is rendered as HTML
})
export class BlogPage {
  @State() posts?: RenderedBlog[];

  async componentWillLoad() {
    this.posts = (posts as RenderedBlog[]).slice(0, 10);
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


const AllPosts = ({ posts }: { posts: RenderedBlog[] }) => {

  return (
    <div class="blog-posts">
      {posts.map(p => <BlogPost post={p} single={false} />)}
    </div>
  )
}