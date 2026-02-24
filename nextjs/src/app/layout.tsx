import type { Metadata } from "next";
import { Cinzel_Decorative, Lora } from "next/font/google"; // Changed font imports
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getGlobalSettings } from "@/lib/services/singleTypes";
import { getPageBySlug } from "@/lib/services/pages";

const cinzelDecorative = Cinzel_Decorative({ // Renamed variable
  subsets: ["latin"],
  weight: ["400", "700", "900"], // Added weights
  variable: "--font-cinzel-decorative", // Changed variable name
});

const lora = Lora({ // Renamed variable
  subsets: ["latin"],
  variable: "--font-lora", // Changed variable name
});

export async function generateMetadata(): Promise<Metadata> {
  let settings: Awaited<ReturnType<typeof getGlobalSettings>> | null = null;
  try {
    settings = await getGlobalSettings();
  } catch {
    settings = null;
  }

  return {
    title: {
      default: settings?.siteName || "Di'aaru Luxury Diamonds",
      template: `%s | ${settings?.siteName || "Di'aaru"}`,
    },
    description: settings?.siteDescription || "Exquisite lab-grown diamond jewelry.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect admin routes to skip public header/footer
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  let settings: Awaited<ReturnType<typeof getGlobalSettings>> | null = null;
  let homePage: Awaited<ReturnType<typeof getPageBySlug>> | null = null;

  if (!isAdmin) {
    try {
      settings = await getGlobalSettings();
    } catch {
      settings = null;
    }

    try {
      homePage = await getPageBySlug('home');
    } catch {
      homePage = null;
    }
  }

  const sections = homePage?.sections || [];

  // Serialize to plain objects for Client Component compatibility
  const plainSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;
  const plainSections = JSON.parse(JSON.stringify(sections));

  return (
    <html lang="en" className={isAdmin ? 'dark admin-scrollbar' : 'scroll-smooth'}>
      <body className={isAdmin
        ? 'bg-[var(--admin-bg)] text-[var(--admin-text)] admin-noise min-h-screen admin-body antialiased'
        : `${cinzelDecorative.variable} ${lora.variable} font-sans antialiased` // Updated font variables
      }>
        {!isAdmin && <Header globalSettings={plainSettings} sections={plainSections} />}
        {isAdmin ? children : (
          <main className="min-h-screen">
            {children}
          </main>
        )}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
