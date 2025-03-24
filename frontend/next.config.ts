/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // Enables static site generation
  distDir: "out",   // Ensures output goes to 'out' folder
  images: {
    unoptimized: true, // Ensures compatibility with static hosting
  },
  trailingSlash: true, // Fixes broken links for static sites
};

module.exports = nextConfig;
