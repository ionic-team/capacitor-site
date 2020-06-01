import { Component, Prop, State, h } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import { getBlogPost, getBlogPosts } from '../../prismic';
import { BlogPostDocument, BlogPostsResponse } from '../../models';

@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss'
})
export class BlogPage {
  @Prop() match?: MatchResults;

  @State() posts?: BlogPostsResponse;
  @State() post?: BlogPostDocument;

  @State() slug: string;

  async componentWillLoad() {
    const slug = this.match?.params.slug;

    if (slug) {
      this.slug = slug;
      this.post = await getBlogPost(slug);
    } else {
      this.posts = await getBlogPosts();
    }
  }

  constructor() {
    document.title = `Capacitor Blog - Build cross-platform apps with the web`;
  }

  render() {
    if (this.slug && this.post) {
      return (
        <BlogPost post={this.post} />
      )
    } else {
      return (
        <AllPosts posts={this.posts} />
      )
    }
  }
}

const getBlogPostUrl = (doc: BlogPostDocument) => `/url/${doc.data.slug}`;

const BlogPost = ({ post }: { post: BlogPostDocument, single?: boolean }) => (
  <div class="blog-post">
    <disqus-comments url={getBlogPostUrl(post)} id={post.uid} />
  </div>
)

const AllPosts = ({ posts }: { posts: BlogPostsResponse }) => posts.docs.map(p => <BlogPost post={p} single={false} />);
