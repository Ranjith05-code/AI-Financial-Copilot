import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const UpdateProfileForm = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await api.put("/users/profile", { name, email });

            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Profile updated successfully.");

        } catch (err) {

            toast.error(err.response?.data?.message || "Failed to update profile.");

        }

    };

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Update Profile

            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    className="w-full bg-slate-800 rounded-xl p-3 outline-none"
                    placeholder="Name"
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="w-full bg-slate-800 rounded-xl p-3 outline-none"
                    placeholder="Email"
                />

                <button
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
                >

                    Save Changes

                </button>

            </form>

        </div>

    );

};

export default UpdateProfileForm;