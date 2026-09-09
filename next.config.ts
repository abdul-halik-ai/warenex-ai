import type { NextConfig } from "next";

const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || vercelUrl,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "warenex-ai-enterprise-secret-key-2026-fallback",
  },
};

export default nextConfig;
