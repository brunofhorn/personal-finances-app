import { AppButton } from "@/components/AppButton"
import { AppInput } from "@/components/AppInput"
import { PublicStackParamsList } from "@/routes/PublicRoutes"
import { yupResolver } from "@hookform/resolvers/yup"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useForm } from "react-hook-form"
import { ActivityIndicator, Text, View } from "react-native"
import { schema } from "./schema"
import { useAuthContext } from "@/context/auth.context"
import { AxiosError } from "axios"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"
import { colors } from "@/shared/colors"

export interface FormRegisterParams {
    email: string
    name: string
    password: string
    confirmPassword: string
}

export const RegisterForm = () => {
    const { handleRegister } = useAuthContext()
    const { handlerError } = useErrorHandler()
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormRegisterParams>({
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema)
    })


    const navigation = useNavigation<NavigationProp<PublicStackParamsList>>()

    const onSubmit = async (userRegisterData: FormRegisterParams) => {
        try {
            await handleRegister(userRegisterData)
        } catch (error) {
            handlerError(error, "Falha ao cadastrar usuário.")
        }
    }

    return (
        <>
            <AppInput
                control={control}
                name="name"
                leftIconName="person"
                label="Nome"
                placeholder="Seu nome"
            />

            <AppInput
                control={control}
                name="email"
                leftIconName="mail-outline"
                label="E-mail"
                placeholder="mail@example.com.br"
            />

            <AppInput
                control={control}
                name="password"
                leftIconName="lock-outline"
                label="Senha"
                placeholder="Sua senha"
                secureTextEntry
            />

            <AppInput
                control={control}
                name="confirmPassword"
                leftIconName="lock-outline"
                label="Confirmar Senha"
                placeholder="Confirme sua senha"
                secureTextEntry
            />

            <View className="flex-1 justify-between mt-8 mb-6 min-h-[200px]">
                <AppButton
                    iconName="arrow-forward"
                    onPress={handleSubmit(onSubmit)}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        "Cadastrar"
                    )}
                </AppButton>

                <View>
                    <Text className="mb-6 text-gray-300 text-base">Já possui uma conta?</Text>

                    <AppButton
                        iconName="arrow-forward"
                        mode="outline"
                        onPress={() => navigation.navigate("Login")}
                    >
                        Acessar
                    </AppButton>
                </View>
            </View>
        </>
    )
}