import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const POLL_INTERVAL_MS = 4000; // Match backend simulation tick

export function useDashboardData(collegeEmail) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!collegeEmail || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await axios.get('http://localhost:5000/api/student/dashboard', {
        params: { college_email: collegeEmail },
      });

      if (isMountedRef.current) {
        setData(response.data.data);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Dashboard data fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [collegeEmail]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!collegeEmail) return;

    // Initial fetch
    fetchData();

    // Poll every 4 seconds
    const intervalId = setInterval(fetchData, POLL_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [collegeEmail, fetchData]);

  return { data, loading, error };
}
