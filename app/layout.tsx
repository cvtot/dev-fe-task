import type { Metadata } from 'next';
import './globals.css';
import BlogHeader from '@/components/Header';

export const metadata: Metadata = {
  title: 'Posts Explorer',
  description: 'Explore posts from JSONPlaceholder with pagination and filtering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BlogHeader/>
        <main className="container mx-auto p-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
