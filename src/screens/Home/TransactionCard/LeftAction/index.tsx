import { FC } from "react"
import { View } from "react-native"
import { Transaction } from "@/shared/interfaces/transaction"
import { Pressable } from "react-native-gesture-handler"
import { MaterialIcons } from "@expo/vector-icons"
import { colors } from "@/shared/colors"
import { useBottomSheetContext } from "@/context/bottomsheet.context"
import { EditTransactionForm } from "./EditTransactionForm"

interface LeftActionParams {
    transaction: Transaction
}

export const LeftAction: FC<LeftActionParams> = ({ transaction }) => {
    const { openBottomSheet } = useBottomSheetContext()

    return (
        <Pressable onPress={()=> openBottomSheet(<EditTransactionForm transaction={transaction} />, 1)}>
            <View className="h-[140] bg-accent-blue-dark w-[80] rounded-l-[6] items-center justify-center">
                <MaterialIcons name="edit" size={30} color={colors.white} />
            </View>
        </Pressable>
    )
}