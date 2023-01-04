/** @jsxImportSource react */

import { getSanityImageURL } from '$lib/sanity.image';
import type { Author } from '$lib/sanity.queries';

export default function AuthorAvatar(props: Author) {
  const { name, picture } = props;
  return (
    <div className="flex items-center">
      <div className="relative mr-4 h-12 w-12">
        <img
          src={
            picture?.asset?._ref
              ? getSanityImageURL(picture).height(96).width(96).fit('crop').url()
              : 'https://source.unsplash.com/96x96/?face'
          }
          className="rounded-full"
          height={96}
          width={96}
          // @TODO add alternative text to avatar image schema
          alt=""
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
}
