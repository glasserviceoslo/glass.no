import S from '@sanity/desk-tool/structure-builder';
import { SeoToolsPane } from 'sanity-plugin-seo-tools';

const path = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://glass-no.sanity.studio';

export const getDefaultDocumentNode = () => {
  return S.document().views([
    S.view.form(),
    S.view
      .component(SeoToolsPane)
      .options({
        fetch: true,
        resolveProductionUrl: (doc) => {
          console.log('🚀 ~ file: desk.ts ~ line 13 ~ getDefaultDocumentNode ~ doc', doc);
          return new URL(`${path}/${doc?.slug?.current}`);
        },
        select: (doc) => ({
          focus_keyword: doc.seoKeyphrase ?? '',
          seo_title: doc.seoTitle ?? '',
          meta_description: doc.description,
          focus_synonyms: doc.seoKeywords ?? [],
        }),
      })
      .title('SEO Analysis'),
  ]);
};

export default S.defaults();
