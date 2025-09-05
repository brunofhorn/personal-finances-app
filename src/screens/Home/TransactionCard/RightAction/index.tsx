import { TouchableOpacity } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from "@/shared/colors"
import { FC, useState } from "react"
import { DeleteModal } from "./DeleteModal"
import * as transactionService from "@/shared/services/personal-finances/transaction.service"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"
import { useSnackbarContext } from "@/context/snackbar.context"

interface RightActionParams {
    transactionId: number
}

export const RightAction: FC<RightActionParams> = ({ transactionId }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { handlerError } = useErrorHandler()
    const { notify } = useSnackbarContext()

    const showModal = () => setModalVisible(true)

    const hideModal = () => setModalVisible(false)

    const handleDeleteTransaction = async () => {
        try {
            setLoading(true)

            await transactionService.deleteTransaction(transactionId)
            notify({
                message: "Transação deletada com sucesso.",
                messageType: "SUCCESS"
            })

            hideModal()
        } catch (error) {
            handlerError(error, "Falha ao deletar a transação.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <TouchableOpacity
                onPress={showModal}
                activeOpacity={0.8}
                className="h-[140] bg-accent-red-background-primary w-[80] rounded-r-[6] items-center justify-center">
                <MaterialIcons name="delete-outline" color={colors.white} size={30} />
            </TouchableOpacity>
            <DeleteModal visible={modalVisible} hideModal={hideModal} handleDeleteTransaction={handleDeleteTransaction} loading={loading} />
        </>
    )
}