import { RouterProvider } from "react-router";
import { router } from "../src/app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterViewProvider } from "./features/interview/interview.context.jsx";
const App = () => {
  return (
    <AuthProvider>
      <InterViewProvider>
        <RouterProvider router={router} />
      </InterViewProvider>
    </AuthProvider>
  );
};

export default App;
