import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputGroupProps = React.ComponentProps<"input"> & {
  label: string;
  error?: string;
};

export const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  ({ label, name, error, ...props }, ref) => {
    return (
      <div className="grid gap-2">
        <Label htmlFor={name}>{label}</Label>
        <Input name={name} {...props} ref={ref} />
        {error && <p className="text-red-500 text-sm"> * {error}</p>}
      </div>
    );
  },
);

InputGroup.displayName = "InputGroup";
