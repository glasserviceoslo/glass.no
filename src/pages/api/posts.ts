import { indexQuery } from '$lib/sanity.queries';
import { projectId, dataset, apiVersion, useCdn } from '$lib/sanity.api';
import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

export async function getAllPosts() {
  return await client.fetch(indexQuery);
}
