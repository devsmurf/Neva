/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow running multiple dev servers side-by-side without cache conflicts
  // Set with: NEXT_DIST_DIR=.next-3001 next dev -p 3001
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
