import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import api from "../services/api";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            toast.success("Login Successful");

            setTimeout(() => {

                navigate("/dashboard");

            }, 1000);

        }

        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    return (

        <>

            <ToastContainer position="top-right" />

            <AuthLayout title="Sign in to continue">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button type="submit">

                        Login

                    </Button>

                </form>

                <p className="mt-6 text-center text-slate-400">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="ml-2 text-blue-400 hover:text-blue-300"
                    >

                        Register

                    </Link>

                </p>

            </AuthLayout>

        </>

    );

};

export default Login;