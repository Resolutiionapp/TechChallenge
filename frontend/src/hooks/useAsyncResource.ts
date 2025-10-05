import { useState, useEffect, useRef } from 'react';

interface UseAsyncResourceOptions {
  url: string;
  cacheKey?: string;
  ttl?: number;
  maxRetries?: number;
  autoFetch?: boolean;
  persistToLocalStorage?: boolean;
}

export function useAsyncResource<T = any>(options: UseAsyncResourceOptions) {
  const {
    url,
    cacheKey = url,
    ttl = 60000,
    maxRetries = 3,
    autoFetch = true,
    persistToLocalStorage = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (persistToLocalStorage) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setData(parsed.data);
          setLastFetched(parsed.timestamp);
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }
    }
  }, [cacheKey, persistToLocalStorage]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [url, autoFetch]);

  const isStale = () => {
    if (!lastFetched) return true;
    return Date.now() - lastFetched > ttl;
  };

  const fetchData = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();

      if (isMountedRef.current) {
        setData(json);
        setLastFetched(Date.now());
        setRetryCount(0);

        if (persistToLocalStorage) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: json, timestamp: Date.now() })
          );
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      console.error('Fetch error:', err);

      if (isMountedRef.current) {
        setError(err);

        if (retryCount < maxRetries) {
          setRetryCount(retryCount + 1);
          fetchData();
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    setRetryCount(0);
    fetchData();
  };

  const clear = () => {
    setData(null);
    setLastFetched(null);
    setError(null);
    if (persistToLocalStorage) {
      localStorage.removeItem(cacheKey);
    }
  };

  const mutate = (newData: T) => {
    setData(newData);
    setLastFetched(Date.now());

    if (persistToLocalStorage) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: newData, timestamp: Date.now() })
      );
    }
  };

  return {
    data,
    loading,
    error,
    isStale: isStale(),
    retryCount,
    lastFetched,
    refetch,
    clear,
    mutate,
    setData,
    setLoading,
    setError,
  };
}
