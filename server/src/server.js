import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { runSeeds } from './seed/index.js';

async function start() {
  await connectDatabase();
  await runSeeds();
  app.listen(env.port, () => console.log(`CMS API listening on port ${env.port}`));
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
