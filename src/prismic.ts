import { Document as PrismicDocument } from 'prismic-javascript/d.ts/documents';
import { Client } from './prismic-configuration';
import { PrismicDocsResponse } from './models';

export const getBlogPost = async (slug: string): Promise<PrismicDocument> => {
  const prismicClient = Client();
  return prismicClient.getByUID('blog', slug, {});
}

export const getBlogPosts = async (_page: number = 0, pageSize = 10): Promise<PrismicDocsResponse> => {
  const prismicClient = Client();

  const res = await prismicClient.query('', { pageSize });

  return {
    docs: res.results,
    _prismic: {
      ...res
    }
  }
}