import { StatusBar } from "expo-status-bar"
import NavigationRoutes from "./src/routes"
import "@/styles/global.css"
import { AutheContextProvider } from "@/context/auth.context"

export default function App() {
  return (
    <AutheContextProvider>
      <StatusBar style="light" />
      <NavigationRoutes />
    </AutheContextProvider>
  )
}
