import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {

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

export default DashboardLayout;