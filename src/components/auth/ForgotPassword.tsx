import { useState } from "react";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate=useNavigate()
    const [email, setEmail] = useState("rockerstar400@gmail.com"); // Default value set kar di
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            // Backend API call to send reset link
            const response = await axios.post(
                `${import.meta.env.VITE_APP_URL}api/admin/forgot-password`,
                { email }
            );
            if(response?.data){
                navigate('/verify-otp')
            }
            setMessage("Password reset link has been sent to your email!");
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h1 className="mb-4 text-xl font-bold text-gray-800">Reset Password</h1>
                <p className="mb-6 text-sm text-gray-500">
                    We will send a password reset link to <b>{email}</b>
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <Label>Email Address</Label>
                        <Input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            // Agar aap chahte hain user email change na kar sake to 'readOnly' laga dein:
                            // readOnly 
                        />
                    </div>

                    {message && <p className="text-sm text-green-600">{message}</p>}
                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button className="w-full" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/" className="text-sm text-blue-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}