/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kitsune/tools', '@kitsune/ui', '@kitsune/physics'],
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig
