import "@/styles/globals.css";
import localFont from "next/font/local";
import { Figtree, Syne } from "next/font/google";
import { Suspense } from "react";
import bannerImage from "../../assets/images/banner-2.webp";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductModalController } from "@/components/catalog/ProductModalController";
import { getCatalogRepository } from "@/repositories/catalog";
import { SITE_URL } from "@/constants/site";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-product-name",
  display: "swap",
});

const soehneBreit = localFont({
  src: [
    { path: "../../assets/font/TestSohneBreit-Buch.otf", weight: "400", style: "normal" },
    { path: "../../assets/font/TestSohneBreit-Kraftig.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
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

export default async function RootLayout({ children }) {
  const repository = getCatalogRepository();
  const [store, suggestions, categories] = await Promise.all([
    repository.getStore(),
    repository.getProducts(),
    repository.getCategories(),
  ]);
  const headerStore = {
    name: store.name,
    logo: store.logo,
    description: store.description,
    address: store.address,
  };
  const searchSuggestions = suggestions
    .filter((product) => product.available)
    .map(({ id, name, slug }) => ({ id, name, slug }));
  return <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
    <body className={`${figtree.variable} ${soehneBreit.variable} ${syne.variable}`}>
      <ToastProvider><CartProvider storeId={store.id}>
        <Header store={headerStore} suggestions={searchSuggestions} categories={categories} />
        <Suspense fallback={null}><ProductModalController products={suggestions} /></Suspense>
        <main id="conteudo">{children}</main>
        <Footer store={store} />
      </CartProvider></ToastProvider>
    </body>
  </html>;
}
