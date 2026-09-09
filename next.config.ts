import type { NextConfig } from "next";

const vercelUrl = process.env.VERCEL_URL && process.env.VERCEL_URL.trim().length > 0
  ? `https://${process.env.VERCEL_URL.trim()}`
  : "https://warenex-ai.vercel.app";

const authUrl = (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim().length > 0)
  ? (process.env.NEXTAUTH_URL.startsWith("http") ? process.env.NEXTAUTH_URL : `https://${process.env.NEXTAUTH_URL}`)
  : vercelUrl;

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: authUrl,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "warenex-ai-enterprise-secret-key-2026-fallback",
  },
};

export default nextConfig;
