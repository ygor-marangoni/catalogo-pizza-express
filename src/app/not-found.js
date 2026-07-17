import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return <Container><div style={{ padding: "4rem 0" }}><EmptyState title="Essa página saiu do forno" description="O endereço não existe ou o item não está mais no catálogo." action={<Link href="/"><Button>Voltar ao início</Button></Link>} /></div></Container>;
}
