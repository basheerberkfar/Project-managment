/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Renewal = { id: number; projectId: string; amount: number; purpose: string; date: string; note: string };
export type ProjectFeature = { id: number; projectId: string; name: string; description: string; amount: number; startDate: string; endDate: string };
type LocalFinancialState = { renewals: Renewal[]; features: ProjectFeature[] };
type LocalFinancialContext = LocalFinancialState & {
  saveRenewal: (item: Omit<Renewal, 'id'> & Partial<Pick<Renewal, 'id'>>) => void;
  deleteRenewal: (id: number) => void;
  saveFeature: (item: Omit<ProjectFeature, 'id'> & Partial<Pick<ProjectFeature, 'id'>>) => void;
  deleteFeature: (id: number) => void;
};

const STORAGE_KEY = 'project-local-financial-data';
const initialState: LocalFinancialState = { renewals: [], features: [] };
const Context = createContext<LocalFinancialContext | null>(null);
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;
const amount = (value: number) => Number.isFinite(value) ? Math.max(value, 0) : 0;
const readState = (): LocalFinancialState => { try { const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<LocalFinancialState>; return { renewals: Array.isArray(parsed.renewals) ? parsed.renewals : [], features: Array.isArray(parsed.features) ? parsed.features : [] }; } catch { return initialState; } };

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readState);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state]);
  const value = useMemo<LocalFinancialContext>(() => ({ ...state,
    saveRenewal: (input) => setState((current) => { const item = { ...input, amount: amount(input.amount), id: input.id ?? nextId(current.renewals) }; return { ...current, renewals: input.id ? current.renewals.map((currentItem) => currentItem.id === input.id ? item : currentItem) : [item, ...current.renewals] }; }),
    deleteRenewal: (id) => setState((current) => ({ ...current, renewals: current.renewals.filter((item) => item.id !== id) })),
    saveFeature: (input) => setState((current) => { const item = { ...input, amount: amount(input.amount), id: input.id ?? nextId(current.features) }; return { ...current, features: input.id ? current.features.map((currentItem) => currentItem.id === input.id ? item : currentItem) : [item, ...current.features] }; }),
    deleteFeature: (id) => setState((current) => ({ ...current, features: current.features.filter((item) => item.id !== id) })),
  }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useFinancialData() { const context = useContext(Context); if (!context) throw new Error('useFinancialData must be used within FinancialDataProvider'); return context; }
