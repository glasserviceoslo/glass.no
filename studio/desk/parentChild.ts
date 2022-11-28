import S from '@sanity/desk-tool/structure-builder';
import documentStore from 'part:@sanity/base/datastore/document';
import { map } from 'rxjs/operators';
import { FiTag } from 'react-icons/fi';

// You may need to customise your `views` array here for adding live preview iframes, incoming references, etc
const views = [S.view.form()];

export default function parentChild(schemaType = 'category' as any) {
  const categoryParents = `_type == "${schemaType}" && !defined(parent) && !(_id in path("drafts.**"))`;

  return S.listItem(schemaType)
    .title('Categories')
    .icon(FiTag)
    .child(() =>
      documentStore.listenQuery(`*[${categoryParents}]`).pipe(
        map((parents: any) =>
          S.list()
            .title('All Categories')
            .menuItems([
              S.menuItem()
                .title('Add Category')
                .icon(FiTag)
                .intent({ type: 'create', params: { type: schemaType } }),
            ])
            .items([
              S.listItem()
                .title('Parent Categories')
                .schemaType(schemaType)
                .child(() =>
                  S.documentList()
                    .schemaType(schemaType)
                    .title('Parent Categories')
                    .filter(categoryParents)
                    // @ts-ignore
                    .canHandleIntent(() => S.documentTypeList(schemaType).getCanHandleIntent())
                    .child((id) => S.document().documentId(id).views(views).schemaType(schemaType)),
                ),
              S.divider(),
              ...parents.map((parent) =>
                S.listItem({
                  id: parent._id,
                  title: parent.title,
                  schemaType,
                  child: () =>
                    S.documentTypeList(schemaType)
                      .title('Child Categories')
                      .filter(`_type == "${schemaType}" && parent._ref == $parentId`)
                      .params({ parentId: parent._id })
                      .initialValueTemplates([
                        // @ts-ignore
                        S.initialValueTemplateItem('category-child', {
                          parentId: parent._id,
                        }),
                      ]),
                }),
              ),
            ]),
        ),
      ),
    );
}
