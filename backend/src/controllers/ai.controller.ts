import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const matchResume = catchAsync(async (req: Request, res: Response) => {
  const { resumeText, jobDescription } = req.body;
  
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ status: 'error', message: 'Missing resume text or job description' });
  }

  // Simulated AI response for the technical assessment
  // In a real scenario, we would call the Gemini API here
  const score = Math.floor(Math.random() * 40) + 60; // 60 to 100
  const matchResult = {
    score,
    strengths: ['Relevant experience in the required stack', 'Strong problem solving skills mentioned'],
    weaknesses: ['Missing a few secondary skills', 'Experience duration is slightly shorter than requested'],
    recommendation: score > 80 ? 'Highly Recommended' : 'Recommended'
  };

  res.status(200).json({ status: 'success', data: matchResult });
});
