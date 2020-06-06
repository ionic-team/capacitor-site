import { h } from '@stencil/core';
import { BlogPostDocument } from '../../models';
import { href } from 'stencil-router-v2';
import { Heading, PrismicRichText, DateTime } from '@ionic-internal/sites-shared';

import parseISO from 'date-fns/parseISO';

import Router from '../../router';

const getBlogPostUrl = (doc: BlogPostDocument) => `/blog/${doc.uid}`;


export const BlogPost = ({ post, single = true }: { post: BlogPostDocument, single?: boolean }) => {
  const content = single ? post.data.content : post.data.lead;

  return (
    <div class="blog-post__wrap">
      {single && <a {...href('/blog')}>Blog</a>}
      <div class="blog-post">
        <Heading level={2}>{post.data.title}</Heading>
        <PostAuthor author={post.data.author} dateString={post.first_publication_date} />
        <PrismicRichText richText={content} routerLink={true} router={Router} />

        {!single && <a {...href(getBlogPostUrl(post))}>Continue reading <ion-icon name="arrow-forward" /></a>}

        {single && <disqus-comments url={getBlogPostUrl(post)} id={post.uid} />}
      </div>
    </div>
  )
}


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