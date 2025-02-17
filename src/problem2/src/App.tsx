import { useMemo } from "react";
import "./App.css";
import {
  Box,
  Button,
  createListCollection,
  Heading,
  Input,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { LazySvg } from "./components/lazy-svg";
import { getTokenList, swapToken } from "./services/exchange";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Field } from "./components/ui/field";
import { SwapRequestData } from "./models";

const GET_TOKEN_LIST = "GET_TOKEN_LIST";
interface FormValue extends FieldValues {
  fromToken: string[];
  toToken: string[];
  amount: number;
}

function App() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<FormValue>({
    mode: "onChange",
  });

  const { isLoading, data: tokenList } = useQuery({
    queryKey: [GET_TOKEN_LIST],
    queryFn: getTokenList,
  });

  const {
    data: swappedAmount,
    error,
    mutate,
    isPending,
  } = useMutation({
    mutationFn: (data: SwapRequestData) => {
      return swapToken(data);
    },
  });

  const fromTokenCurrency = watch("fromToken");
  const toTokenCurrency = watch("toToken");

  const tokensOptions = useMemo(
    () =>
      createListCollection({
        items: tokenList || [],
        itemToString: (item) => item.currency,
        itemToValue: (item) => item.currency,
      }),
    [tokenList]
  );

  const onSubmit: SubmitHandler<FormValue> = (data: FormValue) => {
    mutate({
      fromToken: data.fromToken[0],
      toToken: data.toToken[0],
      amount: Number(data.amount),
    });
  };

  if (isLoading) {
    return (
      <VStack colorPalette="teal">
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
      </VStack>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={12}>
          <Heading size="5xl">Swap Tokens</Heading>
          <Stack flexDirection={"row"}>
            <VStack>
              <Field
                label="From Token"
                invalid={!!errors.fromToken}
                errorText={errors.fromToken?.message?.toString()}
              >
                <Controller
                  control={control}
                  name="fromToken"
                  rules={{ required: "Please select an token" }}
                  render={({ field }) => (
                    <SelectRoot
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      collection={tokensOptions}
                      size="sm"
                      width="320px"
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Token" />
                        {fromTokenCurrency && (
                          <LazySvg name={fromTokenCurrency[0]} />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {tokensOptions.items.map((token) => (
                          <SelectItem item={token} key={token.currency}>
                            {token.currency}
                            <LazySvg name={token.currency} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </Field>
              <Field
                invalid={!!errors.amount}
                errorText={errors.amount?.message?.toString()}
              >
                <Controller
                  control={control}
                  name="amount"
                  rules={{ required: "Please input an amount" }}
                  render={({ field }) => (
                    <Input placeholder="Amount to send" size="2xl" {...field} />
                  )}
                />
              </Field>
            </VStack>
            <VStack>
              <Field
                label="To Token"
                invalid={!!errors.toToken}
                errorText={errors.toToken?.message?.toString()}
              >
                <Controller
                  control={control}
                  name="toToken"
                  rules={{ required: "Please select an token" }}
                  render={({ field }) => (
                    <SelectRoot
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      collection={tokensOptions}
                      size="sm"
                      width="320px"
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Token" />
                        {toTokenCurrency && (
                          <LazySvg name={toTokenCurrency[0]} />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {tokensOptions.items.map((token) => (
                          <SelectItem item={token} key={token.currency}>
                            {token.currency}
                            <LazySvg name={token.currency} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </Field>
              <Input
                placeholder="Amount to receive"
                value={swappedAmount as string}
                size="2xl"
                disabled
              />
            </VStack>
          </Stack>

          <Stack>
            <Box
              background={"red.500"}
              p={2}
              visibility={error ? "visible" : "hidden"}
            >
              <Text color={"white"} fontWeight={700} fontSize={"xs"}>
                {error?.message}
              </Text>
            </Box>
            <Button
              size="xl"
              background={"black"}
              type="submit"
              loading={isPending}
            >
              Confirm Swap
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
}

export default App;
