/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['i.imgur.com', 'localhost', 'res.cloudinary.com']
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '80mb'
        }
    }
};


export default nextConfig;

