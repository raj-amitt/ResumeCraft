import { RouterProvider } from "react-router";
import { router } from "../src/app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
