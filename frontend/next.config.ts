import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@next/swc-darwin-x64',
      'node_modules/@next/swc-darwin-arm64',
      'node_modules/@next/swc-linux-x64-gnu',
      'node_modules/@next/swc-linux-x64-musl',
      'node_modules/@next/swc-win32-x64-msvc',
    ],
  },
};

export default nextConfig;
