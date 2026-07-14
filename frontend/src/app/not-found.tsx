export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/10 p-10 text-center backdrop-blur">
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-slate-400">The page you were looking for does not exist.</p>
      </div>
    </div>
  );
}
