import { personalFinances } from "@/shared/api/personal-finances";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";

export const getTransactionCategories = async (): Promise<
  TransactionCategory[]
> => {
  const { data } = await personalFinances.get<TransactionCategory[]>(
    "/transaction/categories"
  );

  return data;
};
