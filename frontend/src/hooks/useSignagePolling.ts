'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { SignageDisplayData } from '@/types';

export function useSignagePolling(displayKey: string, defaultIntervalSeconds = 30) {
  const [data, setData] = useState<SignageDisplayData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);

  const fetchDisplayData = useCallback(async () => {
    try {
      const result = await apiFetch<SignageDisplayData>(`/public/displays/${displayKey}`);
      setData(result);
      setError(null);
      setLastRefreshed(new Date());
      setIsStale(false);
    } catch (err: any) {
      console.error('Signage poll failed:', err);
      setError(err.message || 'Failed to update signage data');
      setIsStale(true); // Don't wipe existing data, mark as stale
    } finally {
      setLoading(false);
    }
  }, [displayKey]);

  useEffect(() => {
    if (!displayKey) return;

    fetchDisplayData();

    const intervalMs = (data?.display.refreshIntervalSeconds || defaultIntervalSeconds) * 1000;
    const timer = setInterval(() => {
      fetchDisplayData();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [displayKey, fetchDisplayData, data?.display.refreshIntervalSeconds, defaultIntervalSeconds]);

  return {
    data,
    loading,
    error,
    lastRefreshed,
    isStale,
    refetch: fetchDisplayData,
  };
}
