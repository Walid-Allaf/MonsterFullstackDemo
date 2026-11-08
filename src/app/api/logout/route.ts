import {NextResponse} from "next/server";
import {cookieName,cookieOptions} from "@/lib/auth";
export async function POST(){const r=NextResponse.json({ok:true});r.cookies.set(cookieName,"",{...cookieOptions(),maxAge:0});return r;}
