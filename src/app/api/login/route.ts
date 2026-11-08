import {NextResponse} from "next/server";
import {cookieName,cookieOptions,makeSession,safePasswordMatch} from "@/lib/auth";
export const runtime="nodejs";
export async function POST(req:Request){
 try {const {email,password}=await req.json();
 const validEmail=typeof email==="string" && email.toLowerCase()===process.env.ADMIN_EMAIL?.toLowerCase();
 if(!validEmail || typeof password!=="string" || !safePasswordMatch(password))
  return NextResponse.json({error:"Invalid credentials"},{status:401,headers:{"Cache-Control":"no-store"}});
 const r=NextResponse.json({ok:true});r.cookies.set(cookieName,makeSession(),cookieOptions());return r;
 }catch{return NextResponse.json({error:"Login failed"},{status:400})}
}
