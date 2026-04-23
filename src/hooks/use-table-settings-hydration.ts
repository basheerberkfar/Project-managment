/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useTableSettingsStore } from '@/store/table-setting.store';

export function useTableSettingsHydration(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useTableSettingsStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    if (useTableSettingsStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    return unsub;
  }, []);

  return hasHydrated;
}
