import { FormLoginParams } from "@/screens/Login/LoginForm"
import { FormRegisterParams } from "@/screens/Register/RegisterForm"
import { IAuthenticateResponse } from "@/shared/interfaces/https/authenticate-response"
import { IUser } from "@/shared/interfaces/https/user-interface"
import * as authService from "@/shared/services/personal-finances/auth.service"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, FC, PropsWithChildren, useContext, useState } from "react"

type AuthContextType = {
    user: IUser | null
    token: string | null
    handleAuthenticate: (params: FormLoginParams) => Promise<void>
    handleRegister: (params: FormRegisterParams) => Promise<void>
    handleLogout: () => void
    restoreUserSession: () => Promise<string | null>
}

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
)

export const AutheContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const handleAuthenticate = async (userData: FormLoginParams) => {
        const { user, token } = await authService.authenticate(userData)

        await AsyncStorage.setItem("personal-finances@user", JSON.stringify({ user, token }))

        setUser(user)
        setToken(token)
    }

    const handleRegister = async (formData: FormRegisterParams) => {
        const { user, token } = await authService.registerUser(formData)

        await AsyncStorage.setItem("personal-finances@user", JSON.stringify({ user, token }))

        setUser(user)
        setToken(token)
    }

    const restoreUserSession = async () => {
        const userData = await AsyncStorage.getItem("personal-finances@user")

        if (userData) {
            const { user, token } = JSON.parse(userData) as IAuthenticateResponse

            setUser(user)
            setToken(token)

            return userData
        } else {
            return null
        }
    }

    const handleLogout = async () => {
        await AsyncStorage.clear()
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            handleAuthenticate,
            handleRegister,
            handleLogout,
            restoreUserSession
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    return context
}