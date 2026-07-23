import { FaUserCircle } from "react-icons/fa";

const ProfileCard = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <div className="bg-slate-900 rounded-2xl p-8 shadow-lg">

            <div className="flex items-center gap-6">

                <FaUserCircle
                    size={80}
                    className="text-blue-500"
                />

                <div>

                    <h2 className="text-3xl font-bold">

                        {user?.name || "User"}

                    </h2>

                    <p className="text-slate-400 mt-2">

                        {user?.email}

                    </p>

                </div>

            </div>

        </div>

    );

};

export default ProfileCard;