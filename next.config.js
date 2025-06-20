/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'docs',
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/amazon-dsp-kargo-selector' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/amazon-dsp-kargo-selector' : '',
}

module.exports = nextConfig