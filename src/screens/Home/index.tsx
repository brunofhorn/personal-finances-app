import { useTransactionContext } from "@/context/transaction.context"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"
import { useEffect } from "react"
import { ActivityIndicator, FlatList, RefreshControl, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ListHeader } from "./ListHeader"
import { TransactionCard } from "./TransactionCard"
import { EmptyList } from "./EmptyList"
import { colors } from "@/shared/colors"

export const Home = () => {
    const {
        fetchCategories,
        fetchTransactions,
        transactions,
        refreshTransactions,
        loadMoreTransactions,
        handleLoadings,
        loadings
    } = useTransactionContext()
    const { handlerError } = useErrorHandler()

    const handleFetchCategories = async () => {
        try {
            handleLoadings({
                key: "initial",
                value: true
            })

            await fetchCategories()
        } catch (error) {
            handlerError(error, "Falha ao buscar as categorias.")
        } finally {
            handleLoadings({
                key: "initial",
                value: false
            })
        }
    }

    const handleFetchInitialTransactions = async () => {
        try {
            handleLoadings({
                key: "initial",
                value: true
            })

            await fetchTransactions({ page: 1 })
        } catch (error) {
            handlerError(error, "Falha ao buscar as transações iniciais.")
        } finally {
            handleLoadings({
                key: "initial",
                value: false
            })
        }
    }

    const handleLoadMoreTransactions = async () => {
        try {
            handleLoadings({
                key: "loadMore",
                value: true
            })

            await loadMoreTransactions()
        } catch (error) {
            handlerError(error, "Falha ao carregar mais transações.")
        } finally {
            handleLoadings({
                key: "loadMore",
                value: false
            })
        }
    }

    const handleRefreshTransactions = async () => {
        try {
            handleLoadings({
                key: "refresh",
                value: true
            })

            await refreshTransactions()
        } catch (error) {
            handlerError(error, "Falha ao recarregar as transações.")
        } finally {
            handleLoadings({
                key: "refresh",
                value: false
            })
        }
    }

    useEffect(() => {
        (async () => {
            await Promise.all([
                handleFetchCategories(),
                handleFetchInitialTransactions()
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
                refreshControl={<RefreshControl onRefresh={handleRefreshTransactions} refreshing={loadings.refresh} />}
                onEndReached={handleLoadMoreTransactions}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={loadings.initial ? null : EmptyList}
                ListFooterComponent={loadings.loadMore ? <ActivityIndicator color={colors["accent-brand-light"]} size={"large"} /> : null}
            />
        </SafeAreaView>
    )
}