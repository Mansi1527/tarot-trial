import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'ts'], 
  trailingSlash: false,
  output: "standalone",
  // Ensures TSX/TS files are recognized
};

export default nextConfig;
