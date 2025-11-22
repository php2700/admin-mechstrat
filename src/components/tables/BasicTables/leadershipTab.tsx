// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeadershipPage() {

    const [form, setForm] = useState({
        description: "",
        title1: "",
        title2: "",
        functionDescription: "",
        functionTitle: "",
        subPoints1: [""],
        subPoints2: [""],
        functionSubPoints: [""],
    });

    const [files, setFiles] = useState({
        banner: null,
        image1: null,
        image2: null,
        functionImage: null,
    });

    const [preview, setPreview] = useState({});
    const [existingId, setExistingId] = useState(null);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    // -------------------- TEXT CHANGE --------------------
    const changeText = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // -------------------- FILE CHANGE --------------------
    const changeFile = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;

        setFiles({ ...files, [name]: file });

        setPreview({
            ...preview,
            [name]: URL.createObjectURL(file),
        });
    };

    // -------------------- ARRAY HANDLERS --------------------
    const updateArray = (key, index, value) => {
        const list = [...form[key]];
        list[index] = value;
        setForm({ ...form, [key]: list });
    };

    const addArrayItem = (key) => {
        setForm({ ...form, [key]: [...form[key], ""] });
    };

    const removeArrayItem = (key, index) => {
        const list = [...form[key]];
        if (list.length > 1) list.splice(index, 1);
        setForm({ ...form, [key]: list });
    };

    // -------------------- FETCH EXISTING --------------------
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("mechstratToken");
            const res = await axios.get(
                `${import.meta.env.VITE_APP_URL}api/admin/leadership`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.data?.data) return;

            const d = res.data.data;

            setExistingId(d._id);

            setForm({
                description: d.description,
                title1: d.title1,
                title2: d.title2,
                functionDescription: d.functionDescription,
                functionTitle: d.functionTitle,
                subPoints1: d.subPoints1,
                subPoints2: d.subPoints2,
                functionSubPoints: d.functionSubPoints,
            });

            setPreview({
                banner: `${import.meta.env.VITE_APP_URL}${d.banner}`,
                image1: `${import.meta.env.VITE_APP_URL}${d.image1}`,
                image2: `${import.meta.env.VITE_APP_URL}${d.image2}`,
                functionImage: `${import.meta.env.VITE_APP_URL}${d.functionImage}`,
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // -------------------- SUBMIT --------------------
    const handleSubmit = async () => {
        setMsg("");
        setError("");

        const fd = new FormData();

        // Files
        Object.keys(files).forEach((key) => {
            if (files[key]) fd.append(key, files[key]);
        });

        // Arrays
        fd.append("subPoints1", JSON.stringify(form.subPoints1));
        fd.append("subPoints2", JSON.stringify(form.subPoints2));
        fd.append("functionSubPoints", JSON.stringify(form.functionSubPoints));

        // Text fields
        Object.keys(form).forEach((key) => {
            if (!["subPoints1", "subPoints2", "functionSubPoints"].includes(key)) {
                fd.append(key, form[key]);
            }
        });

        try {
            const token = localStorage.getItem("mechstratToken");

            const url = `${import.meta.env.VITE_APP_URL}api/admin/leadership`;
            await axios.post(url, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMsg("Saved successfully!");
            fetchData();
        } catch (err) {
            console.log(err);
            setError("Something went wrong.");
        }
    };

    return (
        <div className="p-8  mx-auto bg-white shadow-lg rounded-xl space-y-10">

            {/* Banner */}
            <div>
                <label className="font-semibold text-lg">Banner</label>
                <input type="file" name="banner" onChange={changeFile} className="border p-2 w-full" />
                {preview.banner && <img src={preview.banner} className="w-full h-80 object-cover mt-3 rounded" />}
            </div>

            {/* Description */}
            <div>
                <label className="font-semibold text-lg">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={changeText}
                    className="w-full border p-3 rounded-lg mt-2"
                ></textarea>
            </div>

            {/* First Section */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="font-semibold">Image 1</label>
                    <input type="file" name="image1" onChange={changeFile} className="border p-2 w-full" />
                    {preview.image1 && <img src={preview.image1} className="w-full h-40 object-cover mt-2" />}
                </div>

                <div>
                    <label className="font-semibold">Title 1</label>
                    <input type="text" name="title1" value={form.title1} onChange={changeText} className="w-full border p-2" />
                </div>
            </div>

            {/* Sub Points 1 */}
            <div>
                <p className="font-semibold">Sub Points 1</p>
                {form.subPoints1.map((txt, i) => (
                    <div key={i} className="flex gap-2 my-2">
                        <input
                            value={txt}
                            onChange={(e) => updateArray("subPoints1", i, e.target.value)}
                            className="border p-2 flex-1"
                        />
                        <button onClick={() => removeArrayItem("subPoints1", i)} className="px-3 bg-red-500 text-white">
                            X
                        </button>
                    </div>
                ))}
                <button onClick={() => addArrayItem("subPoints1")} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Add Sub Point
                </button>
            </div>

            {/* Second Section */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="font-semibold">Image 2</label>
                    <input type="file" name="image2" onChange={changeFile} className="border p-2 w-full" />
                    {preview.image2 && <img src={preview.image2} className="w-full h-40 object-cover mt-2" />}
                </div>

                <div>
                    <label className="font-semibold">Title 2</label>
                    <input type="text" name="title2" value={form.title2} onChange={changeText} className="w-full border p-2" />
                </div>
            </div>

            {/* Sub Points 2 */}
            <div>
                <p className="font-semibold">Sub Points 2</p>
                {form.subPoints2.map((txt, i) => (
                    <div key={i} className="flex gap-2 my-2">
                        <input
                            value={txt}
                            onChange={(e) => updateArray("subPoints2", i, e.target.value)}
                            className="border p-2 flex-1"
                        />
                        <button onClick={() => removeArrayItem("subPoints2", i)} className="px-3 bg-red-500 text-white">
                            X
                        </button>
                    </div>
                ))}
                <button onClick={() => addArrayItem("subPoints2")} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Add Sub Point
                </button>
            </div>

            {/* Function Section */}
            <div>
                <label className="font-semibold text-lg">Function Image</label>
                <input type="file" name="functionImage" onChange={changeFile} className="border p-2 w-full" />
                {preview.functionImage && <img src={preview.functionImage} className="w-full h-40 object-cover mt-2" />}
            </div>

            <div>
                <label className="font-semibold">Function Title</label>
                <input type="text" name="functionTitle" value={form.functionTitle} onChange={changeText} className="w-full border p-2" />
            </div>

            <div>
                <label className="font-semibold">Function Description</label>
                <textarea
                    name="functionDescription"
                    value={form.functionDescription}
                    onChange={changeText}
                    className="w-full border p-3"
                ></textarea>
            </div>

            {/* Function Sub Points */}
            <div>
                <p className="font-semibold">Function Sub Points</p>
                {form.functionSubPoints.map((txt, i) => (
                    <div key={i} className="flex gap-2 my-2">
                        <input
                            value={txt}
                            onChange={(e) => updateArray("functionSubPoints", i, e.target.value)}
                            className="border p-2 flex-1"
                        />
                        <button onClick={() => removeArrayItem("functionSubPoints", i)} className="px-3 bg-red-500 text-white">
                            X
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => addArrayItem("functionSubPoints")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Add Function Sub Point
                </button>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg text-lg">
                {existingId ? "Update" : "Add"}
            </button>

            {msg && <p className="text-green-600 text-center">{msg}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
    );
}
