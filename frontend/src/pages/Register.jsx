import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import api from "../services/api";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [otp, setOtp] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Step 1 — send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/send-otp", formData);
            toast.success("Verification code sent to your email!");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send verification code");
        } finally {
            setLoading(false);
        }
    };

    // Step 2 — verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/verify-otp", { email: formData.email, otp });
            toast.success("Account created! Please login.");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid verification code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" />

            {step === 1 ? (
                <AuthLayout title="Create your account">
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <Input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password (min 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Verification Code"}
                        </Button>
                    </form>
                    <p className="mt-6 text-center text-slate-400">
                        Already have an account?
                        <Link to="/" className="ml-2 text-blue-400 hover:text-blue-300">Login</Link>
                    </p>
                </AuthLayout>
            ) : (
                <AuthLayout title="Verify your email">
                    <p className="text-slate-400 text-sm mb-6 text-center">
                        We sent a 6-digit code to <span className="text-white font-semibold">{formData.email}</span>. Enter it below.
                    </p>
                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center text-2xl tracking-widest outline-none focus:border-blue-500"
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify & Create Account"}
                        </Button>
                    </form>
                    <button
                        onClick={() => setStep(1)}
                        className="mt-4 w-full text-center text-slate-400 hover:text-white text-sm transition"
                    >
                        ← Back to registration
                    </button>
                </AuthLayout>
            )}
        </>
    );
};

export default Register;
