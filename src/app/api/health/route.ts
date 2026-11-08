import {NextResponse} from "next/server";
import {pingDb} from "@/lib/db";
export const runtime="nodejs";
export async function GET(){
 let db=false;try {db=await pingDb()}catch (error) {
  console.error(
    "[Database Health Check Error]",
    error instanceof Error ? error.message : "Unknown error"
  );
 }
 return NextResponse.json({app:"ok",database:db,storage:"check by uploading an image in /admin"},{status:db?200:503,headers:{"Cache-Control":"no-store"}});
}
