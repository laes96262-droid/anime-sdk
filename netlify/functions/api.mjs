
import {
  HttpClient,
  AnilistMeta
} from '../../dist/index.js';

const meta = new AnilistMeta(new HttpClient());

export default async (request) => {
  const url = new URL(request.url);

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    if (url.pathname.endsWith('/health')) {
      return Response.json({ status: 'ok' }, { headers });
    }

    const query = url.searchParams.get('q');

    if (!query) {
      return Response.json({
        status: 'ok',
        message: 'AnimeFlow API',
        usage: '?q=Frieren'
      }, { headers });
    }

    const results = await meta.search(query);

    return Response.json({
      success: true,
      results
    }, { headers });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers });
  }
};
