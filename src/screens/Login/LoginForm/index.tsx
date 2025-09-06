import { AppButton } from "@/components/AppButton"
import { AppInput } from "@/components/AppInput"
import { PublicStackParamsList } from "@/routes/PublicRoutes"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useForm } from "react-hook-form"
import { ActivityIndicator, Text, View } from "react-native"
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from "./schema"
import { useAuthContext } from "@/context/auth.context"
import { AxiosError } from "axios"
import { useSnackbarContext } from "@/context/snackbar.context"
import { AppError } from "@/shared/helpers/AppError"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"
import { colors } from "@/shared/colors"

export interface FormLoginParams {
    email: string
    password: string
}

export const LoginForm = () => {
    const { notify } = useSnackbarContext()
    const { handleAuthenticate } = useAuthContext()
    const { handlerError } = useErrorHandler()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormLoginParams>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(schema)
    })


    const navigation = useNavigation<NavigationProp<PublicStackParamsList>>()

    const onSubmit = async (userData: FormLoginParams) => {
        try {
            await handleAuthenticate(userData)
        } catch (error) {
            handlerError(error, "Falha ao logar.")
        }
    }

    return (
        <>
            <AppInput
                control={control}
                name="email"
                label="E-MAIL"
                placeholder="mail@example.com"
                leftIconName="mail-outline"
            />

            <AppInput
                control={control}
                name="password"
                label="SENHA"
                placeholder="Sua senha"
                leftIconName="lock-outline"
                secureTextEntry
            />

            <View className="flex-1 justify-between mt-8 mb-6 min-h-[250]">
                <AppButton
                    iconName="arrow-forward"
                    onPress={handleSubmit(onSubmit)}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        "Login"
                    )}
                </AppButton>

                <View>
                    <Text className="mb-6 text-gray-300 text-base">Ainda não possui uma conta?</Text>

                    <AppButton
                        iconName="arrow-forward"
                        mode="outline"
                        onPress={() => navigation.navigate("Register")}
                    >
                        Cadastrar
                    </AppButton>
                </View>
            </View>
        </>
    )
}