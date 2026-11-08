import {NextResponse} from "next/server";
import {isAdmin} from "@/lib/auth";
import {listProducts,addProduct,deleteProduct} from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 try{return NextResponse.json(await listProducts(),{headers:{"Cache-Control":"no-store"}})}catch{return NextResponse.json({error:"Database error"},{status:503})}
}
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 try {const data=await req.json(); const name=String(data.name??"").trim(), description=String(data.description??"").trim();
 const image=data.image===null || data.image===undefined ? null:String(data.image);
 if(!name || name.length>160 || !description || description.length>3000 || (image!==null && !/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(image)))
  return NextResponse.json({error:"Invalid product fields"},{status:400});
 return NextResponse.json({id:await addProduct(name,description,image)},{status:201});
 }catch{return NextResponse.json({error:"Could not save product"},{status:500})}
}
export async function DELETE(req:Request){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 const id=Number(new URL(req.url).searchParams.get("id"));
 if(!Number.isSafeInteger(id) || id<1)return NextResponse.json({error:"Bad ID"},{status:400});
 try {return NextResponse.json({deleted:await deleteProduct(id)});}catch{return NextResponse.json({error:"Database error"},{status:503})}
}
