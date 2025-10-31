import type {NextConfig} from 'next';

// Use static export only for mobile builds
const isMobileBuild = process.env.BUILD_TARGET === 'mobile';

const nextConfig: NextConfig = {
  /* config options here */
  ...(isMobileBuild && { output: 'export' }),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: isMobileBuild, // Only unoptimize for mobile builds
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...(isMobileBuild && { trailingSlash: true }), // Only for mobile
};

export default nextConfig;
