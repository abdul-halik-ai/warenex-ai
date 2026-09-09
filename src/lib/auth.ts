import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "WAREHOUSE_MANAGER" | "SUPERVISOR" | "OPERATOR" | "VIEWER";
  passwordHash: string; // plain check for demo
}

export const DEMO_USERS: Record<string, { id: string; email: string; name: string; role: DemoUser["role"]; pass: string }> = {
  "admin@warenex.ai": {
    id: "usr_admin_01",
    email: "admin@warenex.ai",
    name: "Alex Vance (Chief Warehouse Officer)",
    role: "ADMIN",
    pass: "admin123"
  },
  "manager@warenex.ai": {
    id: "usr_mgr_01",
    email: "manager@warenex.ai",
    name: "Sarah Chen (Operations Director)",
    role: "WAREHOUSE_MANAGER",
    pass: "manager123"
  },
  "supervisor@warenex.ai": {
    id: "usr_sup_01",
    email: "supervisor@warenex.ai",
    name: "Marcus Brody (Shift Lead)",
    role: "SUPERVISOR",
    pass: "super123"
  },
  "operator@warenex.ai": {
    id: "usr_op_01",
    email: "operator@warenex.ai",
    name: "Elena Rostova (Lead Picker)",
    role: "OPERATOR",
    pass: "operator123"
  },
  "viewer@warenex.ai": {
    id: "usr_view_01",
    email: "viewer@warenex.ai",
    name: "James Miller (Auditor)",
    role: "VIEWER",
    pass: "viewer123"
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email.toLowerCase().trim();
        const user = DEMO_USERS[email];

        if (!user || user.pass !== credentials.password) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
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
