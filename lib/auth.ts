import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

// Mock user database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "admin",
    username: "admin",
    password: "$2a$10$5Zz5YqJ5Y5J5Y5J5Y5J5YO5J5Y5J5Y5J5Y5J5Y5J5Y5J5Y5J5Y5Jm", // admin123456
    role: "Administrator",
  },
];

// Hash the password for comparison (for demo purposes)
// In production, passwords should already be hashed in the database
const MOCK_PASSWORD_HASH = bcrypt.hashSync("admin123456", 10);
users[0].password = MOCK_PASSWORD_HASH;

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = users.find(
          (u) =>
            u.username === credentials.username ||
            u.email === credentials.username
        );

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
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
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
