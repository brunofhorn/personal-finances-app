import { useTransactionContext } from "@/context/transaction.context"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"
import { useEffect } from "react"
import { FlatList, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ListHeader } from "./ListHeader"
import { TransactionCard } from "./TransactionCard"

export const Home = () => {
    const { fetchCategories, fetchTransactions, transactions } = useTransactionContext()
    const { handlerError } = useErrorHandler()

    const handleFetchCategories = async () => {
        try {
            await fetchCategories()
        } catch (error) {
            handlerError(error, "Falha ao buscar as categorias.")
        }
    }

    useEffect(() => {
        (async () => {
            await Promise.all([
                handleFetchCategories(),
                fetchTransactions()
            ])
        })()
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <FlatList
                data={transactions}
                keyExtractor={({ id }) => `transaction-${id}`}
                renderItem={({ item }) => <TransactionCard transaction={item} />}
                ListHeaderComponent={ListHeader}
                className="bg-background-secondary"
            />
        </SafeAreaView>
    )
}