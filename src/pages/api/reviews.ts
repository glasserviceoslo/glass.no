import type { APIRoute } from 'astro';
import { join } from 'node:path';
import { google } from 'googleapis';
import { writeFile, readFile } from 'node:fs/promises';

export const prerender = false;

const SCOPES = [
  'https://www.googleapis.com/auth/plus.business.manage',
  'https://www.googleapis.com/auth/business.manage',
];

const REVIEWS_URL =
  'https://mybusiness.googleapis.com/v4/accounts/103147633551444246078/locations/11292797228068896680/reviews';

const REVIEWS_FILE_PATH = join(process.cwd(), 'src/assets/reviews.json');

async function saveReviews(reviews: Record<string, ANY>) {
  try {
    await writeFile(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2));
    console.log('Reviews saved to file');
  } catch (error) {
    console.error('Error saving reviews:', error);
  }
}

async function getStoredReviews() {
  try {
    const data = await readFile(REVIEWS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No stored reviews found');
    return null;
  }
}

export const GET: APIRoute = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
      scopes: SCOPES,
    });

    const token = await auth.getAccessToken();
    if (!token) {
      throw new Error('Failed to get access token');
    }

    const reviewsResponse = await fetch(REVIEWS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const reviewsData = await reviewsResponse.json();
    console.log('Reviews response:', reviewsResponse.status);

    // Save new reviews to file if request was successful
    if (reviewsResponse.ok) {
      await saveReviews(reviewsData);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Reviews updated successfully',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch new reviews',
        status: reviewsResponse.status,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
