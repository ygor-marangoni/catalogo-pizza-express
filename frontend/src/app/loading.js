import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return <Container><div style={{ display: "grid", gap: "1rem", padding: "3rem 0" }} aria-label="Carregando conteúdo"><Skeleton width="55%" height="3.5rem" /><Skeleton height="22rem" /><Skeleton width="35%" height="2rem" /></div></Container>;
}
