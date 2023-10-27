"use client";

import { ImagePlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { BaseClientProvider } from "@/providers/base-client-provider";

import { Button } from "./button";

type ImageUploadProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};
export const ImageUpload = ({ onChange, onRemove, value, disabled = false }: ImageUploadProps) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  return (
    <BaseClientProvider>
      <div>
        <div className="mb-4 flex items-center gap-4">
          {value.map(url => (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2">
                <Button onClick={() => onRemove(url)} variant="destructive" size="icon">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
              <Image fill className="object-cover" alt="" src={url} />
            </div>
          ))}
        </div>
        <CldUploadWidget onUpload={onUpload} uploadPreset="s2cvwgdz">
          {({ open }) => {
            const onClick = () => open();
            return (
              <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
                <ImagePlusIcon className="w-4 h-4 mr-2" />
                Carregar uma Imagem
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
    </BaseClientProvider>
  );
};
