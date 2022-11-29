import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import { SeoToolsPane } from 'sanity-plugin-seo-tools';

export const getDefaultDocumentNode = () => {
  return S.document().views([
    S.view.form(),
    S.view
      .component(SeoToolsPane)
      .options({
        fetch: true,
        resolveProductionUrl: (doc) => {
          console.log('🚀 ~ file: desk.ts ~ line 13 ~ getDefaultDocumentNode ~ doc', doc);
          return new URL(`http://localhost:3333/${doc?.slug?.current}`);
        },
        select: (doc) => ({
          focus_keyword: doc.seoKeyphrase ?? '',
          seo_title: doc.seoTitle ?? '',
          meta_description: doc.description,
          focus_synonyms: doc.seoKeywords ?? [],
        }),
      })
      .title('SEO'),
  ]);
};

export default S.defaults();
