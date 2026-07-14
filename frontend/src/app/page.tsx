import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          AI JobPortal
        </div>
        <nav className="space-x-6 hidden md:flex items-center">
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">Find Jobs</Link>
          <Link href="/companies" className="hover:text-blue-600 transition-colors">Companies</Link>
          <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
        </nav>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-8 pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 blur-[100px] bg-gradient-to-br from-blue-500 to-purple-500 pointer-events-none rounded-full" />
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl z-10">
            The Next Generation <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              AI Job Portal
            </span>
          </h1>
          <p className="mt-8 text-xl text-gray-600 dark:text-gray-400 max-w-2xl z-10 leading-relaxed">
            Discover the best opportunities curated by our advanced AI resume matching. 
            Automated scraping ensures you never miss a job listing from top tech companies.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 z-10">
            <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
              Explore Jobs
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
              Post a Job
            </Button>
          </div>
        </section>

        {/* Features/Stats Section */}
        <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-4xl font-bold text-blue-600">10k+</div>
              <h3 className="text-xl font-semibold">Active Jobs</h3>
              <p className="text-gray-500 dark:text-gray-400">Aggregated automatically every 6 hours.</p>
            </div>
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-4xl font-bold text-indigo-600">95%</div>
              <h3 className="text-xl font-semibold">AI Match Rate</h3>
              <p className="text-gray-500 dark:text-gray-400">Our AI accurately matches your resume to JD.</p>
            </div>
            <div className="space-y-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-4xl font-bold text-purple-600">5k+</div>
              <h3 className="text-xl font-semibold">Companies</h3>
              <p className="text-gray-500 dark:text-gray-400">Top tech companies are hiring here.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
        <p>&copy; {new Date().getFullYear()} AI JobPortal. All rights reserved.</p>
      </footer>
    </div>
  );
}
