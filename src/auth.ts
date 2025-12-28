import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import Kakao from "next-auth/providers/kakao";
import type { JWT } from "next-auth/jwt";
import { getSupabaseClient } from "./app/api/supabase";
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 30, // 30분 (초 단위)
  },
  jwt: {
    maxAge: 60 * 30, // 30분 (선택이지만 명시해두면 더 명확)
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!, // 필수
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(creds) {
        try {
          const email = creds?.email as string;
          const password = creds?.password as string;
          const supabase = getSupabaseClient();
          if (!email || !password) return null;

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error || !data.user) return null;

          // NextAuth는 최소 id 필요
          return {
            id: data.user.id,
            email: data.user.email ?? undefined,
            name: data.user.user_metadata?.name ?? undefined,
          };
        } catch (e) {
          console.error("authorize error:", e);
          return null; // 실패는 null로
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "kakao") {
          // 카카오 로그인일 때는 '고정 id'로 이메일 사용
          token.sub = user.email ?? token.sub;
        } else {
          // credentials 등 다른 로그인은 기존처럼
          token.sub = user.id;
        }

        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // email까지 확실히 있는 경우에만 user 세팅
      if (token?.sub && token.email) {
        session.user = {
          id: token.sub,
          email: token.email,
          name: token.name ?? null,
        } as Session["user"];
      } else {
        session.user = null;
      }

      return session;
    },
    async signIn({ user, account }) {
      // 카카오 말고 다른 로그인(예: credentials)은 그냥 통과
      if (account?.provider !== "kakao") {
        return true;
      }

      // 카카오가 이메일 안 주는 경우도 있어서 방어 코드
      if (!user?.email) {
      
        return true; // 일단 로그인은 통과시키고, DB는 안 건드림
      }

      const email = user.email;
      const supabase = getSupabaseClient();
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email);


        // 에러 없고, 해당  아직 없을 때만 upsert
        if (!error && data && data.length === 0) {
          const { error: upsertError } = await supabase.from("users").upsert([
            {
              id: email,
              email,
              name: user.name,
              image: (user as any).image ?? null,
              provider: "kakao",
            },
          ]);

          if (upsertError) {
            console.error("users upsert error:", upsertError);
          } else {
            console.log("users upsert success");
          }
        }
      } catch (e) {
        console.error("signIn callback error:", e);
      }

      return true;
    },
  },
});
