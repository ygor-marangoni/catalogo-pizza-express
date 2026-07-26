"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { catalogService } from "@/services/catalog-service";
import { ProductForm } from "../../../_components/ProductForm";
export default function EditProductPage(){const {id}=useParams();const [product,setProduct]=useState(null);const [error,setError]=useState("");useEffect(()=>{catalogService.getProductById(id).then(setProduct).catch(exception=>setError(exception.message))},[id]);if(error)return <p>{error}</p>;return product?<ProductForm product={product}/>:<p>Carregando produto…</p>}

