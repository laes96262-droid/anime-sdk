
import {
  HttpClient,
  startServer,
  AnilistMeta
} from './dist/index.js';

const http = new HttpClient();

startServer({
  providers: [],
  metaProviders: [new AnilistMeta(http)],
  port: Number(process.env.PORT || 3000),
  proxy: false
});
