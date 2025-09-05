import { CreateTransactionInterface } from "@/shared/interfaces/https/create-transaction-request"
import { useState } from "react"
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from "@/shared/colors"
import { useBottomSheetContext } from "@/context/bottomsheet.context"
import CurrencyInput from "react-native-currency-input"
import { TransactionTypeSelector } from "../SelectType"
import { SelectCategoryModal } from "../SelectCategoryModal"
import { transactionSchema } from "./schema"
import * as yup from 'yup'
import { AppButton } from "../AppButton"
import { ErrorMessage } from "../ErrorMessage"
import { useTransactionContext } from "@/context/transaction.context"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"

type ValidationErrosTypes = Record<keyof CreateTransactionInterface, string>

export const NewTransaction = () => {
    const { closeBottomSheet } = useBottomSheetContext()
    const { createTransaction } = useTransactionContext()
    const { handlerError } = useErrorHandler()
    const [loading, setLoading] = useState<boolean>(false)
    const [validationErrors, setValidationErrors] = useState<ValidationErrosTypes>()
    const [transaction, setTransaction] = useState<CreateTransactionInterface>({
        description: "",
        categoryId: 0,
        typeId: 0,
        value: 0
    })

    const handleCreateTransaction = async () => {
        try {
            setLoading(true)

            await transactionSchema.validate(transaction, {
                abortEarly: false
            })

            await createTransaction(transaction)
            closeBottomSheet()
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors = {} as ValidationErrosTypes

                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path as keyof CreateTransactionInterface] = err.message
                    }
                })

                setValidationErrors(errors)
            } else {
                handlerError(error, "Falha ao criar transação.")
            }
        } finally {
            setLoading(false)
        }
    }

    const setTransactionData = (key: keyof CreateTransactionInterface, value: string | number) => {
        setTransaction((prevData) => ({ ...prevData, [key]: value }))
    }

    return (
        <View className="px-8 py-5">
            <TouchableOpacity
                onPress={closeBottomSheet}
                className="w-full flex-row items-center justify-between"
            >
                <Text className="text-white text-xl font-bold">Nova transação</Text>
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
                    className="text-white text-lg h-[50px] bg-background-primary my-2 rounded-[6] pl-4"
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
                    className="text-white text-lg h-[50px] bg-background-primary my-2 rounded-[6] pl-4"
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
                    <AppButton onPress={handleCreateTransaction}>
                        {loading ? <ActivityIndicator color={colors.white} /> : "Registrar"}
                    </AppButton>
                </View>
            </View>
        </View>
    )
}