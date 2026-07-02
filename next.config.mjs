/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
