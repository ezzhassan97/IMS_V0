/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placeholder.svg', 'images.unsplash.com'],
    unoptimized: true,
  },
  // Optimize build output
  output: 'standalone',
  // Reduce the size of the build output
  compress: true,
  // Increase the build timeout
  experimental: {
    // Reduce memory usage during builds
    optimizeCss: true,
    // Optimize font loading
    optimizeFonts: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
