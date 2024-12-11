import type { APIRoute } from 'astro';
import { join } from 'node:path';
import { google } from 'googleapis';

export const prerender = false;
const SCOPES = [
  'https://www.googleapis.com/auth/plus.business.manage',
  'https://www.googleapis.com/auth/business.manage',
];
// const BUSINESS_API_BASE = 'https://mybusiness.googleapis.com/v4';
const BUSINESS_API_BASE = 'https://mybusinessaccountmanagement.googleapis.com/v1';
export const GET: APIRoute = async () => {
  try {
    // const auth = await authenticate({
    //   keyfilePath: join(process.cwd(), 'credentials.json'),
    //   scopes: SCOPES,
    // });
    const auth = new google.auth.GoogleAuth({
      keyFile: join(process.cwd(), 'credentials.json'),
      scopes: SCOPES,
    });

    const accessToken = await auth.getAccessToken();
    console.log(accessToken);
    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    // First, get accounts
    const accountsResponse = await fetch(`${BUSINESS_API_BASE}/accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const accountsData = await accountsResponse.json();

    if (!accountsData.accounts || accountsData.accounts.length === 0) {
      return new Response(JSON.stringify({ error: 'No accounts found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accountName = accountsData.accounts[0].name;

    const locationsResponse = await fetch(`${BUSINESS_API_BASE}/${accountName}/locations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Response', locationsResponse);
    // const locationsData = await locationsResponse.json();
    // console.log('Locations:', locationsData);

    // if (locationsData.locations && locationsData.locations.length > 0) {
    //   const locationName = locationsData.locations[0].name;
    //   const reviewsResponse = await fetch(`${BUSINESS_API_BASE}/${locationName}/reviews`, {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });
    //   const reviewsData = await reviewsResponse.json();

    //   return new Response(
    //     JSON.stringify({
    //       accounts: accountsData,
    //       locations: locationsData,
    //       reviews: reviewsData,
    //     }),
    //     {
    //       status: 200,
    //       headers: { 'Content-Type': 'application/json' },
    //     },
    //   );
    // }

    return new Response(
      JSON.stringify({
        // accounts: accountsData,
        // locations: locationsData,
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
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
