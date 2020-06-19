import { h } from '@stencil/core';
import { href } from 'stencil-router-v2';
import { Heading, DateTime } from '@ionic-internal/sites-shared';
import parseISO from 'date-fns/parseISO';

import Router from '../../router';

import { RenderedBlog } from '../../models';

const getBlogPostUrl = (doc: RenderedBlog) => `/blog/${doc.slug}`;


export const BlogPost = ({ post, single = true }: { post: RenderedBlog, single?: boolean }) => {
  const content = single ? post.html : post.html;

  return (
    <div class="blog-post__wrap">
      {single && <a {...href('/blog', Router)}>All posts</a>}
      <div class="blog-post">
        <Heading level={2}><a href={getBlogPostUrl(post)}>{post.title}</a></Heading>
        <PostAuthor authorName={post.authorName} dateString={post.date} />

        <PostContent html={content} />

        {!single && <a {...href(getBlogPostUrl(post), Router)}>Continue reading <ion-icon name="arrow-forward" /></a>}

        {single && <disqus-comments url={getBlogPostUrl(post)} id={post.slug} />}
      </div>
    </div>
  )
}

const PostContent = ({ html }: { html: string }) => (
  <div innerHTML={html} />
);

const PostAuthor = ({ authorName, dateString }: { authorName: string, dateString: string }) => {
  const date = parseISO(dateString);

  return (
    <div class="blog-post__author">
      {/*<img src={a.author_avatar.url} alt={a.author_name} />*/}
      <span>By {authorName} on <DateTime date={date} /></span>
    </div>
  );
}