// Convenience for machines without MongoDB: boots a throw-away in-memory MongoDB,
// seeds it and starts the API. Data is lost when you stop it. Use a real MONGO_URI for anything else.
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawnSync, spawn } from 'node:child_process';

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri('karthi-clothing');
console.log(`[dev-memory] in-memory MongoDB at ${uri}`);
const env = { ...process.env, MONGO_URI: uri };

spawnSync('node', ['src/seed.js'], { stdio: 'inherit', env });
const server = spawn('node', ['--watch', 'src/index.js'], { stdio: 'inherit', env });

const stop = async () => { server.kill(); await mongod.stop(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
