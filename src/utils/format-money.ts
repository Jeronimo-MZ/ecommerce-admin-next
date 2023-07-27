function formatMoney(amount: number) {
  const formatter = Intl.NumberFormat("pt-MZ", { style: "currency", currency: "USD" });
  return formatter.format(amount);
}
