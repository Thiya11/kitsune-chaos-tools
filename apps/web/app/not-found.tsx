import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="text-6xl font-bold text-zinc-700">404</div>
      <h2 className="text-xl font-semibold text-zinc-300">Page not found</h2>
      <p className="text-zinc-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
      >
        Go home
      </Link>
    </div>
  )
}
