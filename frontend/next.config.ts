/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // Ensures Next.js generates static HTML files
  distDir: "out",   // Next.js will output static files here
  images: {
    unoptimized: true, // Ensures compatibility with static hosting
  },
  trailingSlash: true, // Fixes potential 404 issues
};

module.exports = nextConfig;
