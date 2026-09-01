/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    '/api/photos/*': ['./image*.jpg', './photos/**/*.jpg'],
    '/api/background': ['./backgroung.jpg', './photos/backgroung.jpg'],
    '/api/music': ['./ebose.mp3', './photos/ebose.mp3'],
  },
}

export default nextConfig
