import { useCallback, useEffect, useState } from "react";

export const useFetch = (fetcher, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
};

