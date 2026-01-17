import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { DeviceRepository } from '../data/repositories/DeviceRepository';
import { StorageAdapter } from '../data/storage/StorageAdapter';
import { DeviceInfo } from '../types/DeviceInfo';

interface DeviceInfoContextValue {
  deviceInfo: DeviceInfo | null;
  loading: boolean;
  error: Error | null;
}

const DeviceInfoContext = createContext<DeviceInfoContextValue | undefined>(undefined);

interface DeviceInfoProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages device info state and loading.
 * Loads device info on mount and provides it via context.
 */
export function DeviceInfoProvider({ children }: DeviceInfoProviderProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDeviceInfo() {
      try {
        setLoading(true);
        setError(null);
        const storage = new StorageAdapter();
        const repository = new DeviceRepository(storage);
        const info = await repository.getOrCreateDeviceInfo();
        setDeviceInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load device info'));
      } finally {
        setLoading(false);
      }
    }

    loadDeviceInfo();
  }, []);

  return (
    <DeviceInfoContext.Provider value={{ deviceInfo, loading, error }}>
      {children}
    </DeviceInfoContext.Provider>
  );
}

/**
 * Hook to access device info from context
 * @returns DeviceInfo context value
 * @throws Error if used outside DeviceInfoProvider
 */
export function useDeviceInfo(): DeviceInfoContextValue {
  const context = useContext(DeviceInfoContext);
  if (context === undefined) {
    throw new Error('useDeviceInfo must be used within a DeviceInfoProvider');
  }
  return context;
}
