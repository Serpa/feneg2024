/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['i.imgur.com', 'localhost', 'res.cloudinary.com', 'minio.serpaaa.com','feneg-minio.yal8nw.easypanel.host']
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};


export default nextConfig;

