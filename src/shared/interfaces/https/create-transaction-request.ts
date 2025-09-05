import { TotalTransactions } from "../total-transactions";
import { Transaction } from "../transaction";

export interface CreateTransactionInterface {
  description: string;
  typeId: number;
  categoryId: number;
  value: number;
}

export interface GetTransactionResponse{
  data: Transaction[]
  totalRows: number 
  totalPages: number 
  page: number 
  perPage: number 
  totalTransactions: TotalTransactions
}
