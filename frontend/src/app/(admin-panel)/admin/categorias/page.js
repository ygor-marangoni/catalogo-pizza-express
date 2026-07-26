"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { categoriesApi } from "@/features/admin-catalog/categories-api";

const fields = [
  { name: "name", label: "Nome", required: true },
  { name: "description", label: "Descrição", multiline: true },
  { name: "image", label: "Imagem de fundo do card", type: "file", accept: "image/*" },
];

export default function Page() {
  return <ResourceManager title="Categorias" api={categoriesApi} fields={fields} imageField="icon_url" />;
}
