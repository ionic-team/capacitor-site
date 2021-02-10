import { Document as PrismicDocument } from 'prismic-javascript/d.ts/documents';
import { Client } from './prismic-configuration';
import { PrismicDocsResponse } from './models';
import Prismic from 'prismic-javascript';
import { MapParamData } from '@stencil/router';

export const getPage: MapParamData = async (_params, url) => {
  let data: any = {};

  switch (url.pathname) {
    case '/':
      data = {
        ...(await queryPrismic('capacitor_homepage')),
        whitepaper_ad: await queryPrismic('capacitor_whitepaper_ad'),
        announcement: await queryPrismic('capacitor_homepage_announcement'),
      };
      break;
    case '/community':
      data = await queryPrismic('capacitor_community');
      break;
    case '/enterprise':
      data = await queryPrismic('capacitor_enterprise');
      break;
  }

  data.announcement_bar = await queryPrismic('announcement_bar');

  return data;
};

export const getBlogPost = async (slug: string): Promise<PrismicDocument> => {
  const prismicClient = Client();
  return prismicClient.getByUID('blog', slug, {});
};

export const getBlogPosts = async (
  _page: number = 0,
  pageSize = 10,
): Promise<PrismicDocsResponse> => {
  const prismicClient = Client();

  const res = await prismicClient.query(
    Prismic.Predicates.at('document.type', 'blog'),
    { pageSize },
  );

  return {
    docs: res.results,
    _prismic: {
      ...res,
    },
  };
};

export const queryPrismic = async (prismicId: string) => {
  try {
    const prismicClient = Client();
    const response: PrismicDocument = await prismicClient.getSingle(
      prismicId,
      {},
    );

    return response.data;
  } catch (e) {
    console.warn(e);
  }
};
