import { AppButton } from "@/components/AppButton"
import { AppInput } from "@/components/AppInput"
import { PublicStackParamsList } from "@/routes/PublicRoutes"
import { yupResolver } from "@hookform/resolvers/yup"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useForm } from "react-hook-form"
import { Text, View } from "react-native"
import { schema } from "./schema"

interface FormRegisterProps {
    email: string
    name: string
    password: string
    confirmPassword: string
}

export const RegisterForm = () => {
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormRegisterProps>({
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema)
    })

    const navigation = useNavigation<NavigationProp<PublicStackParamsList>>()

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
                <AppButton iconName="arrow-forward">Cadastrar</AppButton>

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