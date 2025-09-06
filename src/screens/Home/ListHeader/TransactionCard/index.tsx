import { TransactionTypes } from "@/shared/enums/transaction-types"
import { FC } from "react"
import { Text, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { useTransactionContext } from "@/context/transaction.context"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CARD_DATA } from "./strategies/card-data-strategy"
import { ICONS } from "./strategies/icon-strategy"
import { MoneyMapper } from "@/shared/utils/money-mapper"
import clsx from "clsx"

export type TransactionCardType = TransactionTypes | "total"

interface TransactionCardProps {
    type: TransactionCardType
    amount: number
}

export const TransactionCard: FC<TransactionCardProps> = ({ amount, type }) => {
    const iconData = ICONS[type]
    const cardData = CARD_DATA[type]

    const { transactions } = useTransactionContext()

    const lastTransaction = transactions.find(
        ({ type: transactionType }) => transactionType.id === type
    )

    return (
        <View className={clsx(`bg-${cardData.bgColor} min-w-[280] rounded-[6] px-8 py-6 justify-center mr-6`, type === "total" && "mr-12")}>
            <View className="flex-row justify-between items-center">
                <Text className="text-white text-base">{cardData.label}</Text>
                <MaterialIcons name={iconData.name} size={26} color={iconData.color} />
            </View>
            <View>
                <Text className="text-2xl text-gray-400 font-bold">R$ {MoneyMapper(amount)}</Text>

                {type !== "total" && (
                    <Text className="text-gray-600">
                        {lastTransaction?.createdAt ?
                            format(lastTransaction.createdAt,
                                `'Última ${cardData.label.toLowerCase()} em' d 'de' MMMM`,
                                { locale: ptBR }
                            ) : "Nenhuma transação encontrada"
                        }
                    </Text>
                )}
            </View>
        </View>
    )
}