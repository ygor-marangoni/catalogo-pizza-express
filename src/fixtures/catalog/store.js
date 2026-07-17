import logoImage from "../../../assets/images/logo.webp";
import bannerImage from "../../../assets/images/banner-2.webp";
import bannerMobileImage from "../../../assets/images/banner-mobile.webp";
import pizzaBadgeImage from "../../../assets/images/pizza banner.png";
import brazilFlagImage from "../../../assets/images/brasil-bandeira.svg";

export const store = {
  id: "pizza-express",
  name: "Pizza Express",
  slug: "pizza-express",
  description: "A melhor pizza do Brasil.",
  logo: logoImage,
  banner: bannerImage,
  bannerMobile: bannerMobileImage,
  heroPizzaBadge: pizzaBadgeImage,
  heroBrazilFlag: brazilFlagImage,
  contact: {
    phoneDisplay: "(34) 3842-5153",
    phoneHref: "+553438425153",
    whatsapp: "553438425153",
    instagramLabel: "@pizzaexpress_mc",
    instagramUrl: "https://www.instagram.com/pizzaexpress_mc/",
    facebookUrl: "https://www.facebook.com/pizzariaexpressmc",
  },
  address: "Rua Avenida Paranaíba, 407 - Boa Vista - Monte Carmelo/MG",
  timeZone: "America/Sao_Paulo",
  businessHours: [
    { day: "sun", label: "DOM", open: "17:00", close: "22:30" },
    { day: "mon", label: "SEG", open: "18:00", close: "21:30" },
    { day: "tue", label: "TER", open: "18:00", close: "22:30" },
    { day: "wed", label: "QUA", open: "18:00", close: "22:30" },
    { day: "thu", label: "QUI", open: "18:00", close: "22:30" },
    { day: "fri", label: "SEX", open: "17:00", close: "22:30" },
    { day: "sat", label: "SAB", open: "17:00", close: "22:30" },
  ],
  deliveryEnabled: true,
  pickupEnabled: true,
  minimumOrderInCents: 0,
  theme: {
    primary: "#c90000",
    secondary: "#70200f",
  },
};
