import { useContext } from 'react';
import { AppStateContext } from '../state/context';
//Hook to provide state context
export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
};
