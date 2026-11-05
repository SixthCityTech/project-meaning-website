/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: '/:image(hero-garden-v1-800.webp|hero-garden-v1-1400.webp|moodboard-optimized.webp|creativity-painting-ai.webp|connection-conversation-ai.webp|fire-circle-ai.webp)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
    }];
  },
};
module.exports = nextConfig;
