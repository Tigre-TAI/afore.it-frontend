import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export - use Lambda@Edge for redirects
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  
  // NOTE: Redirects in next.config.ts don't work with static export
  // Use CloudFront Lambda@Edge function (see redirects/cloudfront-lambda-edge.js)
  // OR remove "output: export" and use Next.js middleware (see src/middleware.ts)
  
  // If switching from static export, uncomment this:
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/it',
  //       permanent: true, // 301
  //     },
  //   ];
  // },
};

export default nextConfig;
