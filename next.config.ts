import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/invocations',
        destination: 'http://strands-agents:9000/invocations',
      },
    ];
  },
};

export default nextConfig;
