/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

// routage 
module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/table',
          permanent: true,
        },
      ];
    },
  };