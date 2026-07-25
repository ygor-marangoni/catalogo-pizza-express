import Image from "next/image";
import { TodayStoreInfo } from "./TodayStoreInfo";
import styles from "@/app/(storefront)/storefront.module.css";

export function StoreHero({ store, headingLevel = 1, titleId = "hero-title", title, description }) {
  const Heading = `h${headingLevel}`;
  const categoryHero = Boolean(title);

  return <section className={`${styles.hero} ${categoryHero ? styles.categoryHero : ""}`.trim()} aria-labelledby={titleId}>
    <picture className={styles.heroMedia}>
      <source media="(max-width: 600px)" srcSet={store.bannerMobile.src} />
      <Image
        className={styles.heroImage}
        src={store.banner}
        alt="Banner oficial da Pizza Express com pizza artesanal"
        fill
        preload={headingLevel === 1}
        sizes="100vw"
      />
    </picture>
    <div className={`${styles.heroContent} ${categoryHero ? styles.categoryHeroContent : ""}`.trim()}>
      {!categoryHero && <TodayStoreInfo
        businessHours={store.businessHours}
        timeZone={store.timeZone}
        deliveryEnabled={store.deliveryEnabled}
        pickupEnabled={store.pickupEnabled}
        estimatedTime={store.estimatedTime}
      />}
      {categoryHero ? <>
        <span className={styles.categoryHeroEyebrow}>Cardápio Pizza Express</span>
        <Heading id={titleId} className={styles.categoryHeroTitle}>{title}</Heading>
        {description && <p className={styles.categoryHeroDescription}>{description}</p>}
      </> : <Heading id={titleId} className={styles.heroTitle}>
        <span className={styles.heroLine}>
          <span>A MELHOR</span>
          <Image className={styles.heroTitleAsset} src={store.heroPizzaBadge} alt="" aria-hidden="true" />
          <span>PIZZA</span>
        </span>
        <span className={styles.heroLine}>
          <span>DO</span>
          <Image className={styles.heroTitleAsset} src={store.heroBrazilFlag} alt="" aria-hidden="true" />
          <span>BRASIL</span>
        </span>
      </Heading>}
    </div>
  </section>;
}
