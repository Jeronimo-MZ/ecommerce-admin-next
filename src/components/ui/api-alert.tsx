"use client";

import { CopyIcon, ServerIcon } from "lucide-react";
import { toast } from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";

type ApiAlertProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  admin: "destructive",
  public: "secondary",
};

export const ApiAlert = ({ description, title, variant }: ApiAlertProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("Copiado para a área de trânsferência");
  };
  return (
    <Alert>
      <div className="flex items-center gap-2">
        <ServerIcon className="h-4 w-4" />
        <AlertTitle className="flex items-center gap-2">
          {title}
          <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
        </AlertTitle>
      </div>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button size="icon" variant="outline" onClick={handleCopy} title="Copiar para a área de transferência">
          <CopyIcon className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
