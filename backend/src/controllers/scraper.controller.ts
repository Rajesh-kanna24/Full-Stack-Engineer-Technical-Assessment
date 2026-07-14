import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { scraperService } from '../services/scraper.service';

export const triggerScraper = catchAsync(async (req: Request, res: Response) => {
  const result = await scraperService.scrapeJobs();
  res.status(200).json({ status: 'success', data: result });
});
