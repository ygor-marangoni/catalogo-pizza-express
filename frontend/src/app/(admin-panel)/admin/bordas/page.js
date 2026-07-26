"use client";
import { ResourceManager } from "@/components/admin/ResourceManager"; import { edgesApi } from "@/features/admin-catalog/edges-api";
const fields=[{name:"name",label:"Nome",required:true},{name:"description",label:"Descrição",multiline:true},{name:"additional_price",label:"Preço adicional (R$)",type:"money",required:true}];
export default function Page(){return <ResourceManager title="Bordas" api={edgesApi} fields={fields} priceField="additional_price"/>;}
