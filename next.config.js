/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd-mobile'],
  output: 'standalone',
  
  // 添加压缩配置
  compress: true,
  
  // 优化构建输出
  webpack: (config, { dev, isServer }) => {
    // 生产环境才进行优化
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 24000000, // 24MB 以下
          cacheGroups: {
            default: false,
            vendors: false,
            // 主要依赖打包
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // antd 相关
            antd: {
              chunks: 'all',
              name: 'antd',
              test: /[\\/]node_modules[\\/](@ant-design|antd|antd-mobile)[\\/]/,
              priority: 30,
              enforce: true,
            },
            // 其他大型依赖
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
  
  // 优化图片
  images: {
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  }
}

module.exports = nextConfig 