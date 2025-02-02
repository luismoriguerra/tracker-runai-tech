import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'remodeling-tracker.pages.dev',
      },
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
