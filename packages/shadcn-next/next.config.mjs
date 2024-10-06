/** @type {import('next').NextConfig} */
import { codeInspectorPlugin } from 'code-inspector-plugin';

const nextConfig = {
  webpack: (config, {dev, isServer}) => {
    config.plugins.push(codeInspectorPlugin({bundler: 'webpack'}));
    return config;
  },
};

export default nextConfig;
