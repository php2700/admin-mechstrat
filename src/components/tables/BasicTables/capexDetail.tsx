// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiImage } from "react-icons/fi";

export default function CapexDetail() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const token = localStorage.getItem("mechstratToken");

    // Clean image path
    const cleanImagePath = (path) => {
        if (!path) return "";
        return `${import.meta.env.VITE_APP_URL}${path.image}`;
    };

    // Fetch all capex detail
    const getItems = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_URL}api/admin/capex-detail`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setItems(res.data.data || []);
        } catch {
            setError("Failed to load capex detail.");
        }
    };

    // Add or Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            if (formData.image) data.append("image", formData.image);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            if (editingItem) {
                data.append("_id", editingItem._id);
                await axios.patch(
                    `${import.meta.env.VITE_APP_URL}api/admin/capex-detail`,
                    data,
                    config
                );
            } else {
                await axios.post(
                    `${import.meta.env.VITE_APP_URL}api/admin/capex-detail`,
                    data,
                    config
                );
            }

            setShowModal(false);
            setFormData({ title: "", description: "", image: null });
            setEditingItem(null);
            setPreview(null);
            getItems();
        } catch {
            setError("Failed to save capex detail.");
        }
    };

    // Delete
    const handleDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_APP_URL}api/admin/capex-detail/${itemToDelete._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            getItems();
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch {
            setError("Failed to delete item.");
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    // Edit
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            image: null,
        });
        setPreview(cleanImagePath(item.image));
        setPreview(`${import.meta.env.VITE_APP_URL}${item.image}`)
        setShowModal(true);
    };

    // Add new
    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ title: "", description: "", image: null });
        setPreview(null);
        setShowModal(true);
    };

    // Handle Image
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        if (file) setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-700">Capex Detail</h2>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition"
                >
                    <FiPlus /> Add
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-xl text-center">
                    {error}
                </div>
            )}
            {items?.length == 0 ? (
                <p className="text-center text-gray-500">No capex detail found.</p>
            ) : (
                <div className="space-y-3">
                    {items?.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-white shadow hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <img
                                    src={`${import.meta.env.VITE_APP_URL}${item.image}`}
                                    alt={item.title}
                                    className="w-14 h-14 rounded-full object-cover border"
                                />
                                <div>
                                    <h4 className="text-lg font-semibold">{item.title}</h4>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200"
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setEditingItem(null);
                                setPreview(null);
                            }}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>

                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            {editingItem ? "Edit Strategy" : "Add Strategy"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Image Upload */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center overflow-hidden bg-blue-50">
                                    {preview ? (
                                        <img src={preview} className="w-full h-full object-cover" />
                                    ) : (
                                        <FiImage className="text-blue-400 text-4xl" />
                                    )}
                                </div>
                                <label className="cursor-pointer text-blue-600 font-medium">
                                    Upload Image
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="font-semibold">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full border rounded-xl p-3"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="font-semibold">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full border rounded-xl p-3 h-28"
                                    required
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2 border rounded-xl text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
                                >
                                    {editingItem ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
                        <h3 className="text-xl font-bold mb-3">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Delete{" "}
                            <span className="font-semibold text-red-600">
                                {itemToDelete?.title}
                            </span>
                            ?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={cancelDelete}
                                className="px-5 py-2 border rounded-xl text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2 bg-red-500 text-white rounded-xl"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
