import { tokens } from "../data/tokens";
import { Balance, SwapRequestData } from "../models";

export const getTokenList = () => {
  return Promise.resolve(
    Object.values(
      tokens.reduce((acc: Record<string, Balance>, cur: Balance) => {
        acc[cur.currency] = cur;

        return acc;
      }, {})
    )
  );
};

export const swapToken = async ({
  fromToken,
  toToken,
  amount,
}: SwapRequestData) => {
  const tokenList = await getTokenList();
  const fromTokenValue = tokenList.find(
    (item) => item.currency === fromToken
  )?.price;
  const toTokenValue = tokenList.find(
    (item) => item.currency === toToken
  )?.price;

  if (!fromTokenValue || !toTokenValue)
    return Promise.reject(new Error("Unable to process swap token"));

  const ratio = toTokenValue / fromTokenValue;

  return new Promise((resolve) =>
    setTimeout(() => resolve(ratio * amount), 1000)
  );
};
