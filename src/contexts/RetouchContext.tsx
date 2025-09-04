"use client";

import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";

export interface RetouchItem {
  id: string;
  contractName: string;
  customerName: string;
  phone: string;
  servicePackage: string;
  deadline: string;
  submissionDate: string;
  assignee: string;
  status: string;
  selectedImageUrl?: string;
  retouchImageUrl?: string;
  location?: string;
  notes: Array<{ id: string; content: string; timestamp: string; author: string }>;
}

interface RetouchContextType {
  items: RetouchItem[];
  addItem: (item: RetouchItem) => void;
}

const RetouchContext = createContext<RetouchContextType | undefined>(undefined);

export function RetouchProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RetouchItem[]>([]);

  const addItem = useCallback((item: RetouchItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  return (
    <RetouchContext.Provider value={{ items, addItem }}>
      {children}
    </RetouchContext.Provider>
  );
}

export function useRetouch() {
  const ctx = useContext(RetouchContext);
  if (!ctx) throw new Error("useRetouch must be used within a RetouchProvider");
  return ctx;
}

