// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AiPage() {
    const [form, setForm] = useState({
        aiDescription: [""],
        marketDescription: "",
        marketStrategyTitle1: "",
        marketStrategyDescription1: "",
        marketStrategyTitle2: "",
        marketStrategyDescription2: "",
        marketStrategyTitle3: "",
        marketStrategyDescription3: "",
        partnershipDescription: "",
        partnershipStrategy: [{ title: "", description: "" }],
    });

    const [files, setFiles] = useState({
        banner: null,
        marketStrategyImage1: null,
        marketStrategyImage2: null,
        marketStrategyImage3: null,
        partnershipImage: null,
    });

    const [preview, setPreview] = useState({});
    const [existingId, setExistingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    // -------------------- HANDLE TEXT CHANGE --------------------
    const changeText = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // -------------------- HANDLE FILE CHANGE --------------------
    const changeFile = (e) => {
        const name = e.target.name;
        const file = e.target.files[0];
        setFiles({ ...files, [name]: file });
        setPreview({ ...preview, [name]: URL.createObjectURL(file) });
    };

    // -------------------- HANDLE ARRAY FIELDS --------------------
    const handleArrayChange = (index, field, value, key) => {
        const list = [...form[key]];
        list[index][field] = value;
        setForm({ ...form, [key]: list });
    };

    const addArrayItem = (key) => {
        setForm({ ...form, [key]: [...form[key], { title: "", description: "" }] });
    };

    const removeArrayItem = (key, index) => {
        const list = [...form[key]];
        if (list.length > 1) list.splice(index, 1);
        setForm({ ...form, [key]: list });
    };

    // -------------------- FETCH EXISTING DATA --------------------
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("mechstratToken");

            const res = await axios.get(
                `${import.meta.env.VITE_APP_URL}api/admin/ai`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data?.data) {
                const d = res.data.data;
                setExistingId(d._id);

                setForm({
                    aiDescription: d.aiDescription || [""],
                    marketDescription: d.marketDescription,
                    marketStrategyTitle1: d.marketStrategyTitle1,
                    marketStrategyDescription1: d.marketStrategyDescription1,
                    marketStrategyTitle2: d.marketStrategyTitle2,
                    marketStrategyDescription2: d.marketStrategyDescription2,
                    marketStrategyTitle3: d.marketStrategyTitle3,
                    marketStrategyDescription3: d.marketStrategyDescription3,
                    partnershipDescription: d.partnershipDescription,
                    partnershipStrategy: d.partnershipStrategy,
                });

                setPreview({
                    banner: `${import.meta.env.VITE_APP_URL}${d.banner}`,
                    marketStrategyImage1: `${import.meta.env.VITE_APP_URL}${d.marketStrategyImage1}`,
                    marketStrategyImage2: `${import.meta.env.VITE_APP_URL}${d.marketStrategyImage2}`,
                    marketStrategyImage3: `${import.meta.env.VITE_APP_URL}${d.marketStrategyImage3}`,
                    partnershipImage: `${import.meta.env.VITE_APP_URL}${d.partnershipImage}`,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // -------------------- SUBMIT FORM --------------------
    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setMsg("");

        const fd = new FormData();

        Object.keys(files).forEach((key) => {
            if (files[key]) fd.append(key, files[key]);
        });

        fd.append("aiDescription", JSON.stringify(form.aiDescription));
        fd.append("partnershipStrategy", JSON.stringify(form.partnershipStrategy));

        Object.keys(form).forEach((key) => {
            if (!["aiDescription", "partnershipStrategy"].includes(key)) {
                fd.append(key, form[key]);
            }
        });

        try {
            const token = localStorage.getItem("mechstratToken");

            const url = `${import.meta.env.VITE_APP_URL}api/admin/ai`;
            await axios.post(url, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMsg("Saved successfully!");
            fetchData();
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // -------------------- UI --------------------

    return (
        <div className="p-8 mx-auto bg-white shadow-lg rounded-xl space-y-10">

            {/* Full width banner */}
            <div>
                <label className="font-semibold text-lg">Banner (Full Width)</label>
                <input
                    type="file"
                    name="banner"
                    accept="image/*"
                    onChange={changeFile}
                    className="w-full border p-2 rounded-lg"
                />

                {preview.banner && (
                    <img src={preview.banner} className="w-full h-80 object-cover mt-3 rounded-lg" />
                )}
            </div>

            {/* aiDescription array */}
            <div>
                <h2 className="text-xl font-semibold">AI Description</h2>

                {form.aiDescription.map((desc, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                        <textarea
                            className="w-full border p-2 rounded"
                            value={desc}
                            onChange={(e) => {
                                const list = [...form.aiDescription];
                                list[index] = e.target.value;
                                setForm({ ...form, aiDescription: list });
                            }}
                        />
                        <button
                            onClick={() => {
                                const list = [...form.aiDescription];
                                if (list.length > 1) list.splice(index, 1);
                                setForm({ ...form, aiDescription: list });
                            }}
                            className="bg-red-500 text-white px-3 rounded"
                        >
                            X
                        </button>
                    </div>
                ))}

                <button
                    onClick={() =>
                        setForm({ ...form, aiDescription: [...form.aiDescription, ""] })
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Add More
                </button>
            </div>
            {/* Market Description */}
<div>
    <label className="font-semibold text-lg">Market Description</label>
    <textarea
        name="marketDescription"
        value={form.marketDescription}
        onChange={changeText}
        className="w-full border p-3 rounded-lg mt-2"
        placeholder="Enter Market Description"
    ></textarea>
</div>


            {/* Market Strategy (3 images + titles + descriptions) */}
            <div className="grid grid-cols-3 gap-4">
                {["1", "2", "3"].map((num) => (
                    <div key={num}>
                        <label className="font-semibold">Market Strategy Image {num}</label>
                        <input
                            type="file"
                            name={`marketStrategyImage${num}`}
                            accept="image/*"
                            onChange={changeFile}
                            className="border p-2 w-full rounded"
                        />

                        {preview[`marketStrategyImage${num}`] && (
                            <img
                                src={preview[`marketStrategyImage${num}`]}
                                className="w-full h-32 object-cover rounded mt-2"
                            />
                        )}

                        <input
                            type="text"
                            name={`marketStrategyTitle${num}`}
                            value={form[`marketStrategyTitle${num}`]}
                            onChange={changeText}
                            placeholder="Title"
                            className="w-full border p-2 rounded-lg mt-2"
                        />

                        <textarea
                            name={`marketStrategyDescription${num}`}
                            value={form[`marketStrategyDescription${num}`]}
                            onChange={changeText}
                            placeholder="Description"
                            className="w-full border p-2 rounded-lg mt-2"
                        ></textarea>
                    </div>
                ))}
            </div>

            {/* Partnership Section */}
            <div>
                <label className="font-semibold">Partnership Image</label>
                <input
                    type="file"
                    name="partnershipImage"
                    accept="image/*"
                    onChange={changeFile}
                    className="border p-2 w-full rounded"
                />

                {preview.partnershipImage && (
                    <img
                        src={preview.partnershipImage}
                        className="w-full h-40 object-cover rounded mt-2"
                    />
                )}
            </div>

            <div>
                <label className="font-semibold">Partnership Description</label>
                <textarea
                    name="partnershipDescription"
                    value={form.partnershipDescription}
                    onChange={changeText}
                    className="w-full border p-2 rounded"
                ></textarea>
            </div>

            {/* partnershipStrategy array */}
            <div>
                <h2 className="text-xl font-semibold">Partnership Strategy</h2>

                {form.partnershipStrategy.map((item, i) => (
                    <div key={i} className="border p-4 rounded-lg mb-3">
                        <input
                            type="text"
                            value={item.title}
                            placeholder="Title"
                            onChange={(e) =>
                                handleArrayChange(i, "title", e.target.value, "partnershipStrategy")
                            }
                            className="w-full border p-2 rounded mb-2"
                        />

                        <textarea
                            value={item.description}
                            placeholder="Description"
                            onChange={(e) =>
                                handleArrayChange(
                                    i,
                                    "description",
                                    e.target.value,
                                    "partnershipStrategy"
                                )
                            }
                            className="w-full border p-2 rounded"
                        ></textarea>

                        <button
                            onClick={() => removeArrayItem("partnershipStrategy", i)}
                            className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => addArrayItem("partnershipStrategy")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Add More
                </button>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg"
            >
                {loading ? "Saving..." : existingId ? "Update" : "Add"}
            </button>

            {msg && <p className="text-green-600 text-center">{msg}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
    );
}
