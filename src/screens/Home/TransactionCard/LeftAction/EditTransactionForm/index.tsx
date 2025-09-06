import { FC, useState } from "react"
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from "@/shared/colors"
import { useBottomSheetContext } from "@/context/bottomsheet.context"
import CurrencyInput from "react-native-currency-input"
import { transactionSchema } from "./schema"
import * as yup from 'yup'
import { useTransactionContext } from "@/context/transaction.context"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"
import { ErrorMessage } from "@/components/ErrorMessage"
import { SelectCategoryModal } from "@/components/SelectCategoryModal"
import { TransactionTypeSelector } from "@/components/SelectType"
import { AppButton } from "@/components/AppButton"
import { Transaction } from "@/shared/interfaces/transaction"
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request"

type ValidationErrosTypes = Record<keyof UpdateTransactionInterface, string>

interface EditTransactionFormParams {
    transaction: Transaction
}

export const EditTransactionForm: FC<EditTransactionFormParams> = ({ transaction: transactionToUpdate }) => {
    const { closeBottomSheet } = useBottomSheetContext()
    const { updateTransaction } = useTransactionContext()
    const { handlerError } = useErrorHandler()
    const [loading, setLoading] = useState<boolean>(false)
    const [validationErrors, setValidationErrors] = useState<ValidationErrosTypes>()
    const [transaction, setTransaction] = useState<UpdateTransactionInterface>({
        id: transactionToUpdate.id,
        categoryId: transactionToUpdate.categoryId,
        description: transactionToUpdate.description,
        typeId: transactionToUpdate.typeId,
        value: transactionToUpdate.value
    })

    const handleUpdateTransaction = async () => {
        try {
            setLoading(true)

            await transactionSchema.validate(transaction, {
                abortEarly: false
            })

            await updateTransaction(transaction)
            closeBottomSheet()
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors = {} as ValidationErrosTypes

                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path as keyof UpdateTransactionInterface] = err.message
                    }
                })

                setValidationErrors(errors)
            } else {
                handlerError(error, "Falha ao atualizar transação.")
            }
        } finally {
            setLoading(false)
        }
    }

    const setTransactionData = (key: keyof UpdateTransactionInterface, value: string | number) => {
        setTransaction((prevData) => ({ ...prevData, [key]: value }))
    }

    return (
        <View className="px-8 py-5">
            <TouchableOpacity
                onPress={closeBottomSheet}
                className="w-full flex-row items-center justify-between"
            >
                <Text className="text-white text-xl font-bold">Editar transação</Text>
                <MaterialIcons
                    name="close"
                    color={colors.gray[700]}
                    size={20}
                />
            </TouchableOpacity>

            <View className="flex-1 mt-8 mb-8">
                <TextInput
                    placeholder="Descrição"
                    placeholderTextColor={colors.gray[700]}
                    value={transaction.description}
                    onChangeText={(text) => setTransactionData("description", text)}
                    className="text-white text-lg h-[50] bg-background-primary my-2 rounded-[6] pl-4"
                />

                {validationErrors?.description && <ErrorMessage>{validationErrors.description}</ErrorMessage>}

                <CurrencyInput
                    value={transaction.value}
                    prefix="R$ "
                    delimiter="."
                    separator=","
                    precision={2}
                    minValue={0}
                    onChangeValue={(value) => setTransactionData("value", value ?? 0)}
                    className="text-white text-lg h-[50] bg-background-primary my-2 rounded-[6] pl-4"
                />

                {validationErrors?.value && <ErrorMessage>{validationErrors.value}</ErrorMessage>}

                <SelectCategoryModal
                    selectedCategory={transaction.categoryId}
                    onSelect={(categoryId) => setTransactionData("categoryId", categoryId)}
                />

                {validationErrors?.categoryId && <ErrorMessage>{validationErrors.categoryId}</ErrorMessage>}

                <TransactionTypeSelector
                    typeId={transaction.typeId}
                    setTransactionType={(typeId) => setTransactionData("typeId", typeId)}
                />

                {validationErrors?.typeId && <ErrorMessage>{validationErrors.typeId}</ErrorMessage>}

                <View className="my-4">
                    <AppButton onPress={handleUpdateTransaction}>
                        {loading ? <ActivityIndicator color={colors.white} /> : "Atualizar"}
                    </AppButton>
                </View>
            </View>
        </View>
    )
}