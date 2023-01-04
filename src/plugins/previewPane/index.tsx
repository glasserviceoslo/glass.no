/** @jsxImportSource react */

import type { DefaultDocumentNodeResolver } from 'sanity/desk';
import authorType from '$schemas/author';
import postType from '$schemas/post';

import AuthorAvatarPreviewPane from './AuthorAvatarPreviewPane';
import PostPreviewPane from './PostPreviewPane';

export const previewDocumentNode = ({
  apiVersion,
  previewSecretId,
}: {
  apiVersion: string;
  previewSecretId: `${string}.${string}`;
}): DefaultDocumentNodeResolver => {
  return (S, { schemaType }) => {
    switch (schemaType) {
      case authorType.name:
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <AuthorAvatarPreviewPane
                name={document.displayed.name as any}
                picture={document.displayed.picture as any}
              />
            ))
            .title('Preview'),
        ]);

      case postType.name:
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <PostPreviewPane
                slug={document.displayed.slug?.current}
                apiVersion={apiVersion}
                previewSecretId={previewSecretId}
              />
            ))
            .title('Preview'),
        ]);

      default:
        return null;
    }
  };
};
