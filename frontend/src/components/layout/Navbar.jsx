import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <div className="flex justify-between items-center bg-slate-900 px-8 py-5 shadow-lg">

            <h2 className="text-2xl font-bold">

                AI Financial Copilot

            </h2>

            <div className="flex items-center gap-3">

                <FaUserCircle size={34} />

                <span>

                    Welcome, {user?.name || "User"}

                </span>

            </div>

        </div>

    );

};

export default Navbar;