// File: src/services/scraper.service.ts
import axios from 'axios';
import prisma from '../database/prisma';
import cron from 'node-cron';

export class ScraperService {
  async scrapeJobs() {
    let added = 0;
    let skipped = 0;
    let errors = 0;

    try {
      // Fetching real data from a public job board API (Remotive)
      const response = await axios.get('https://remotive.com/api/remote-jobs?limit=15');
      const jobs = response.data.jobs || [];

      for (const job of jobs) {
        try {
          const exists = await prisma.scrapedJob.findUnique({ where: { url: job.url } });
          if (exists) {
            skipped++;
            continue;
          }

          // Strip heavy HTML from description for DB storage
          const cleanDescription = job.description.replace(/<[^>]*>?/gm, '').substring(0, 2000);

          await prisma.scrapedJob.create({
            data: {
              source: 'Remotive API',
              url: job.url,
              title: job.title,
              company: job.company_name,
              description: cleanDescription,
              skills: job.tags || [],
              location: job.candidate_required_location || 'Remote',
              postedDate: new Date(job.publication_date),
            }
          });
          added++;
        } catch (err) {
          errors++;
        }
      }
    } catch (error) {
      console.error('Failed to fetch from public scraper API:', error);
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