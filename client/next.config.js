/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // Disable this as linting in the remote server takes very long.
    // We shall lint locally before pushing and deploying to production.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable this as building in the remote server takes very long.
    // This shall be checked in the dev environment before it goes to production.
    ignoreBuildErrors: true,
  },
  
}

module.exports = nextConfig
