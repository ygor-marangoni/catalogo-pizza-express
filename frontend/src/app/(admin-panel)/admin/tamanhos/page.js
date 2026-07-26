"use client";
import { ResourceManager } from "@/components/admin/ResourceManager"; import { sizesApi } from "@/features/admin-catalog/sizes-api";
const fields=[{name:"name",label:"Nome",required:true},{name:"code",label:"Código único",required:true},{name:"description",label:"Descrição",multiline:true},{name:"additional_price",label:"Preço adicional (R$)",type:"money",required:true}];
export default function Page(){return <ResourceManager title="Tamanhos" api={sizesApi} fields={fields} priceField="additional_price"/>;}
