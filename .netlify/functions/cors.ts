import type { Handler } from '@netlify/functions';

const corsOrigin = process.env.NODE_ENV === 'development' ? `http://localhost:3333` : `https://glass-no.sanity.studio`;

const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': corsOrigin,
      'access-control-allow-credentials': true,
    },
  };
};

export { handler };
