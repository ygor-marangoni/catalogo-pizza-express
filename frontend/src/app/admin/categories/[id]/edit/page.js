"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { catalogService } from "@/services/catalog-service";
import { CategoryForm } from "../../../_components/CategoryForm";
export default function EditCategoryPage(){const {id}=useParams();const [category,setCategory]=useState(null);const [error,setError]=useState("");useEffect(()=>{catalogService.getCategoryById(id).then(setCategory).catch(exception=>setError(exception.message))},[id]);if(error)return <p>{error}</p>;return category?<CategoryForm category={category}/>:<p>Carregando categoria…</p>}

