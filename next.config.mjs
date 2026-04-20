/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
                ],
            },
        ];
    },
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        workerThreads: false,
        cpus: 1,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'i.imgur.com' },
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'minio.serpaaa.com' },
            { protocol: 'https', hostname: 'feneg-minio.yal8nw.easypanel.host' },
            { protocol: 'https', hostname: 'feneg-minio.zj8qie.easypanel.host' },
            { protocol: 'http', hostname: 'feneg-minio.yal8nw.easypanel.host' },
            { protocol: 'http', hostname: 'feneg-minio.zj8qie.easypanel.host' }
        ],
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};

export default nextConfig;
