import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up the stray lockfile in the home dir.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
