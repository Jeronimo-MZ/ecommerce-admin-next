"use client";
import { ReactNode, useEffect, useState } from "react";

export const BaseClientProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return <>{children}</>;
};
