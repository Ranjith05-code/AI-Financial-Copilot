const AuthLayout = ({ title, children }) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
                <h1 className="mb-2 text-center text-3xl font-bold">
                    AI Financial Copilot
                </h1>

                <p className="mb-8 text-center text-slate-400">
                    {title}
                </p>

                {children}
            </div>
        </div>
    );
};

export default AuthLayout;