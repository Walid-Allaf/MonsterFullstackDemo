import path from "node:path";
export function uploadDir() {return process.env.UPLOAD_DIR || path.join(process.cwd(),"uploads");}
export function validName(name:string) {return /^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name);}
export function detectType(bytes:Buffer):"jpg"|"png"|"webp"|null {
 if(bytes.length>=3 && bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff)return "jpg";
 if(bytes.length>=8 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return "png";
 if(bytes.length>=12 && bytes.toString("ascii",0,4)==="RIFF" && bytes.toString("ascii",8,12)==="WEBP")return "webp";
 return null;
}
