"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HTMLAttributes, useCallback } from "react";

import { cn } from "@/lib/utils";

export const MainNav = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Resumo",
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Capas",
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categorias",
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Cores",
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Tamanhos",
    },
    {
      href: `/${params.storeId}/products`,
      label: "Produtos",
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Pedidos",
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Configurações",
    },
  ];

  const isActiveRoute = useCallback((route: { href: string }) => route.href === pathname, [pathname]);
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 ", className)} {...props}>
      {routes.map(route => (
        <Link
          href={route.href}
          key={`${route.label}_${route.href}`}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActiveRoute(route) ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
