"use client";

import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "./ui/button";

export function UserButton() {
  const session = useSession();
  if (session.status !== "authenticated") return null;
  const user = session.data.user;

  return (
    <p className="flex items-center gap-2">
      {user.name}
      <Button variant="outline" className="flex items-center gap-2" onClick={() => signOut()}>
        <LogOutIcon size={16} />
        Sair
      </Button>
    </p>
  );
}
