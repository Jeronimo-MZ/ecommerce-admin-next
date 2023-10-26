"use client";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { cn } from "@/lib/utils";

import { Command } from "./ui/command";
import { Store } from "../../server/models/store";

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof Popover.Trigger>;

type StoreSwitcherProps = PopoverTriggerProps & {
  items: Store[];
};

export const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const formattedItems = items.map(item => ({ label: item.name, value: item.id }));
  const currentStore = formattedItems.find(item => item.value === Number(params.storeId));

  const onStoreSelect = (store: (typeof formattedItems)[number]) => {
    setPopoverOpen(false);
    router.push(`/${store.value}`);
  };
  return (
    <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={popoverOpen}
          aria-label="Select a store"
          className={cn("w-[200px]", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-[200px] p-0">
        <Command.Root>
          <Command.List>
            <Command.Input placeholder="Search Store..." />
            <Command.Empty>No store found.</Command.Empty>
            <Command.Group heading="Stores">
              {formattedItems.map(item => (
                <Command.Item key={item.value} onSelect={() => onStoreSelect(item)} className="text-sm cursor-pointer">
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {item.label}
                  <Check
                    className={cn("ml-auto h-4 w-4", currentStore?.value === item.value ? "opacity-100" : "opacity-0")}
                  />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <Command.Separator />
          <Command.List>
            <Command.Group>
              <Command.Item
                onSelect={() => {
                  setPopoverOpen(false);
                  storeModal.onOpen();
                }}
                className="cursor-pointer"
              >
                <PlusCircle className="mr-2 w-5 h-5" />
                Create Store
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  );
};
