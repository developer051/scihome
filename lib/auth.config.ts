import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAdminsCollection } from "@/models/Admin";

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;
        const admins = await getAdminsCollection();
        const admin = await admins.findOne({ email });
        if (!admin) return null;
        const ok = await bcrypt.compare(password, admin.passwordHash);
        if (!ok) return null;
        return {
          id: admin._id!.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = (token as any).role;
      return session;
    },
  },
};

export default authConfig;


