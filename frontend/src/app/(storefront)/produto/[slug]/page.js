import { redirect } from "next/navigation";

export default async function LegacyProductPage({ params }) {
  const { slug } = await params;
  redirect(`/?produto=${encodeURIComponent(slug)}`);
}
