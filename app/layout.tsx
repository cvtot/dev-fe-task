import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Our Blog - Resources and Insights',
  description:
    'The latest industry news, interviews, technologies, and resources.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
