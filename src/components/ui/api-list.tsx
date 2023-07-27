"use client";

import { useParams } from "next/navigation";

import { useOrigin } from "@/hooks/use-origin";

import { ApiAlert } from "./api-alert";

type ApiListProps = {
  entityName: string;
  entityId: string;
};

export const ApiList = ({ entityId, entityName }: ApiListProps) => {
  const origin = useOrigin();
  const params = useParams();
  const baseURL = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseURL}/${entityName}`} />
      <ApiAlert title="GET" variant="public" description={`${baseURL}/${entityName}/{${entityId}}`} />
      <ApiAlert title="POST" variant="admin" description={`${baseURL}/${entityName}`} />
      <ApiAlert title="PATCH" variant="admin" description={`${baseURL}/${entityName}/{${entityId}}`} />
      <ApiAlert title="DELETE" variant="admin" description={`${baseURL}/${entityName}/{${entityId}}`} />
    </>
  );
};
