import Image from "next/image";
import Link from "next/link";
import { BadgePercent, CakeSlice, CupSoda, House, MapPin, Phone, Pizza } from "lucide-react";
import facebookIcon from "../../../assets/icons/facebook.svg";
import instagramIcon from "../../../assets/icons/instagram.svg";
import whatsappIcon from "../../../assets/icons/whatsapp.svg";
import { Container } from "@/components/ui/Container";
import styles from "./layout.module.css";

const FOOTER_LINKS = [
  { href: "/", label: "Início", Icon: House },
  { href: "/categoria/promocoes", label: "Promoções", Icon: BadgePercent },
  { href: "/categoria/salgadas", label: "Salgadas", Icon: Pizza },
  { href: "/categoria/doces", label: "Doces", Icon: CakeSlice },
  { href: "/categoria/bebidas", label: "Bebidas", Icon: CupSoda },
];

export function Footer({ store }) {
  const whatsappUrl = `https://wa.me/${store.contact.whatsapp}?text=Ol%C3%A1%2C%20quero%20fazer%20meu%20pedido%20na%20Pizza%20Express.`;

  return <footer className={styles.footer}>
    <Container>
      <div className={styles.footerMain}>
        <section className={styles.footerBrand} aria-labelledby="footer-brand-title">
          <div className={styles.footerBrandLockup}>
            <Image src={store.logo} alt="Logo oficial da Pizza Express" width={90} height={90} />
            <div>
              <h2 id="footer-brand-title">{store.name}</h2>
              <span>Rei das pizzas</span>
            </div>
          </div>
          <p className={styles.footerClaim}>{store.description}</p>
          <p className={styles.footerDescription}>Sabor, praticidade e aquele momento especial em volta da mesa.</p>
        </section>

        <nav className={styles.footerNavigation} aria-label="Navegação do rodapé">
          <h2>Navegação</h2>
          <ul>
            {FOOTER_LINKS.map(({ href, label, Icon }) => <li key={href}>
              <Link href={href}><Icon size={18} aria-hidden="true" /><span>{label}</span></Link>
            </li>)}
          </ul>
        </nav>

        <section className={styles.footerContact} aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">Contato e localização</h2>
          <address className={styles.footerContactList}>
            <div className={styles.footerContactItem}>
              <span className={styles.footerContactIcon}><MapPin size={20} aria-hidden="true" /></span>
              <span><small>Endereço</small><strong>{store.address}</strong></span>
            </div>
            <a className={styles.footerContactItem} href={`tel:${store.contact.phoneHref}`}>
              <span className={styles.footerContactIcon}><Phone size={20} aria-hidden="true" /></span>
              <span><small>Telefone</small><strong>{store.contact.phoneDisplay}</strong></span>
            </a>
          </address>

          <div className={styles.footerSocialBlock}>
            <h3>Sociais</h3>
            <div className={styles.footerSocials}>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar com a Pizza Express pelo WhatsApp" title="WhatsApp">
                <Image src={whatsappIcon} alt="" width={20} height={20} />
              </a>
              <a href={store.contact.instagramUrl} target="_blank" rel="noreferrer" aria-label={`Abrir Instagram ${store.contact.instagramLabel}`} title="Instagram">
                <Image src={instagramIcon} alt="" width={20} height={20} />
              </a>
              <a href={store.contact.facebookUrl} target="_blank" rel="noreferrer" aria-label="Abrir Facebook da Pizza Express" title="Facebook">
                <Image src={facebookIcon} alt="" width={20} height={20} />
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 Pizza Express. Todos os direitos reservados.</span>
        <span>Desenvolvido por <a href="https://mercoestudio.com.br" target="_blank" rel="noreferrer">Merco</a></span>
      </div>
    </Container>
  </footer>;
}
