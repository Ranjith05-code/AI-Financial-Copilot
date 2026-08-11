import { Link, useLocation } from "react-router-dom";

import {
    FaChartLine,
    FaWallet,
    FaRobot,
    FaCog,
    FaMoneyBillWave,
    FaChartPie,
    FaRedoAlt,
    FaBullseye,
    FaArrowUp,
    FaFileAlt,
    FaCamera,
} from "react-icons/fa";

const NAV = [
    { to: "/dashboard",  icon: <FaChartLine />,     label: "Dashboard"     },
    { to: "/income",     icon: <FaArrowUp />,        label: "Income"        },
    { to: "/expenses",   icon: <FaMoneyBillWave />,  label: "Expenses"      },
    { to: "/recurring",  icon: <FaRedoAlt />,        label: "Recurring"     },
    { to: "/budget",     icon: <FaWallet />,         label: "Budget"        },
    { to: "/analytics",  icon: <FaChartPie />,       label: "Analytics"     },
    { to: "/goals",      icon: <FaBullseye />,       label: "Savings Goal"  },
    { to: "/ai",         icon: <FaRobot />,          label: "AI Advisor"    },
    { to: "/ai-forecast", icon: <FaChartLine />,     label: "AI Forecast"   },
    { to: "/ai-savings-planner", icon: <FaBullseye />, label: "AI Savings Planner" },
    { to: "/monthly-ai-report", icon: <FaFileAlt />, label: "AI Report" },
    { to: "/receipt-scanner", icon: <FaCamera />, label: "Receipt Scanner" },
    { to: "/settings",   icon: <FaCog />,            label: "Settings"      },
];

const Sidebar = () => {
    const location = useLocation();

    const isActiveRoute = (path) => {
        if (path === "/monthly-ai-report") {
            return ["/monthly-ai-report", "/yearly-ai-report"].includes(location.pathname);
        }

        return location.pathname === path;
    };

    const menuClass = (path) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
            isActiveRoute(path)
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800 hover:text-blue-400"
        }`;

    return (
        <aside className="w-64 bg-slate-900 min-h-screen shadow-2xl p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-10 text-center">💰 FinanceAI</h1>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {NAV.map(({ to, icon, label }) => (
                        <li key={to}>
                            <Link to={to} className={menuClass(to)}>
                                {icon}
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
