import { StatusBar } from "expo-status-bar"
import NavigationRoutes from "./src/routes"
import "@/styles/global.css"
import { AutheContextProvider } from "@/context/auth.context"
import { SnackbarContextProvider } from "@/context/snackbar.context"
import { Snackbar } from "@/components/Snackbar"

export default function App() {
  return (
    <SnackbarContextProvider>
      <AutheContextProvider>
        <StatusBar style="light" />
        <NavigationRoutes />
        <Snackbar />
      </AutheContextProvider>
    </SnackbarContextProvider>
  )
}
