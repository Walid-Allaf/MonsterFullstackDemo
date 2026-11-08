import {NextResponse} from "next/server";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {uploadDir,validName} from "@/lib/storage";
export const runtime="nodejs";
export async function GET(_req:Request,ctx:{params:Promise<{name:string}>}) {
 const {name}=await ctx.params;
 if(!validName(name))return new NextResponse("Not found",{status:404});
 try{const bytes=await readFile(path.join(uploadDir(),name));
 const type=name.endsWith(".png")?"image/png":name.endsWith(".webp")?"image/webp":"image/jpeg";
 return new NextResponse(new Uint8Array(bytes),{headers:{"Content-Type":type,"Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"}});
 }catch{return new NextResponse("Not found",{status:404})}
}
