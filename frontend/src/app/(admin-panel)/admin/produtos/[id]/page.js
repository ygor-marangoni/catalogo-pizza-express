import { ProductForm } from "@/components/admin/ProductForm";
export default async function Page({params}){const{id}=await params;return <ProductForm id={id}/>;}
