import {NextResponse} from "next/server";
import {isAdmin} from "@/lib/auth";
import {uploadDir,detectType} from "@/lib/storage";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
import {randomUUID} from "node:crypto";
export const runtime="nodejs";
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 try {const f=(await req.formData()).get("image");
 if(!(f instanceof File) || f.size===0 || f.size>3*1024*1024)return NextResponse.json({error:"Image missing or larger than 3MB"},{status:400});
 const bytes=Buffer.from(await f.arrayBuffer()),ext=detectType(bytes);
 if(!ext)return NextResponse.json({error:"Only valid JPG, PNG, WEBP images"},{status:400});
 const dir=uploadDir();await mkdir(dir,{recursive:true});const name=`${randomUUID()}.${ext}`;
 await writeFile(path.join(dir,name),bytes,{flag:"wx"});return NextResponse.json({name},{status:201});
 }catch{return NextResponse.json({error:"Storage is not writable or upload failed"},{status:500})}
}
