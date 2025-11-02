import Link from 'next/link';

export default function BlogHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/blog" className="text-2xl font-bold text-gray-900">
            Freebify
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide">
              Home
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide">
              Features
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide">
              Typography
            </Link>
          </nav>

          {/* Search */}
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

