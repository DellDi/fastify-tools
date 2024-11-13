/** @type {import('next').NextConfig} */
import { codeInspectorPlugin } from 'code-inspector-plugin'

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    domains: ['avatars.githubusercontent.com', 'qw.yswg360.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }))
    return config
  },
}

export default nextConfig
