/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: "C:/Users/noaho/OneDrive/Desktop/projects/geolert", // 👈 force correct root
  },
};

export default nextConfig;
