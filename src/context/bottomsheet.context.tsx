import { colors } from "@/shared/colors"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { createContext, FC, PropsWithChildren, useCallback, useContext, useRef, useState } from "react"
import { TouchableWithoutFeedback, View } from "react-native"

interface BottomSheetContextType {
    openBottomSheet: (content: React.ReactNode, index: number) => void
    closeBottomSheet: () => void
}

export const BottomSheetContext = createContext({} as BottomSheetContextType)

export const BottomSheetProvider: FC<PropsWithChildren> = ({ children }) => {
    const [content, setContent] = useState<React.ReactNode | null>(null)
    const [index, setIndex] = useState<number>(-1)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = ["70%", "90%"]

    const openBottomSheet = useCallback(
        (newContent: React.ReactNode, index: number) => {
            setIndex(index)
            setContent(newContent)
            setIsOpen(true)

            requestAnimationFrame(() => {
                bottomSheetRef?.current?.snapToIndex(index)
            })
        },
        [])

    const closeBottomSheet = useCallback(() => {
        setContent(null)
        setIndex(-1)
        setIsOpen(false)
        bottomSheetRef?.current?.close()
    }, [])

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setIsOpen(false)
        }
    }, [])

    return (
        <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
            {children}

            {isOpen && (
                <TouchableWithoutFeedback onPress={closeBottomSheet}>
                    <View className="absolute inset-0 bg-black/70 z-1" />
                </TouchableWithoutFeedback>
            )}

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                style={{ zIndex: 2 }}
                index={index}
                enablePanDownToClose
                onChange={handleSheetChanges}
                backgroundStyle={{
                    backgroundColor: colors["background-secondary"],
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    elevation: 9
                }}
            >
                <BottomSheetScrollView>
                    {content}
                </BottomSheetScrollView>
            </BottomSheet>
        </BottomSheetContext.Provider>
    )
}

export const useBottomSheetContext = () => {
    const context = useContext(BottomSheetContext)

    return context
}