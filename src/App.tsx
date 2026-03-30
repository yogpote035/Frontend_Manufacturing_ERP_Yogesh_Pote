import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy imports
const SalesDashboard = lazy(() => import("./pages/sales/SalesDashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

// Normal imports
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/modules/sales/components/MainLayout/MainLayout";
import NotFound from "./components/common/NotFound";
import ReportsAndAnalytics from "./components/modules/sales/components/ReportsAndAnalytics";
import SalesEmployees from "./components/modules/sales/components/SalesEmployees";
import RoleNotMatched from "./components/common/RoleNotMatched";
import LeadsPage from "./pages/sales/LeadsPage";
import LeadForm from "./components/modules/sales/components/LeadForm";
import LeadView from "./components/modules/sales/components/LeadView";
import NotesPage from "./components/common/NotePage";

/* Global Suspense Wrapper */
const withSuspense = (Component: React.ReactNode) => (
  <Suspense fallback={<div className="text-xl text-green-400 text-center">Loading...</div>}>{Component}</Suspense>
);

function App() {
  const router = createBrowserRouter([

    // Login Route
    {
      path: "/",
      element: withSuspense(<LoginPage />),
    },

    // Role mismatch
    {
      path: "/role-mismatch",
      element: <RoleNotMatched />,
    },

    // Sales Module
    {
      path: "/sales",
      element: <ProtectedRoute requiredRole="sales_manager" />,
      children: [
        {
          element: <MainLayout />,
          children: [

            // Default route → /sales
            {
              index: true,
              element: withSuspense(<SalesDashboard />),
            },

            {
              path: "dashboard",
              element: withSuspense(<SalesDashboard />),
            },

            {
              path: "leads",
              element: <LeadsPage />,
            },

            {
              path: "new-lead",
              element: <LeadForm />,
            },

            {
              path: "reports",
              element: <ReportsAndAnalytics />,
            },

            {
              path: "employees",
              element: <SalesEmployees />,
            },
            {
              path: "lead-view/:id",
              element: <LeadView />,
            },
            {
              path: "notes",
              element: <NotesPage />,
            },
          ],
        },
      ],
    },

    // Fallback Route
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <Suspense fallback={<div className="text-xl text-green-400 text-center">Loading App...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;