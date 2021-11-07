import {
  ResourceType,
  ResourceSource,
  Resource,
  PrismicResource,
} from './models';

import { slugify } from '../util/slugify';
import { PrismicClient } from './prismic-configuration';
import { Document as PrismicDocument } from 'prismic-javascript/types/documents';
import { prismicDocToResource, resourceTypeToPrismicType } from './index';
import Prismic from 'prismic-javascript';

export const getResourceTypeForParam = (param: string) =>
  ((
    {
      'articles': ResourceType.Article,
      'blogs': ResourceType.Blog,
      'docs': ResourceType.Doc,
      'case-studies': ResourceType.CaseStudy,
      'courses': ResourceType.Course,
      'customer-interviews': ResourceType.CustomerInterview,
      'ebooks': ResourceType.Ebook,
      'guides': ResourceType.Guide,
      'learning': ResourceType.Learning,
      'podcasts': ResourceType.Podcast,
      'tutorial': ResourceType.Tutorial,
      'videos': ResourceType.Video,
      'webinars': ResourceType.Webinar,
      'whitepapers': ResourceType.Whitepaper,
    } as { [name: string]: ResourceType }
  )[param]);

export const typeToResourceType = (type: string) =>
  ((
    {
      article: ResourceType.Article,
      case_study: ResourceType.CaseStudy,
      ebook: ResourceType.Ebook,
      webinar: ResourceType.Webinar,
      whitepaper: ResourceType.Whitepaper,
      podcast: ResourceType.Podcast,
      video: ResourceType.Video,
    } as any
  )[type]);

export const resourceTypeToPath = (type: ResourceType) =>
  ({
    [ResourceType.Article]: 'articles',
    [ResourceType.Blog]: 'blog',
    [ResourceType.Book]: 'books',
    [ResourceType.CaseStudy]: 'case-studies',
    [ResourceType.Course]: 'courses',
    [ResourceType.CustomerInterview]: 'customer-interviews',
    [ResourceType.Doc]: 'docs',
    [ResourceType.Ebook]: 'ebooks',
    [ResourceType.Guide]: 'guides',
    [ResourceType.Learning]: 'learning',
    [ResourceType.Podcast]: 'podcasts',
    [ResourceType.Tutorial]: 'tutorials',
    [ResourceType.Video]: 'videos',
    [ResourceType.Webinar]: 'webinars',
    [ResourceType.Whitepaper]: 'whitepapers',
  }[type]);

export const getResourceSourceForType = (type: ResourceType) =>
  ({
    [slugify(ResourceType.Article)]: ResourceSource.Prismic,
    [slugify(ResourceType.Blog)]: ResourceSource.Prismic,
    [slugify(ResourceType.CaseStudy)]: ResourceSource.Prismic,
    [slugify(ResourceType.Course)]: ResourceSource.Prismic,
    [slugify(ResourceType.Doc)]: ResourceSource.Prismic,
    [slugify(ResourceType.Ebook)]: ResourceSource.Prismic,
    [slugify(ResourceType.Guide)]: ResourceSource.Prismic,
    [slugify(ResourceType.Podcast)]: ResourceSource.Prismic,
    [slugify(ResourceType.Tutorial)]: ResourceSource.Prismic,
    [slugify(ResourceType.Video)]: ResourceSource.Prismic,
    [slugify(ResourceType.Webinar)]: ResourceSource.Prismic,
    [slugify(ResourceType.Whitepaper)]: ResourceSource.Prismic,
  }[slugify(type)]);

export const getResource = async (type: ResourceType, resourceId: string) => {
  let resource: Resource | null = null;

  let prismicDoc: PrismicDocument | null = null;
  const prismicClient = PrismicClient();

  const prismicType = resourceTypeToPrismicType(type);
  prismicDoc = await prismicClient.getByUID(prismicType, resourceId, {});

  if (!prismicDoc) {
    return null;
  }

  resource = prismicDocToResource(prismicDoc);

  return resource;
};

export const getLandingData = async (type?: ResourceType) => {
  const prismicClient = PrismicClient();

  const prismicType = resourceTypeToPrismicType(type);

  const landingIds = (
    await prismicClient.getSingle('ionic_io_resources', {})
  ).data[prismicType || 'all']
    ?.map(({ resource: { id } }) => id)
    .filter(d => Boolean(d));

  let landingResponse =
    landingIds &&
    (await prismicClient.getByIDs(landingIds, {
      pageSize: 100,
    }));

  const results = landingResponse?.results?.map(d => prismicDocToResource(d));
  let returnData = results?.length > 0 ? results : [];

  if (landingResponse) {
    let nextPage = landingResponse.next_page;

    while (nextPage) {
      const nextPageData = await (
        await fetch(landingResponse.next_page)
      ).json();
      const results = nextPageData.results.map(d => prismicDocToResource(d));

      returnData = [...returnData, ...results];
      nextPage = nextPageData.next_page;
    }

    returnData = returnData
      .filter(d => Boolean(d?.heroImage?.url && d?.id))
      .sort(({ id: idA }, { id: idB }) =>
        landingIds.indexOf(idA) > landingIds.indexOf(idB) ? 1 : -1,
      );
  }

  if (type) {
    const queryString = Prismic.Predicates.at('document.type', prismicType);
    const prismicTypeData = (await prismicClient.query(queryString, {})).results
      .map(d => prismicDocToResource(d))
      .filter(r => Boolean(r?.heroImage?.url && r?.id))
      .filter(r => returnData.every(r2 => !(r2.id === r.id)));

    returnData = [...returnData, ...prismicTypeData];
  }

  return returnData;
};

export const getFilterCategories = async (type?: ResourceType) => {
  const client = PrismicClient();

  const resourceTypes = type ? [type] : Object.values(ResourceType);
  const prismicTypes = resourceTypes.map(type =>
    resourceTypeToPrismicType(type),
  );

  const queryData = Prismic.Predicates.any('document.type', prismicTypes);

  const { total_pages } = await client.query(queryData, { pageSize: 100 });

  const tags: Map<
    string,
    { count: number; info: { resource: PrismicResource; rating: number }[] }
  > = new Map();

  for (let i = 1; i <= total_pages; i++) {
    const response = await client.query(queryData, {
      pageSize: 100,
      page: i,
    });
    const { results } = response;

    results
      .map(d => prismicDocToResource(d))
      .filter(r => r?.heroImage?.url && r?.id)
      .forEach(resource => {
        const { metaTags, id } = resource;
        if (!metaTags) return;

        metaTags.forEach(({ tag, rating }) => {
          const tagSlug = slugify(tag);
          const count = tags.get(tagSlug)?.count;
          const info = tags.get(tagSlug)?.info || [];
          info.push({ resource, rating: rating || 1 });

          tags.set(tagSlug, { count: count ? count + 1 : 1, info });
        });
      });
  }

  return Array.from(tags);
};
