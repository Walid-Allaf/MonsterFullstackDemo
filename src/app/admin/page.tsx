"use client";
import Link from "next/link";
import {FormEvent, useEffect, useState} from "react";
type Product={id:number;name:string;description:string;image:string|null};
export default function Admin() {
 const [auth,setAuth]=useState<boolean|null>(null),[email,setEmail]=useState(""),[password,setPassword]=useState("");
 const [products,setProducts]=useState<Product[]>([]),[name,setName]=useState(""),[description,setDescription]=useState("");
 const [file,setFile]=useState<File|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function reload() {
  const r=await fetch("/api/products",{cache:"no-store"});
  if(r.status===401){setAuth(false);return;}
  if(!r.ok)throw new Error("Unable to load products");
  setProducts(await r.json());setAuth(true);
 }
 useEffect(()=>{reload().catch(e=>setMessage(e.message));},[]);
 async function login(e:FormEvent) {e.preventDefault();setBusy(true);setMessage("");try{
  const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  if(!r.ok) throw new Error("بيانات الدخول غير صحيحة أو إعدادات السيرفر ناقصة");
  setPassword(""); await reload();
 }catch(e){setMessage((e as Error).message)}finally{setBusy(false)}}
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage("");try {
  let image:null|string=null;
  if(file){const f=new FormData();f.append("image",file);const r=await fetch("/api/upload",{method:"POST",body:f});
   const data=await r.json();if(!r.ok)throw new Error(data.error || "فشل رفع الصورة");image=data.name;}
  const r=await fetch("/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,description,image})});
  const data=await r.json();if(!r.ok)throw new Error(data.error || "فشل حفظ المنتج");
  setName("");setDescription("");setFile(null);const input=document.getElementById("file") as HTMLInputElement|null;if(input)input.value="";
  setMessage("تمت إضافة المنتج. جرّب إعادة تشغيل الموقع أو إعادة النشر للتأكد من استمرار البيانات والصور.");await reload();
 }catch(e){setMessage((e as Error).message)}finally{setBusy(false)}}
 async function remove(id:number) { if(!confirm("حذف المنتج؟"))return;setBusy(true);try{
  const r=await fetch(`/api/products?id=${id}`,{method:"DELETE"});if(!r.ok)throw new Error("فشل الحذف");await reload();
 }catch(e){setMessage((e as Error).message)}finally{setBusy(false)}}
 async function logout(){await fetch("/api/logout",{method:"POST"});setAuth(false);setProducts([]);}
 return <main className="container"><header className="bar"><strong>ALBAZIKI · ADMIN TEST</strong><Link href="/" className="btn outline">عرض الموقع</Link></header>
  <section className="hero small"><span className="eyebrow">FULL STACK TEST PANEL</span><h1>لوحة إدارة المنتجات</h1><p>إضافة منتجات وصور إلى SQL Server والتخزين المحلي الدائم.</p></section>
  {message && <p className="notice">{message}</p>}
  {auth===null ? <p>جارِ التحقق من الجلسة...</p> : !auth ?
   <form className="panel form" onSubmit={login}><h2>تسجيل دخول المدير</h2><label>الإيميل<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label>
    <label>كلمة المرور<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>
    <button disabled={busy} className="btn">دخول</button><small>تؤخذ بيانات الدخول من Environment Variables، وليست مضمّنة بالكود.</small></form>
  : <><div className="actions"><h2>إضافة موديل</h2><button className="btn outline" onClick={logout}>تسجيل خروج</button></div>
   <form className="panel form" onSubmit={submit}><label>اسم الموديل<input maxLength={160} value={name} onChange={e=>setName(e.target.value)} required /></label>
    <label>الوصف<textarea maxLength={3000} value={description} onChange={e=>setDescription(e.target.value)} required /></label>
    <label>صورة JPG / PNG / WEBP بحد أقصى 3MB<input id="file" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]??null)}/></label>
    <button disabled={busy} className="btn">{busy?"جارِ الحفظ...":"إضافة المنتج"}</button></form>
   <div className="headline"><h2>المنتجات ({products.length})</h2></div>
   {products.map(p=><div className="entry" key={p.id}><div>{p.image && <img src={`/api/images/${p.image}`} alt=""/>}<b>{p.name}</b></div><button className="btn danger" disabled={busy} onClick={()=>remove(p.id)}>حذف</button></div>)}
  </>}
 </main>;
}
