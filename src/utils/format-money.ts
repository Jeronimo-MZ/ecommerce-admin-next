export function formatMoney(amount: number, currency?: string) {
  const formatter = Intl.NumberFormat("pt-MZ", { style: "currency", currency: currency ?? "USD" });
  return formatter.format(amount);
}
