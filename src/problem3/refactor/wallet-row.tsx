import { BlockChain } from "./constant";

interface Props {
  className: string;
  key: BlockChain;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

export const WalletRow = (props: Props) => {
  return <div>{props.formattedAmount}</div>;
};
