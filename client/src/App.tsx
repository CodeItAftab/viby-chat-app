import { ThemeProvider } from "@/components/theme-provider";

import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
