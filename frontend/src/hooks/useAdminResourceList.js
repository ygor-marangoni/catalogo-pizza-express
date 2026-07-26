"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";

export function useAdminResourceList(fetchPage, deleteResource) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (nextPage = 1, replace = true) => {
    setLoading(true); setError("");
    try {
      const result = await fetchPage(nextPage);
      setItems((current) => replace ? result.items : [...current, ...result.items]);
      setPage(result.page || nextPage);
      setTotal(result.total || 0);
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [fetchPage]);

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (id) => {
    setError("");
    try { await deleteResource(id); await load(1, true); }
    catch (requestError) { setError(requestError.message); }
  }, [deleteResource, load]);

  return { items, page, total, loading, error, load, remove };
}
