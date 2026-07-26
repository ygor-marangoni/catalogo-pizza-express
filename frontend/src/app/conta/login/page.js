"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CustomerLoginRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const next = params.get("next");
    router.replace(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }, [router, params]);

  return <main aria-live="polite">Redirecionando para o login...</main>;
}
