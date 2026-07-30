/** @type {import('next').NextConfig} */
const nextConfig = {

  // GitHub Pages serves project sites from https://<user>.github.io/<repo>/
  // Set NEXT_PUBLIC_BASE_PATH="/<repo-name>" in your build environment (see README)
  // if you are NOT using a custom domain or a <user>.github.io root repo.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',

  images: {
    // Static export cannot use the Next.js image optimisation server
    unoptimized: true,
  },

  trailingSlash: true,
};

export default nextConfig;
