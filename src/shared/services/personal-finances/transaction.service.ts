import { personalFinances } from "@/shared/api/personal-finances";
import { CreateTransactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";

export const getTransactionCategories = async (): Promise<
  TransactionCategory[]
> => {
  const { data } = await personalFinances.get<TransactionCategory[]>(
    "/transaction/categories"
  );

  return data;
};

export const createTransaction = async (
  transaction: CreateTransactionInterface
) => {
  await personalFinances.post("/transaction", transaction);
};
