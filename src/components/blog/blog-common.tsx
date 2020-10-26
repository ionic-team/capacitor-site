import { h } from '@stencil/core';
import { href } from '@stencil/router';
import { Heading, DateTime } from '@ionic-internal/ionic-ds';
import parseISO from 'date-fns/parseISO';
import { BlogData } from '../../data.server/blog';

import { RenderJsxAst } from '@stencil/ssg';

const getBlogPostPath = (data: BlogData) => `/blog/${data.slug}`;
// const getAbsoluteBlogPostUrl = (doc: RenderedBlog) => `https://capacitorjs.com${getBlogPostPath(doc)}`;

export const BlogPost = ({
  data,
  single = true,
}: {
  data: BlogData;
  single?: boolean;
}) => {
  return (
    <div class="blog-post__wrap">
      <article class="blog-post">
        <Heading level={1} class="ui-heading-2">
          <a {...href(getBlogPostPath(data))}>{data.title}</a>
        </Heading>
        <PostAuthor
          authorName={data.authorName}
          authorUrl={data.authorUrl}
          dateISO={data.date}
        />

        {data.featuredImage && <PostFeaturedImage data={data} />}

        <RenderJsxAst ast={data.ast} elementProps={elementRouterHref} />

        {!single && data.preview ? <PostContinueReading data={data} /> : null}

        {/*
        {single && <disqus-comments url={getAbsoluteBlogPostUrl(post)} siteId='capacitor' id={post.slug} />}
        */}
      </article>
    </div>
  );
};

const elementRouterHref = (tagName: string, props: any) => {
  if (tagName === 'a' && typeof props.href === 'string') {
    const currentHost = new URL(document.baseURI).host;
    const gotoHost = new URL(props.href, document.baseURI).host;

    if (currentHost !== gotoHost) {
      return {
        ...props,
        target: '_blank',
        class: 'external-link',
        rel: 'noopener',
      };
    }

    return {
      ...props,
      ...href(props.href),
    };
  }
  return props;
};

const PostFeaturedImage = ({ data }: { data: BlogData }) => (
  <img
    class="blog-post__featured-image"
    src={data.featuredImage}
    alt={data.featuredImageAlt}
  />
);

const PostContinueReading = ({ data }: { data: BlogData }) => (
  <a
    class="blog-post__continue-reading | link"
    {...href(getBlogPostPath(data))}
  >
    Continue reading
    <span class="arrow"> -&gt;</span>
  </a>
);

const PostAuthor = ({
  authorName,
  authorUrl,
  dateISO,
}: {
  authorName: string;
  authorUrl: string;
  dateISO;
}) => {
  const date = parseISO(dateISO);

  return (
    <div class="blog-post__author">
      {/*<img src={a.author_avatar.url} alt={a.author_name} />*/}
      <p>
        By{' '}
        {authorUrl ? (
          <a href={authorUrl} target="_blank">
            {authorName}
          </a>
        ) : (
          authorName
        )}{' '}
        on <DateTime date={date} />
      </p>
    </div>
  );
};
