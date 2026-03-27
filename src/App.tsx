import {
  createBrowserRouter,
  RouterProvider,
  // Outlet
} from "react-router-dom";
import { lazy, Suspense } from "react";

const SalesDashboard = lazy(() => import("./pages/sales/SalesDashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/modules/sales/components/MainLayout/MainLayout";
import NotFound from "./components/common/NotFound";
import NewLead from "./pages/sales/NewLead";

// const Layout = () => {
//   return (
//     <>
//       {/* Common UI like Navbar, Sidebar */}
//       <Outlet />
//     </>
//   );
// };

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    // Sales Module Routes
    {
      path: "/sales",
      element: <ProtectedRoute requiredRole="sales_manager" />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              index: true, // default route → /sales
              element: <Suspense fallback={<div>Loading...</div>}>
                <SalesDashboard />
              </Suspense>,
            },
            {
              path: "home",
              element: <Suspense fallback={<div>Loading...</div>}>
                <SalesDashboard />
              </Suspense>,
            },
            {
              path: "new-lead",
              element: <NewLead />,
            },
          ],
        },
      ],
    },

    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;