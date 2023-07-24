"use client";

import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const MainNav = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: `/${params.storeId}/settings` === pathname,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 ", className)} {...props}>
      {routes.map(route => (
        <Link
          href={route.href}
          key={`${route.label}_${route.href}`}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
