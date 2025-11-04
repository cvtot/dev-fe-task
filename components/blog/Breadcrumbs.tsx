import Link from 'next/link';

interface BreadcrumbsProps {
  category: string;
}

export default function Breadcrumbs({ category }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        <li className="text-gray-900 font-medium">{category}</li>
      </ol>
    </nav>
  );
}

