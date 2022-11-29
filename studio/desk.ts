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
        resolveProductionUrl: (doc) => new URL(`https://sanity.io/${doc?.slug?.current}`),
        select: (doc) => ({
          focus_keyword: doc.focus_keyword ?? '',
          seo_title: doc.seo_title ?? '',
          meta_description: doc.meta_description ?? '',
          focus_synonyms: doc.focus_synonyms ?? [],
        }),
      })
      .title('SEO'),
  ]);
};

export default S.defaults();
