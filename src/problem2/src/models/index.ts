export interface Balance {
  currency: string;
  date: string;
  price: number;
}

export interface SwapRequestData {
  fromToken: string;
  toToken: string;
  amount: number;
}
