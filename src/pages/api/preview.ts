import type { APIRoute } from 'astro';
import BlogPost from '../../components/Astro/BlogPost.astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    if (!data || !data.post) {
      throw new Error('Invalid request data: missing post');
    }

    // Render the BlogPost component with the preview data
    // const html = await BlogPost({ post: data.post });

    return new Response(`<div>${JSON.stringify(data.post)}</div>`, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Preview error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process preview' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};