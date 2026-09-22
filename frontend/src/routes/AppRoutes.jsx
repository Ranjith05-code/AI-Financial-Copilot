import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Expenses = lazy(() => import("../pages/Expenses"));
const Budget = lazy(() => import("../pages/Budget"));
const Analytics = lazy(() => import("../pages/Analytics"));
const AIAdvisor = lazy(() => import("../pages/AIAdvisor"));
const AIForecast = lazy(() => import("../pages/AIForecast"));
const AISavingsPlanner = lazy(() => import("../pages/AISavingsPlanner"));
const AIReport = lazy(() => import("../pages/AIReport"));
const ReceiptScanner = lazy(() => import("../pages/ReceiptScanner"));
const Settings = lazy(() => import("../pages/Settings"));
const RecurringExpenses = lazy(() => import("../pages/RecurringExpenses"));
const Goals = lazy(() => import("../pages/Goals"));
const Income = lazy(() => import("../pages/Income"));
const NotFound = lazy(() => import("../pages/NotFound"));

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const ProtectedLayout = () => {
    if (!localStorage.getItem("token")) return <Navigate to="/" replace />;
    return (
        <div className="flex min-h-screen bg-slate-950 text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const renderPage = (Component) => (
    <Suspense fallback={<div className="p-8 text-slate-300">Loading...</div>}>
        <Component />
    </Suspense>
);

const router = createBrowserRouter([
    { path: "/",         element: renderPage(Login)    },
    { path: "/register", element: renderPage(Register) },
    {
        element: <ProtectedLayout />,
        children: [
            { path: "/dashboard", element: renderPage(Dashboard)         },
            { path: "/income",    element: renderPage(Income)            },
            { path: "/expenses",  element: renderPage(Expenses)          },
            { path: "/recurring", element: renderPage(RecurringExpenses) },
            { path: "/budget",    element: renderPage(Budget)            },
            { path: "/analytics", element: renderPage(Analytics)         },
            { path: "/ai",        element: renderPage(AIAdvisor)         },
            { path: "/ai-forecast", element: renderPage(AIForecast) },
            { path: "/ai-savings-planner", element: renderPage(AISavingsPlanner) },
            { path: "/receipt-scanner", element: renderPage(ReceiptScanner) },
            { path: "/monthly-ai-report", element: renderPage(AIReport) },
            { path: "/yearly-ai-report", element: renderPage(AIReport) },
            { path: "/goals",     element: renderPage(Goals)             },
            { path: "/settings",  element: renderPage(Settings)          },
        ],
    },
    { path: "*", element: renderPage(NotFound) },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
