import "./style.css";
export const metadata = { title:"MonsterASP.NET Full Stack Test", description:"Next.js + MySQL + persistent image upload demo" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
