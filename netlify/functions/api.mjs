
import {
  HttpClient,
  AnilistMeta,
  GoyabuProvider
} from '../../dist/index.js';

const http = new HttpClient();
const meta = new AnilistMeta(http);
const content = new GoyabuProvider(http);

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

const reply = (data, status = 200) =>
  Response.json(data, { status, headers });

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'search';
  const q = url.searchParams.get('q');
  const id = url.searchParams.get('id');

  try {
    if (action === 'health') {
      return reply({
        status: 'ok',
        service: 'AnimeFlow API',
        contentProvider: content.id
      });
    }

    if (action === 'search') {
      if (!q) return reply({ error: 'Missing q' }, 400);
      return reply({
        success: true,
        results: await meta.search(q)
      });
    }

    if (action === 'provider-search') {
      if (!q) return reply({ error: 'Missing q' }, 400);
      return reply({
        success: true,
        provider: content.id,
        results: await content.search(q)
      });
    }

    if (action === 'episodes') {
      if (!id) return reply({ error: 'Missing id' }, 400);
      return reply({
        success: true,
        episodes: await content.fetchContentUnits(id)
      });
    }

    if (action === 'stream') {
      if (!id) return reply({ error: 'Missing id' }, 400);
      const result = await content.resolveStream(id);
      return reply({
        success: true,
        result
      });
    }

    return reply({ error: 'Unknown action' }, 400);

  } catch (error) {
    return reply({
      success: false,
      error: error instanceof Error
        ? error.message
        : String(error)
    }, 500);
  }
};
