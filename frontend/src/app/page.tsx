import dynamic from "next/dynamic";

// Dynamic import with ssr:false prevents ALL browser-only errors on Vercel
// (window is not defined, canvas, audio, wagmi hooks, etc.)
const AppClient = dynamic(() => import("@/components/AppClient"), { ssr: false });

export default function Page() {
  return <AppClient />;
}
