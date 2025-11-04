/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['jsonplaceholder.typicode.com', 'source.unsplash.com', 'i.pravatar.cc'],
  },
};

export default nextConfig;
