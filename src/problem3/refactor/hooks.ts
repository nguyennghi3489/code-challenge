import { useState } from "react";
import { WalletBalance } from "./model";

export const useWalletBalances = () => {
  const [balances] = useState<WalletBalance[]>([]);
  return balances;
};

export const usePrices = () => {
  const [prices] = useState<Record<string, number>>({});
  return prices;
};
