import { StatusBar } from "expo-status-bar"
import NavigationRoutes from "./src/routes"
import { AutheContextProvider } from "@/context/auth.context"
import { BottomSheetProvider } from "@/context/bottomsheet.context"
import { SnackbarContextProvider } from "@/context/snackbar.context"
import { Snackbar } from "@/components/Snackbar"
import "@/styles/global.css"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SnackbarContextProvider>
        <AutheContextProvider>
          <BottomSheetProvider>
            <StatusBar style="light" />
            <NavigationRoutes />
            <Snackbar />
          </BottomSheetProvider>
        </AutheContextProvider>
      </SnackbarContextProvider>
    </GestureHandlerRootView>
  )
}
