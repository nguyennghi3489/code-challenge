# 99Tech Code Challenge #1

Note that if you fork this repository, your responses may be publicly linked to this repo.  
Please submit your application along with the solutions attached or linked.

It is important that you minimally attempt the problems, even if you do not arrive at a working solution.

## Submission

You can either provide a link to an online repository, attach the solution in your application, or whichever method you prefer.
We're cool as long as we can view your solution without any pain.

### Problem 1: Three ways to sum to n

```js
var sum_to_n_a = function (n) {
  // Using the loop to sum each number to the total
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
};
```

```
var sum_to_n_b = function (n) {
  // Using the recursive way
  var recursive_sum = function (i, max, val) {
    if (i > max) {
      return val;
    }
    return recursive_sum(i + 1, max, val + i);
  };

  return recursive_sum(1, n, 0);
};
```

```
var sum_to_n_c = function (n) {
  // Using the math formula
  // 1 ... 5 = (1 + 5) + (2 + 4) + (3 + 3) + (4 + 2) + (5 + 1) = (1+n)*n/2

  return (1 + n) * (n / 2);
};
```

### Problem 3: Refactor code

First I would like to make the code more easily to read by restructure the code folders:

- Model: includes WalletBalance, FormattedWalletBalance
- Constant: BlockChain
- Helper: getPriority, filterNegativeAmountBlockchain, sortByBlockChainPriority
- Hook
- Component

By refactor the code I found there is some issue with typescript and the logic

```
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
```

I should extend the WalletBalance interface with 1 more field "formatted: string;"

```
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
}
```

No usage of "children" we should remove it. And also we could do destruction in function params sections
const WalletPage: React.FC<Props> = ({...rest}: Props) => {

}

```
	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}
```

We should avoid using "any". I created a Enum and apply it to this function to avoid some typo issue and reuse this Enum later

```
  const balancePriority = getPriority(balance.blockchain);
	if (lhsPriority > -99) {
		if (balance.amount <= 0) {
		  return true;
	}
	}
```

No define for this variable lhsPriority -> I should be balancePriority
We are also missing the blockchain property on type WalletBalance

```
  const sortedBalances = useMemo(() => {
    ...
  }, [balances, prices]);  /
```

This function does not depend on "prices" then we should remove it.

```
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
```

The soft require return 1 | -1 but in this case we have a case that return void we should remove if (rightPriority > leftPriority) here

```
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })
```

We could combine this one with sortedBalances to express the full process to manipulate the balances
const formattedBalances = balances.filter(filterNegativeAmountBlockchain)
.sort(sortByBlockChainPriority)
.map(formatBalance)

```
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  ...
  return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
})
```

Wrong variable usage. It should be "formattedBalances" instead of "sortedBalances" cause we need formattedAmount={balance.formatted}

```
const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```

I think we should not expose the calculate function here:
const usdValue = prices[balance.currency] \* balance.amount;
And we should provide the key an unique key to avoid the conflict on the rerender WalletRow
key=balance.blockchain

We could pass the price into the component WalletRow and it will calculate the usdValue by itself and we could put it into the render div element
return (
<div {...rest}>
{formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
<WalletRow 
          className={classes.row}
          key={balance.blockchain}
          amount={balance.amount}
          price={prices[balance.currency]}
          formattedAmount={balance.formatted}
        />})
}
</div>
)
