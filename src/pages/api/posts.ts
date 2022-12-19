import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'csbn9wp4',
  dataset: 'glassno',
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  token: '', // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
});

export async function getAllPosts() {
  const query = `*[_type == 'post']{"categoryData": categories[]->{slug, title},author -> {name}, ...} | order(publishedAt desc)`;
  const data = await client.fetch(query);
  return data;
}
