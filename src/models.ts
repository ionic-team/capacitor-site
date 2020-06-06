import { Document as PrismicDocument } from 'prismic-javascript/d.ts/documents';
import ApiSearchResponse from 'prismic-javascript/d.ts/ApiSearchResponse';

export interface PrismicDocsResponse {
  docs: PrismicDocument[];
  _prismic: ApiSearchResponse;
}

export interface BlogPostDocument extends PrismicDocument {}

export interface BlogPostsResponse extends PrismicDocsResponse {};

export interface RenderedBlog {
  title: string;
  authorName: string;
  authorEmail: string;
  slug: string;
  date: string;
  contents: string;
  html: string;

  // All frontmatter attrs just in casesies
  meta?: any;
}