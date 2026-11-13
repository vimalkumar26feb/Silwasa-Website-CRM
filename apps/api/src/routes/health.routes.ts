import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../db/client.js';

const router: Router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  const dbStatus = await checkDatabaseConnection();

  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'silwasa-api',
    version: '1.0.0',
    database: {
      provider: 'postgresql',
      connected: dbStatus.connected,
      message: dbStatus.connected ? 'Connected to PostgreSQL' : dbStatus.error
    }
  });
});

export default router;
