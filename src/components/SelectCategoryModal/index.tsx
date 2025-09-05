import { FC, useMemo, useState } from "react"
import { FlatList, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import Checkbox from "expo-checkbox"
import { useTransactionContext } from "@/context/transaction.context"
import clsx from "clsx"

interface SelectCategoryModalProps {
    selectedCategory: number
    onSelect: (categoryId: number) => void
}

export const SelectCategoryModal: FC<SelectCategoryModalProps> = ({
    selectedCategory,
    onSelect
}) => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const { categories } = useTransactionContext()
    const selected = useMemo(
        () => categories.find(({ id }) => id === selectedCategory),
        [])

    const handleModal = () => {
        setShowModal((prevState) => !prevState)
    }

    const handleSelect = (categoryId: number) => {
        onSelect(categoryId)
        setShowModal(false)
    }

    return (
        <>
            <TouchableOpacity onPress={handleModal} className="my-2 rounded-[6] pl-4 justify-center">
                <Text className={clsx("text-lg", selected ? "text-white" : "text-gray-700")}>{selected?.name ?? "Categoria"}</Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="slide"
            >
                <TouchableWithoutFeedback>
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="w-[90%] bg-background-secondary p-4 rounded-xl">
                            <Text className="text-white text-lg mb-4">Selecione uma categoria</Text>

                            <FlatList
                                data={categories}
                                keyExtractor={(item) => `category-${item.id}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item.id)}
                                        className="flex-row items-center bg-gray-800 rounded-lg mb-2 p-4"
                                    >
                                        <Checkbox
                                            value={selected?.id === item.id}
                                            onValueChange={() => handleSelect(item.id)}
                                            className="mr-2"
                                        />
                                        <Text className="text-white text-lg">{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}