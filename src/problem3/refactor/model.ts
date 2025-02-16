import { ReactNode } from "react";
import { BlockChain } from "./constant";

export interface BoxProps {
  children: ReactNode;
}
export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: BlockChain;
}
export interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

export interface Prices {
  currency: string;
}
