import { useNavigate } from "react-router-dom";

const LogoutCard = () => {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Account

            </h2>

            <button

                onClick={logout}

                className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-semibold"

            >

                Logout

            </button>

        </div>

    );

};

export default LogoutCard;