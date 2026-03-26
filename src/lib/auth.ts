// src/lib/auth.ts
// NextAuth.js configuration for Wollnut Labs

import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("auth");

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      role: "USER" | "ADMIN";
      creditsBalance: number;
    };
  }

  interface User {
    role: "USER" | "ADMIN";
    creditsBalance: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "ADMIN";
    creditsBalance: number;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        if (user.bannedAt) {
          throw new Error("Account has been suspended");
        }

        log.info("Credentials sign-in", { userId: user.id });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          creditsBalance: Number(user.creditsBalance),
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // On first OAuth sign-up, grant free credits
      if (account && account.type === "oauth" && user.id) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { createdAt: true, creditsBalance: true },
          });

          // If user was just created (within last 30 seconds), grant welcome credits
          if (existingUser) {
            const isNew =
              Date.now() - existingUser.createdAt.getTime() < 30_000;
            if (isNew && Number(existingUser.creditsBalance) === 0) {
              // Look up welcome credits from SystemSetting
              const setting = await prisma.systemSetting.findUnique({
                where: { key: "new_user_credits" },
              });
              const credits = setting
                ? Number((setting.value as { amount?: number }).amount ?? 5)
                : 5;

              await prisma.$transaction([
                prisma.user.update({
                  where: { id: user.id },
                  data: { creditsBalance: { increment: credits } },
                }),
                prisma.transaction.create({
                  data: {
                    userId: user.id,
                    type: "BONUS",
                    amount: credits,
                    balance: credits,
                    description: `Welcome bonus: $${credits} free credits`,
                  },
                }),
              ]);

              log.info("Granted welcome credits to new OAuth user", {
                userId: user.id,
                credits,
              });
            }
          }
        } catch (error) {
          log.error("Failed to grant welcome credits", error);
          // Don't block sign-in if credit grant fails
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.creditsBalance = Number(user.creditsBalance ?? 0);
      }

      // Refresh user data from DB on session update
      if (trigger === "update" && session) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, creditsBalance: true, name: true, image: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.creditsBalance = Number(dbUser.creditsBalance);
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.creditsBalance = token.creditsBalance;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      log.info("User signed in", { userId: user.id });
    },
  },
  debug: process.env.NODE_ENV === "development",
};
