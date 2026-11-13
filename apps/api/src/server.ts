import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Silwasa API Server running at http://localhost:${env.PORT}`);
  console.log(`📡 Health check available at http://localhost:${env.PORT}/api/v1/health`);
  console.log(`🔧 Environment: ${env.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
