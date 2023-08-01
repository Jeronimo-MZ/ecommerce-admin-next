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
      label: "Overview",
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
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
