/** @type {import('next').NextConfig} */
const nextConfig = {
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
            { protocol: 'http', hostname: 'feneg-minio.yal8nw.easypanel.host' }
        ],
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};

export default nextConfig;
