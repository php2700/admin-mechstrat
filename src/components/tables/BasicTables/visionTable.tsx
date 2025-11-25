// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";
import VisionDetail from "./visionDetail";

export default function Vision() {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [data, setData] = useState(null);

    const saveData = async () => {
        const token = localStorage.getItem("mechstratToken");
        if (!token) {
            setError("Token missing. Please login again.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const res = await axios.post(
                `${import.meta.env.VITE_APP_URL}api/admin/vision`,
                { description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage(res.data.message || "Saved successfully!");
            getData();
        } catch (err) {
            setError(err.response?.data?.message || "Saving failed.");
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        const token = localStorage.getItem("mechstratToken");
        if (!token) return;

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_URL}api/admin/vision`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data?.data) {
                setData(res.data.data);
                setDescription(res.data.data.description || "");
            }
        } catch (err) {
            setError("Failed to fetch existing data.");
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="flex flex-col  gap-6 p-8 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-lg w-full mx-auto">
            
            {/* Description Input */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                className="w-full h-40 p-3 rounded-xl border border-gray-300 outline-none"
            />

            {/* Save Button */}
            <button
                onClick={saveData}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition"
            >
                {loading ? "Saving..." : "Save Description"}
            </button>

            {/* Messages */}
            {error && (
                <div className="w-full text-center p-3 rounded-lg bg-red-100 text-red-700">
                    {error}
                </div>
            )}
            {message && !error && (
                <div className="w-full text-center p-3 rounded-lg bg-green-100 text-green-700">
                    {message}
                </div>
            )}
            <VisionDetail/>
        </div>
    );
}
