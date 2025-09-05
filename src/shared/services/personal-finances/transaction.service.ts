import { personalFinances } from "@/shared/api/personal-finances";
import {
  CreateTransactionInterface,
  GetTransactionResponse,
} from "@/shared/interfaces/https/create-transaction-request";
import { GetTransactionsParams } from "@/shared/interfaces/https/get-transaction-request";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import qs from "qs";

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

export const getTransactions = async (
  params: GetTransactionsParams
): Promise<GetTransactionResponse> => {
  const { data } = await personalFinances.get<GetTransactionResponse>(
    "/transaction",
    {
      params,
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
    }
  );

  return data;
};

export const deleteTransaction = async (id: number) => {
  await personalFinances.delete(`/transaction/${id}`);
};
