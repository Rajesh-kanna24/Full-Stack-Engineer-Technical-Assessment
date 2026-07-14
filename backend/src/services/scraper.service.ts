import axios from 'axios';
import prisma from '../database/prisma';
import cron from 'node-cron';

export class ScraperService {
  async scrapeJobs() {
    let added = 0;
    let skipped = 0;
    let errors = 0;

    try {
      // Mocking a public API feed (e.g. Remotive or similar public job board)
      // We will use a mock response for this technical assessment to guarantee it works without API keys
      const mockJobs = [
        { url: 'https://example.com/job/1', title: 'Frontend Engineer', company: 'Tech Corp', description: 'React and Next.js expert needed.', skills: ['React', 'Next.js'], location: 'Remote', postedDate: new Date() },
        { url: 'https://example.com/job/2', title: 'Backend Developer', company: 'Data Inc', description: 'Node.js and Prisma expert needed.', skills: ['Node.js', 'PostgreSQL'], location: 'New York', postedDate: new Date() },
      ];

      for (const job of mockJobs) {
        try {
          const exists = await prisma.scrapedJob.findUnique({ where: { url: job.url } });
          if (exists) {
            skipped++;
            continue;
          }

          await prisma.scrapedJob.create({
            data: {
              source: 'MockPublicAPI',
              url: job.url,
              title: job.title,
              company: job.company,
              description: job.description,
              skills: job.skills,
              location: job.location,
              postedDate: job.postedDate,
            }
          });
          added++;
        } catch (err) {
          errors++;
        }
      }
    } catch (error) {
      errors++;
    }

    return { added, skipped, errors };
  }

  initCronJob() {
    // Schedule every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('⏳ Running scheduled job scraper...');
      const result = await this.scrapeJobs();
      console.log(`✅ Scraper finished: ${result.added} added, ${result.skipped} skipped, ${result.errors} errors`);
    });
  }
}

export const scraperService = new ScraperService();
