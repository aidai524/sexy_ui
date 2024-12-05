/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd-mobile'],
  output: 'standalone',
  

  compress: true,
  rewrites: async () => [
    {
      source: '/api/v1/:path*',
      destination: 'https://api.dumpdump.fun/api/v1/:path*'
    },
  ],

  webpack: (config, { dev, isServer }) => {

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 24000000, 
          cacheGroups: {
            default: false,
            vendors: false,

            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },

            antd: {
              chunks: 'all',
              name: 'antd',
              test: /[\\/]node_modules[\\/](@ant-design|antd|antd-mobile)[\\/]/,
              priority: 30,
              enforce: true,
            },

            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 20,
            },
          }
        }
      }
    }
    return config
  },
  images: {
    domains: ['picsum.photos'], 
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig 