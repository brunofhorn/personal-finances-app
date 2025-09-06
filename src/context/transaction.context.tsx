import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response"
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react"
import * as transactionService from "@/shared/services/personal-finances/transaction.service"
import { CreateTransactionInterface } from "@/shared/interfaces/https/create-transaction-request"
import { Transaction } from "@/shared/interfaces/transaction"
import { TotalTransactions } from "@/shared/interfaces/total-transactions"
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request"
import { Filters, Pagination } from "@/shared/interfaces/https/get-transaction-request"

const filtersInitialValues = {
    categoryIds: {},
    typeId: undefined,
    from: undefined,
    to: undefined
}

interface FetchTransactionsParams {
    page: number
}

interface Loadings {
    initial: boolean
    refresh: boolean
    loadMore: boolean
}

interface HandleLoadingParams {
    key: keyof Loadings
    value: boolean
}

interface HandleFiltersParams {
    key: keyof Filters
    value: Date | boolean | number
}

export type TransactionContextType = {
    fetchCategories: () => Promise<void>
    categories: TransactionCategory[]
    createTransaction: (transaction: CreateTransactionInterface) => Promise<void>
    updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>
    fetchTransactions: (params: FetchTransactionsParams) => Promise<void>
    totalTransactions: TotalTransactions
    transactions: Transaction[]
    refreshTransactions: () => Promise<void>
    loadMoreTransactions: () => Promise<void>
    loadings: Loadings
    handleLoadings: (params: HandleLoadingParams) => void
    pagination: Pagination
    searchText: string
    setSearchText: (text: string) => void
    filters: Filters
    handleFilters: (params: HandleFiltersParams) => void
    handleCategoryFilter: (categoryId: number) => void
    resetFilter: () => Promise<void>
}

export const TransactionContext = createContext({} as TransactionContextType)

export const TransactionContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [categories, setCategories] = useState<TransactionCategory[]>([])
    const [loadings, setLoadings] = useState<Loadings>({
        initial: false,
        refresh: false,
        loadMore: false
    })
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        perPage: 15,
        totalRows: 0,
        totalPages: 0
    })
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>({
        expense: 0,
        revenue: 0,
        total: 0
    })
    const [searchText, setSearchText] = useState<string>("")
    const [filters, setFilters] = useState<Filters>(filtersInitialValues)

    const categoryIds = useMemo(() => Object.entries(filters.categoryIds).filter(([key, value]) => value).map(([key]) => Number(key)), [filters.categoryIds])

    const fetchCategories = async () => {
        const categoriesResponse = await transactionService.getTransactionCategories()

        setCategories(categoriesResponse)
    }

    const createTransaction = async (transaction: CreateTransactionInterface) => {
        await transactionService.createTransaction(transaction)
        await refreshTransactions()
    }

    const updateTransaction = async (transaction: UpdateTransactionInterface) => {
        await transactionService.updateTransaction(transaction)
    }

    const fetchTransactions = useCallback(async ({ page = 1 }: FetchTransactionsParams) => {
        const transactionResponse = await transactionService.getTransactions({
            page,
            perPage: pagination.perPage,
            searchText,
            ...filters,
            categoryIds
        })

        if (page === 1) {
            setTransactions(transactionResponse.data)
        } else {
            setTransactions((prevState) => [...prevState, ...transactionResponse.data])
        }

        setTotalTransactions(transactionResponse.totalTransactions)
        setPagination({ ...pagination, page, totalRows: transactionResponse.totalRows, totalPages: transactionResponse.totalPages })
    }, [pagination, searchText, filters, categoryIds])

    const refreshTransactions = useCallback(async () => {
        const { page, perPage } = pagination

        const transactionResponse = await transactionService.getTransactions({
            page: 1,
            perPage: page * perPage,
            ...filters,
            categoryIds
        })

        setTransactions(transactionResponse.data)
        setTotalTransactions(transactionResponse.totalTransactions)
        setPagination({ ...pagination, page, totalPages: transactionResponse.totalPages, totalRows: transactionResponse.totalRows })
    }, [pagination, filters, categoryIds])

    const loadMoreTransactions = useCallback(async () => {
        if (loadings.loadMore || pagination.page >= pagination.totalPages) {
            return
        }

        fetchTransactions({ page: pagination.page + 1 })
    }, [loadings.loadMore, pagination])

    const handleLoadings = ({ key, value }: HandleLoadingParams) => {
        setLoadings((prevValue) => ({ ...prevValue, [key]: value }))
    }

    const handleFilters = ({ key, value }: HandleFiltersParams) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleCategoryFilter = (categoryId: number) => {
        setFilters((prevValue) => ({
            ...prevValue,
            categoryIds: {
                ...prevValue.categoryIds,
                [categoryId]: !Boolean(prevValue.categoryIds[categoryId])
            }
        }))
    }

    const resetFilter = useCallback(async () => {
        setFilters(filtersInitialValues)
        setSearchText("")

        const transactionResponse = await transactionService.getTransactions({
            page: 1,
            perPage: pagination.perPage,
            searchText: "",
            categoryIds: []
        })

        setTransactions(transactionResponse.data)
        setTotalTransactions(transactionResponse.totalTransactions)
        setPagination({ ...pagination, page: 1, totalPages: transactionResponse.totalPages, totalRows: transactionResponse.totalRows })
    }, [])

    return (
        <TransactionContext.Provider
            value={{
                categories,
                fetchCategories,
                createTransaction,
                updateTransaction,
                fetchTransactions,
                totalTransactions,
                transactions,
                refreshTransactions,
                handleLoadings,
                loadings,
                loadMoreTransactions,
                pagination,
                searchText,
                setSearchText,
                filters,
                handleFilters,
                handleCategoryFilter,
                resetFilter
            }}>
            {children}
        </TransactionContext.Provider>
    )
}

export const useTransactionContext = () => {
    const context = useContext(TransactionContext)

    return context
}