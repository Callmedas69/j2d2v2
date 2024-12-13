/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@nounsspeak/translator'],
    typescript: {
      ignoreBuildErrors: false,
    }
  }
  
  export default nextConfig