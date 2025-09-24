import { useState, useCallback } from "react";
import { apiClient } from "../api/apiClient";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(initialData: T | null = null) {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const get = useCallback(async (endpoint: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.get(endpoint);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  }, []);

  const post = useCallback(async (endpoint: string, body: any) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.post(endpoint, body);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  }, []);

  const patch = useCallback(async (endpoint: string, body: any) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.patch(endpoint, body);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  }, []);

  const del = useCallback(async (endpoint: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.delete(endpoint);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  }, []);

  return {
    ...state,
    get,
    post,
    patch,
    del,
  };
}
