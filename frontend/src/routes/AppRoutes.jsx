import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Budget from "../pages/Budget";
import Analytics from "../pages/Analytics";
import AIAdvisor from "../pages/AIAdvisor";
import Settings from "../pages/Settings";
import RecurringExpenses from "../pages/RecurringExpenses";
import Goals from "../pages/Goals";
import Income from "../pages/Income";
import NotFound from "../pages/NotFound";

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

const router = createBrowserRouter([
    { path: "/",         element: <Login />    },
    { path: "/register", element: <Register /> },
    {
        element: <ProtectedLayout />,
        children: [
            { path: "/dashboard", element: <Dashboard />         },
            { path: "/income",    element: <Income />            },
            { path: "/expenses",  element: <Expenses />          },
            { path: "/recurring", element: <RecurringExpenses /> },
            { path: "/budget",    element: <Budget />            },
            { path: "/analytics", element: <Analytics />         },
            { path: "/ai",        element: <AIAdvisor />         },
            { path: "/goals",     element: <Goals />             },
            { path: "/settings",  element: <Settings />          },
        ],
    },
    { path: "*", element: <NotFound /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
