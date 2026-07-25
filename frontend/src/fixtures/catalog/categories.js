import additionsBackground from "../../../assets/images/bg-adicionais.webp";
import drinksBackground from "../../../assets/images/bg-bebidas.webp";
import sweetsBackground from "../../../assets/images/bg-doces.webp";
import promotionsBackground from "../../../assets/images/bg-promocoes.webp";
import savoryBackground from "../../../assets/images/bg-salgadas.webp";

export const categories = [
  {
    id: "cat-promocoes",
    name: "Promoções",
    slug: "promocoes",
    description: "Conheça nossas ofertas especiais.",
    image: promotionsBackground,
    accent: true,
    active: true,
    sortOrder: 1,
  },
  {
    id: "cat-salgadas",
    name: "Salgadas",
    slug: "salgadas",
    description: "Pizzas salgadas para todos os gostos.",
    image: savoryBackground,
    active: true,
    sortOrder: 2,
  },
  {
    id: "cat-doces",
    name: "Doces",
    slug: "doces",
    description: "Pizzas doces e sobremesas.",
    image: sweetsBackground,
    active: true,
    sortOrder: 3,
  },
  {
    id: "cat-bebidas",
    name: "Bebidas",
    slug: "bebidas",
    description: "Bebidas para acompanhar seu pedido.",
    image: drinksBackground,
    active: true,
    sortOrder: 4,
  },
  {
    id: "cat-adicionais",
    name: "Adicionais",
    slug: "adicionais",
    description: "Complementos para deixar seu pedido do seu jeito.",
    image: additionsBackground,
    active: true,
    sortOrder: 5,
  },
];
