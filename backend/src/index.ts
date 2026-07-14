import app from './app';
import { env } from './config/env';
import prisma from './database/prisma';
import { scraperService } from './services/scraper.service';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    const port = env.PORT ? Number(env.PORT) : 5000;
    
    // The addition of '0.0.0.0' exposes the server properly inside Docker
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${port}`);
      scraperService.initCronJob();
    });
  } catch (error) {
    console.error('❌ Failed to connect to database', error);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});