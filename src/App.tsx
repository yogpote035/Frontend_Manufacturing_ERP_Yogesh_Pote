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
import OpportunitiesPage from "./pages/sales/OpportunitiesPage";
import QuotationPage from "./pages/sales/QuotationPage";
import QuotationView from "./components/modules/sales/components/QuotationView";
import OrdersPage from "./pages/sales/OrdersPage";
import OrderView from "./components/modules/sales/components/OrderView";
import SalesProductionPage from "./pages/sales/SalesProductionPage";
import OpportunityView from "./components/modules/sales/components/OpportunityView";
import LeadForm from "./components/modules/sales/components/LeadForm";
import LeadView from "./components/modules/sales/components/LeadView";
import NotesPage from "./components/common/NotePage";
import OpportunityEdit from "./components/modules/sales/components/OpportunityEdit";
import QuotationCreate from "./components/modules/sales/components/QuotationCreate";
import ProductionEdit from "./components/modules/sales/components/ProductionEdit";

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
              path: "opportunities",
              element: <OpportunitiesPage />,
            },
                        {
              path: "opportunity-view/:id",
              element: <OpportunityView />,
            },
            {
              path: "opportunity-edit/:id",
              element: <OpportunityEdit/>
            },
            {
              path: "quotation",
              element: <QuotationPage />,
            },

            {
              path: "quotation-view/:id",
              element: <QuotationView />,
            },
            {
              path:"quotation-create",
              element:<QuotationCreate/>
            },
            {
              path: "orders",
              element: <OrdersPage />,
            },
            {
              path: "order-view/:id",
              element: <OrderView />,
            },
            {
              path: "production",
              element: <SalesProductionPage />,
            },
            {
              path:"production-edit/:id",
              element:<ProductionEdit/>
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