import { StatusBar } from "expo-status-bar"
import NavigationRoutes from "./src/routes"
import "@/styles/global.css"

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationRoutes />
    </>
  )
}
