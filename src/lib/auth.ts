import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE="monster_demo_session";
const hours = 12;
function secret() { const s=process.env.SESSION_SECRET; if (!s || s.length<32) throw new Error("SESSION_SECRET must have at least 32 chars"); return s; }
function sign(payload:string) { return createHmac("sha256",secret()).update(payload).digest("hex"); }
export function makeSession() { const data=String(Date.now()+hours*3600_000); return `${data}.${sign(data)}`; }
export async function isAdmin() {
  const token=(await cookies()).get(COOKIE)?.value;
  if(!token) return false;
  const [data, mac, extra]=token.split(".");
  if(extra || !data || !mac || !/^\d+$/.test(data) || Date.now()>Number(data)) return false;
  const expected=Buffer.from(sign(data),"hex"); const actual=Buffer.from(mac,"hex");
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
export function cookieOptions() {
  return { httpOnly:true, sameSite:"strict" as const, secure:process.env.NODE_ENV==="production", path:"/", maxAge:hours*3600 };
}
export const cookieName=COOKIE;
export function safePasswordMatch(candidate:string) {
  const expected=process.env.ADMIN_PASSWORD || "";
  const a=createHmac("sha256",secret()).update(candidate).digest();
  const b=createHmac("sha256",secret()).update(expected).digest();
  return !!expected && timingSafeEqual(a,b);
}
