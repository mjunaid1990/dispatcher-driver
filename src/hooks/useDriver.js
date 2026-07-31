import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export const useDriver = () => {
  const { userInfo, driverInfo, updateDriver } = useAuth();
  const [driver, setDriverState] = useState(driverInfo);
  const [loading, setLoading] = useState(!driverInfo);

  const setDriver = (next) => {
    setDriverState(next);
    if (next) updateDriver(next);
  };

  const resolveDriver = useCallback(async () => {
    if (driverInfo) return driverInfo;
    if (!userInfo) return null;
    try {
      const res = await api.get('/drivers', { params: { userId: userInfo._id } });
      const found = res.data[0] || null;
      if (found) setDriverState(found);
      return found;
    } catch (error) {
      return null;
    }
  }, [driverInfo, userInfo]);

  useEffect(() => {
    if (!driverInfo) {
      resolveDriver().finally(() => setLoading(false));
    }
  }, [driverInfo, resolveDriver]);

  return { user: userInfo, driver, loading, setDriver, resolveDriver };
};
