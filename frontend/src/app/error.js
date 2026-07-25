"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({ reset }) {
  return <Container><div style={{ padding: "4rem 0" }}><ErrorState title="O cardápio não carregou" description="Houve uma falha inesperada. Você pode tentar novamente sem perder o carrinho salvo." action={<Button onClick={reset}>Tentar novamente</Button>} /></div></Container>;
}
