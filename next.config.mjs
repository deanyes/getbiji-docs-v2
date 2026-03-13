/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/getbiji-docs-v2',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default nextConfig;
