import Image from "next/image";
import { CircleCheckBig, PartyPopper } from "lucide-react";
import whatsappIcon from "../../../assets/icons/whatsapp.svg";
import { CategoryRail } from "@/components/catalog/CategoryRail";
import { ProductCarousel } from "@/components/catalog/ProductCarousel";
import { BirthdayTestimonials } from "@/components/storefront/BirthdayTestimonials";
import { StoreHero } from "@/components/storefront/StoreHero";
import { Container } from "@/components/ui/Container";
import { getCatalogRepository } from "@/repositories/catalog";
import styles from "./storefront.module.css";

export default async function HomePage() {
  const repository = getCatalogRepository();
  const [store, categories, popular, additions, combos] = await Promise.all([
    repository.getStore(),
    repository.getCategories(),
    repository.getPopularProducts(),
    repository.getProducts({ categoryId: "cat-adicionais" }),
    repository.getProducts({ categoryId: "cat-promocoes" }),
  ]);

  return <>
    <StoreHero store={store} />

    <Container as="section" className={styles.categoriesSection}>
      <h2 className={styles.sectionTitle}>CATEGORIAS</h2>
      <CategoryRail categories={categories} />
    </Container>

    <Container as="section" className={styles.productsSection}>
      <h2 className={styles.productsTitle}>DESTAQUES</h2>
      <ProductCarousel products={popular.slice(0, 4)} label="Destaques" />
    </Container>

    <Container as="section" className={styles.productsSection}>
      <h2 className={styles.productsTitle}>ADICIONAIS</h2>
      <ProductCarousel products={additions} label="Adicionais" />
    </Container>

    <Container as="section" className={styles.productsSection}>
      <h2 className={styles.productsTitle}>COMBOS</h2>
      <ProductCarousel products={combos} label="Combos" />
    </Container>

    <Container as="section" className={styles.promotionSection} aria-labelledby="promocao-aniversario">
      <div className={styles.promotionCard}>
        <div className={styles.promotionCopy}>
          <span className={styles.promotionEyebrow}><PartyPopper size={16} aria-hidden="true" />Promoção especial</span>
          <h2 id="promocao-aniversario"><span className={styles.promotionDesktopPrefix}>O seu </span>Aniversário é com a Pizza Express</h2>
          <p className={styles.promotionLead}>No dia do seu aniversário, compre uma pizza e ganhe outra pizza à sua escolha.</p>
          <ul className={styles.promotionRules}>
            <li><CircleCheckBig size={20} aria-hidden="true" /><span>Apresente um documento de identificação na retirada.</span></li>
            <li><CircleCheckBig size={20} aria-hidden="true" /><span>Siga <strong>@pizzaexpress_mc</strong> no Instagram.</span></li>
            <li><CircleCheckBig size={20} aria-hidden="true" /><span>Participe do registro e compartilhe a publicação.</span></li>
            <li><CircleCheckBig size={20} aria-hidden="true" /><span>Todos os aniversariantes da família podem participar.</span></li>
          </ul>
          <a className={styles.promotionAction} href={`https://wa.me/${store.contact.whatsapp}?text=Ol%C3%A1%2C%20quero%20fazer%20meu%20pedido%20na%20Pizza%20Express.`} target="_blank" rel="noreferrer">
            <Image src={whatsappIcon} alt="" width={21} height={21} aria-hidden="true" /> Fazer pedido no WhatsApp
          </a>
        </div>
        <BirthdayTestimonials />
      </div>
    </Container>
  </>;
}
