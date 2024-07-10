// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  token: string;
  user: {
    name: string;
    role_id: number;
    username: string;
    email: string;
  };
};

const secret = "asfafasfasjfhasf";
if (!secret) {
  throw new Error("No session secret provided");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "psgh-admion-session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secrets: [secret],
      // secure: true,
    },
  });
