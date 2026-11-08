import Link from "next/link";
import {listProducts} from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Home() {
  let products:Awaited<ReturnType<typeof listProducts>>=[]; let error="";
  try { products=await listProducts(); } catch {error="تعذّر الاتصال بقاعدة البيانات. تأكد من إعدادات SQL Server.";}
  return <main className="container">
    <header className="bar"><strong>ALBAZIKI · TEST</strong><Link className="btn outline" href="/admin">لوحة الإدارة</Link></header>
    <section className="hero"><span className="eyebrow">MONSTERASP.NET · NEXT.JS FULL STACK</span><h1>كتالوج منتجات تجريبي</h1><p>تجربة حقيقية لربط Next.js بقاعدة SQL Server وتخزين صور المنتجات على السيرفر.</p></section>
    <div className="headline"><h2>المنتجات ({products.length})</h2><span>تظهر المنتجات فور إضافتها من الداشبورد</span></div>
    {error && <p className="alert">{error}</p>}
    {!error && !products.length && <div className="empty">ما في منتجات حالياً. افتح لوحة الإدارة وأضف أول منتج.</div>}
    <div className="grid">{products.map(p=><article className="product" key={p.id}>
      {p.image ? <img alt={p.name} src={`/api/images/${encodeURIComponent(p.image)}`} loading="lazy" />:<div className="placeholder">NO IMAGE</div>}
      <div className="product-info"><span className="eyebrow">MODEL #{p.id}</span><h3>{p.name}</h3><p>{p.description}</p></div>
    </article>)}</div>
    <footer>Demo only · Not a production storefront</footer>
  </main>;
}
