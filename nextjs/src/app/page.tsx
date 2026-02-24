import Link from "next/link";
import SectionResolver from "@/components/sections/SectionResolver";
import { getPageBySlug } from "@/lib/services/pages";

export default async function Home() {
  // Fetch home page content
  // We use 'home' as the default slug for the landing page
  let page = null;
  try {
    page = await getPageBySlug('home');
  } catch {
    page = null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Admin Login Button - subtle floating button, bottom-right */}
      <Link
        href="/admin/login"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/70 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/60 hover:text-white hover:border-white/20 transition-all duration-300 shadow-lg group"
        title="Admin Panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Admin
      </Link>

      {!page ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-4xl font-serif mb-4">Welcome to Di'aaru</h1>
          <p className="text-gray-600 max-w-md">
            Your luxury diamond experience is being prepared.
            Please ensure you have run the migration or seeded the database.
          </p>
        </div>
      ) : (
        <SectionResolver sections={JSON.parse(JSON.stringify(page.sections || []))} />
      )}
    </div>
  );
}
