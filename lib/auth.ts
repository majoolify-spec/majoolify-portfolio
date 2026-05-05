import type { Session } from "next-auth";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { cookies } from "next/headers";

const ADMIN_BYPASS_COOKIE = "majoolify-admin-bypass";

function getAllowedUsers() {
  return (process.env.GITHUB_ADMIN_USERS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function isBypassEnabled() {
  return process.env.NODE_ENV !== "production" && Boolean(process.env.ADMIN_BYPASS_TOKEN);
}

function canUseGitHubProvider() {
  return Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET && process.env.AUTH_SECRET);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || "development-auth-secret",
  session: { strategy: "jwt" },
  providers: canUseGitHubProvider()
    ? [
        GitHubProvider({
          clientId: process.env.GITHUB_ID || "",
          clientSecret: process.env.GITHUB_SECRET || "",
        }),
      ]
    : [],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "login" in profile) {
        token.githubLogin = String(profile.login);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.githubLogin === "string") {
        session.user.githubLogin = token.githubLogin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
};

export const authHandler = NextAuth(authOptions);

export function isAuthorizedAdmin(session: Session | null) {
  const login = session?.user?.githubLogin?.toLowerCase();
  return Boolean(login && getAllowedUsers().includes(login));
}

export async function getAdminAccess() {
  const session = await getServerSession(authOptions);

  if (isAuthorizedAdmin(session)) {
    return {
      authorized: true as const,
      source: "github" as const,
      label: session?.user?.githubLogin || session?.user?.name || "GitHub admin",
    };
  }

  if (isBypassEnabled()) {
    const cookieStore = await cookies();
    const bypassToken = cookieStore.get(ADMIN_BYPASS_COOKIE)?.value;

    if (bypassToken && bypassToken === process.env.ADMIN_BYPASS_TOKEN) {
      return {
        authorized: true as const,
        source: "bypass" as const,
        label: "Local bypass admin",
      };
    }
  }

  return {
    authorized: false as const,
    source: "none" as const,
    label: "Visitor",
  };
}

export function getAdminBypassCookieName() {
  return ADMIN_BYPASS_COOKIE;
}

export function getAdminSignInUrl() {
  return "/api/auth/signin/github?callbackUrl=/admin";
}

export function getAdminSignOutUrl() {
  return "/api/auth/signout?callbackUrl=/en";
}
