/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    // The guest form moved from /guests/check-in; keep links already sent to guests working.
    return [{ source: '/guests/check-in', destination: '/guests/pre-arrival/', permanent: true }];
  },
};
export default nextConfig;
