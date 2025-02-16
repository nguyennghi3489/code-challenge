import { BlockChain } from "./constant";
import { WalletBalance } from "./model";

export const getPriority = (blockchain: BlockChain): number => {
  switch (blockchain) {
    case BlockChain.Osmosis:
      return 100;
    case BlockChain.Ethereum:
      return 50;
    case BlockChain.Arbitrum:
      return 30;
    case BlockChain.Zilliqa:
      return 20;
    case BlockChain.Neo:
      return 20;
    default:
      return -99;
  }
};

export const filterNegativeAmountBlockchain = (balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (balancePriority > -99) {
    if (balance.amount <= 0) {
      return true;
    }
  }
};

export const sortByBlockChainPriority = (
  lhs: WalletBalance,
  rhs: WalletBalance
) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else {
    return 1;
  }
};

export const formatBalance = (balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
};
