import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const ChangePasswordForm = () => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {

            await api.put("/users/change-password", { currentPassword, newPassword: password });

            toast.success("Password changed successfully.");

            setCurrentPassword("");
            setPassword("");
            setConfirmPassword("");

        } catch (err) {

            toast.error(err.response?.data?.message || "Failed to change password.");

        }

    };

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Change Password

            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-800 rounded-xl p-3 outline-none"
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="w-full bg-slate-800 rounded-xl p-3 outline-none"
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                    className="w-full bg-slate-800 rounded-xl p-3 outline-none"
                />

                <button
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
                >

                    Change Password

                </button>

            </form>

        </div>

    );

};

export default ChangePasswordForm;