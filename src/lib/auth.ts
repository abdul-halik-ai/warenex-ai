import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  badgeId: string;
  role: "ADMIN" | "WAREHOUSE_MANAGER" | "SUPERVISOR" | "OPERATOR" | "VIEWER";
  pass: string;
  defaultRedirect: string;
}

export const DEMO_USERS: Record<string, DemoUser> = {
  "admin@warenex.ai": {
    id: "usr_admin_01",
    email: "admin@warenex.ai",
    badgeId: "ADM-001",
    name: "Alex Vance (Chief Warehouse Officer)",
    role: "ADMIN",
    pass: "admin123",
    defaultRedirect: "/"
  },
  "manager@warenex.ai": {
    id: "usr_mgr_01",
    email: "manager@warenex.ai",
    badgeId: "MGR-102",
    name: "Sarah Chen (Operations Director)",
    role: "WAREHOUSE_MANAGER",
    pass: "manager123",
    defaultRedirect: "/"
  },
  "supervisor@warenex.ai": {
    id: "usr_sup_01",
    email: "supervisor@warenex.ai",
    badgeId: "SUP-305",
    name: "Marcus Brody (Shift Lead)",
    role: "SUPERVISOR",
    pass: "super123",
    defaultRedirect: "/alerts"
  },
  "operator@warenex.ai": {
    id: "usr_op_01",
    email: "operator@warenex.ai",
    badgeId: "OP-7749",
    name: "Elena Rostova (Lead Picker)",
    role: "OPERATOR",
    pass: "operator123",
    defaultRedirect: "/picking"
  },
  "viewer@warenex.ai": {
    id: "usr_view_01",
    email: "viewer@warenex.ai",
    badgeId: "AUD-901",
    name: "James Miller (Auditor)",
    role: "VIEWER",
    pass: "viewer123",
    defaultRedirect: "/digital-twin"
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Badge ID", type: "text" },
        password: { label: "Password or PIN", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const inputIdentifier = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password.trim();

        // Search by email or Badge ID
        const matchedUser = Object.values(DEMO_USERS).find(
          (u) =>
            u.email.toLowerCase() === inputIdentifier ||
            u.badgeId.toLowerCase() === inputIdentifier
        );

        if (!matchedUser || matchedUser.pass !== inputPassword) {
          throw new Error("Invalid email/badge or password/PIN");
        }

        return {
          id: matchedUser.id,
          email: matchedUser.email,
          name: matchedUser.name,
          role: matchedUser.role,
          badgeId: matchedUser.badgeId,
          defaultRedirect: matchedUser.defaultRedirect
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.badgeId = (user as any).badgeId;
        token.defaultRedirect = (user as any).defaultRedirect;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).badgeId = token.badgeId;
        (session.user as any).defaultRedirect = token.defaultRedirect;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "warenex-ai-enterprise-secret-key-2026-fallback",
};
