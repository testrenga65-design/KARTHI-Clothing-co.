import env from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(env.port, () => console.log(`[server] http://localhost:${env.port}  (${env.isProd ? 'production' : 'development'})`));
}

main().catch((err) => {
  console.error('[server] failed to start:', err.message);
  process.exit(1);
});
