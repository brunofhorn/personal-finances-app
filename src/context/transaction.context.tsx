import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response"
import { createContext, FC, PropsWithChildren, useCallback, useContext, useState } from "react"
import * as transactionService from "@/shared/services/personal-finances/transaction.service"
import { CreateTransactionInterface } from "@/shared/interfaces/https/create-transaction-request"
import { Transaction } from "@/shared/interfaces/transaction"
import { TotalTransactions } from "@/shared/interfaces/total-transactions"
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request"

export type TransactionContextType = {
    fetchCategories: () => Promise<void>
    categories: TransactionCategory[]
    createTransaction: (transaction: CreateTransactionInterface) => Promise<void>
    updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>
    fetchTransactions: () => Promise<void>
    totalTransactions: TotalTransactions
    transactions: Transaction[]
    refreshTransactions: () => Promise<void>
    refreshingTransactions: boolean
}

export const TransactionContext = createContext({} as TransactionContextType)

export const TransactionContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [categories, setCategories] = useState<TransactionCategory[]>([])
    const [refreshingTransactions, setRefreshingTransactions] = useState<boolean>(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>({
        expense: 0,
        revenue: 0,
        total: 0
    })

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

    const fetchTransactions = useCallback(async () => {
        const transactionResponse = await transactionService.getTransactions({
            page: 1,
            perPage: 10
        })

        setTransactions(transactionResponse.data)
        setTotalTransactions(transactionResponse.totalTransactions)
    }, [])

    const refreshTransactions = async () => {
        setRefreshingTransactions(true)

        const transactionResponse = await transactionService.getTransactions({
            page: 1,
            perPage: 10
        })

        setTransactions(transactionResponse.data)
        setTotalTransactions(transactionResponse.totalTransactions)
        setRefreshingTransactions(false)
    }

    return (
        <TransactionContext.Provider value={{ categories, fetchCategories, createTransaction, updateTransaction, fetchTransactions, totalTransactions, transactions, refreshTransactions, refreshingTransactions }}>
            {children}
        </TransactionContext.Provider>
    )
}

export const useTransactionContext = () => {
    const context = useContext(TransactionContext)

    return context
}