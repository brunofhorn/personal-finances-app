export interface GetTransactionsParams {
  page: number;
  perPage: number;
  from?: Date;
  to?: Date;
  typeId?: number;
  categoryId?: number;
  searchText?: string;
}
