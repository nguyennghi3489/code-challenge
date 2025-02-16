import { useMemo } from "react";
import { usePrices, useWalletBalances } from "./hooks";
import { BoxProps, FormattedWalletBalance } from "./model";
import {
  filterNegativeAmountBlockchain,
  formatBalance,
  sortByBlockChainPriority,
} from "./helper";
import { WalletRow } from "./wallet-row";

export const WalletPage: React.FC<BoxProps> = ({ ...rest }: BoxProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return balances
      .filter(filterNegativeAmountBlockchain)
      .sort(sortByBlockChainPriority)
      .map(formatBalance);
  }, [balances]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance: FormattedWalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={"classes.row"}
            key={balance.blockchain}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      })}
    </div>
  );
};
