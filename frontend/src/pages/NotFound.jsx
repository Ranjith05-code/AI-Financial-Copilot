import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center text-center px-6">
        <FaExclamationTriangle className="text-yellow-400 mb-6" size={64} />
        <h1 className="text-8xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-3">Page Not Found</h2>
        <p className="text-slate-400 mb-10 max-w-md">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition"
        >
            Back to Dashboard
        </Link>
    </div>
);

export default NotFound;
