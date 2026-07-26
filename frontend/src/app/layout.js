import "@/styles/globals.css";
import localFont from "next/font/local";
import { Figtree, Syne } from "next/font/google";
import { Suspense } from "react";
import bannerImage from "../../assets/images/banner-2.webp";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE_URL } from "@/constants/site";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-product-name",
  display: "swap",
  preload: false,
});

const soehneBreit = localFont({
  src: [
    { path: "../../assets/font/TestSohneBreit-Buch.otf", weight: "400", style: "normal" },
    { path: "../../assets/font/TestSohneBreit-Kraftig.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Pizza Express | Rei das Pizzas", template: "%s | Pizza Express" },
  description: "Conheça o cardápio da Pizza Express e personalize sua pizza favorita.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Pizza Express",
    title: "Pizza Express | Rei das Pizzas",
    description: "A melhor pizza do Brasil, pronta para você personalizar.",
    images: [{ url: bannerImage.src, width: 2024, height: 777, alt: "Banner oficial da Pizza Express com pizza artesanal" }],
  },
};

export default function RootLayout({ children }) {
  return <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
    <body className={`${figtree.variable} ${soehneBreit.variable} ${syne.variable}`} suppressHydrationWarning>
      <ToastProvider><Suspense fallback={null}>{children}</Suspense></ToastProvider>
    </body>
  </html>;
}
