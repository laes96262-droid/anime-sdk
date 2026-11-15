
import {
  HttpClient,
  AnilistMeta,
  AnimeParadiseProvider
} from '../../dist/index.js';

const http = new HttpClient();
const meta = new AnilistMeta(http);
const content = new AnimeParadiseProvider(http);

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

function reply(data, status = 200) {
  return Response.json(data, { status, headers });
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'search';
  const q = url.searchParams.get('q');
  const id = url.searchParams.get('id');

  try {
    if (action === 'health') {
      return reply({
        success: true,
        status: 'ok',
        service: 'AnimeFlow API',
        provider: content.id
      });
    }

    if (action === 'search') {
      if (!q) {
        return reply({ success: false, error: 'Missing q' }, 400);
      }

      const results = await meta.search(q);
      return reply({ success: true, results });
    }

    if (action === 'provider-search') {
      if (!q) {
        return reply({ success: false, error: 'Missing q' }, 400);
      }

      const results = await content.search(q);
      return reply({
        success: true,
        provider: content.id,
        results
      });
    }

    if (action === 'episodes') {
      if (!id) {
        return reply({ success: false, error: 'Missing id' }, 400);
      }

      const episodes = await content.fetchContentUnits(id);

      return reply({
        success: true,
        provider: content.id,
        total: episodes.length,
        episodes
      });
    }

    if (action === 'stream') {
      if (!id) {
        return reply({ success: false, error: 'Missing id' }, 400);
      }

      const result = await content.resolveStream(id);

      return reply({
        success: true,
        provider: content.id,
        result
      });
    }

    if (action === 'tracks') {
      if (!id) {
        return reply({ success: false, error: 'Missing id' }, 400);
      }

      const tracks = await content.fetchUnitTracks(id);

      return reply({
        success: true,
        provider: content.id,
        tracks
      });
    }

    return reply({
      success: false,
      error: 'Unknown action'
    }, 400);

  } catch (error) {
    return reply({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
}
