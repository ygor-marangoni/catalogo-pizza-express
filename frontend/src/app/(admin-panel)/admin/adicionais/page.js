"use client";
import { ResourceManager } from "@/components/admin/ResourceManager"; import { additionalsApi } from "@/features/admin-catalog/additionals-api";
const fields=[{name:"name",label:"Nome",required:true},{name:"description",label:"Descrição",multiline:true},{name:"price",label:"Preço (R$)",type:"money",required:true}];
export default function Page(){return <ResourceManager title="Adicionais" api={additionalsApi} fields={fields} priceField="price"/>;}
