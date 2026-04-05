/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kitsunechaos/tools', '@kitsunechaos/ui', '@kitsunechaos/physics'],
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig
