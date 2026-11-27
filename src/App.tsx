import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ComponentShowcase from "./pages/dev/ComponentShowcase";
import { Toast } from "./components/ui/Toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dev/components" replace />}
        />

        <Route
          path="/dev/components"
          element={<ComponentShowcase />}
        />
      </Routes>

      <Toast />
    </BrowserRouter>
  );
}

export default App;