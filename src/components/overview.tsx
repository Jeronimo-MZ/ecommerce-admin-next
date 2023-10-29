"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { formatMoney } from "@/utils/format-money";

type OverviewProps = {
  data: Array<{ name: string; total: number }>;
  currency: string;
};

export const Overview = ({ data, currency }: OverviewProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          tickFormatter={amount => formatMoney(amount, currency)}
          width={90}
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
