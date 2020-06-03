import { Component, Prop, State, h } from '@stencil/core';
import { getBlogPost, getBlogPosts } from '../../prismic';
import { BlogPostDocument, BlogPostsResponse } from '../../models';

import parseISO from 'date-fns/parseISO';

import { PrismicRichText, Heading, DateTime } from '@ionic-internal/sites-shared';

@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss',
  scoped: true
})
export class BlogPage {
  @Prop() slug: string;

  @State() posts?: BlogPostsResponse;
  @State() post?: BlogPostDocument;

  async componentWillLoad() {
    const { slug } = this;

    if (slug) {
      this.slug = slug;
      this.post = await getBlogPost(slug);
      console.log('Fetching blog post', slug, this.post);
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
      console.log('Rendering posts', this.posts);
      return (
        <AllPosts posts={this.posts} />
      )
    }
  }
}

const getBlogPostUrl = (doc: BlogPostDocument) => `/blog/${doc.uid}`;

const getContentPreview = (post: BlogPostDocument) => {
  const content = post.data.content;
  if (content.findIndex(c => c.text === '<!--more-->') < 0) {
    return content;
  }
  return content.slice(0, content.findIndex(c => c.text === '<!--more-->'));
}

const getFullContent = (post: BlogPostDocument) => post.data.content.filter(c => c.text !== '<!--more-->')

const BlogPost = ({ post, single = true }: { post: BlogPostDocument, single?: boolean }) => {
  const content = single ? getFullContent(post) : getContentPreview(post);

  return (
    <div class="blog-post">
      <Heading level={2}>{post.data.title}</Heading>
      <PostAuthor author={post.data.author} dateString={post.first_publication_date} />
      <PrismicRichText richText={post.data.lead} />
      <PrismicRichText richText={content} />

      {!single && content.length < post.data.content.length ? (
        <a href={getBlogPostUrl(post)}>Continue reading</a>
      ) : null}

      {single && <disqus-comments url={getBlogPostUrl(post)} id={post.uid} />}
    </div>
  )
}

const AllPosts = ({ posts }: { posts: BlogPostsResponse }) =>
  posts.docs.map(p => <BlogPost post={p} single={false} />);

const PostAuthor = ({ author, dateString }: any) => {
  const a = author[0];

  const date = parseISO(dateString);

  return (
    <div class="blog-post__author">
      <img src={a.author_avatar.url} alt={a.author_name} />
      <span>By {a.author_name} on <DateTime date={date} /></span>
    </div>
  );
}