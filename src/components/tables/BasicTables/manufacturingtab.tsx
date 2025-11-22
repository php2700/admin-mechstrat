// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManufacturingPage() {
  const [form, setForm] = useState({
    description: "",
    // strategy 1
    strategyTitle1: "",
    strategyDescription1: "",
    // strategic section
    strategicDescription: "",
    strategicTitle1: "",
    strategicDescription1: "",
    strategicTitle2: "",
    strategicDescription2: "",
    strategicTitle3: "",
    strategicDescription3: "",
    // business section
    businessDescription: "",
    businessTitle1: "",
    businessDescription1: "",
    businessTitle2: "",
    businessDescription2: "",
    businessTitle3: "",
    businessDescription3: "",
  });

  const [files, setFiles] = useState({
    banner: null,
    image: null,
    strategyImage1: null,
    strategicImage: null,
    businessImage1: null,
    businessImage2: null,
    businessImage3: null,
  });

  const [preview, setPreview] = useState({
    banner: null,
    image: null,
    strategyImage1: null,
    strategicImage: null,
    businessImage1: null,
    businessImage2: null,
    businessImage3: null,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [existing, setExisting] = useState(null);

  const token = localStorage.getItem("mechstratToken");

  // Generic text change
  const changeText = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // File change
  const changeFile = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    setFiles((s) => ({ ...s, [name]: file }));
    if (file) setPreview((p) => ({ ...p, [name]: URL.createObjectURL(file) }));
  };

  const fullUrl = (p) => {
    if (!p) return null;
    return `${import.meta.env.VITE_APP_URL}${p}`;
  };

  const fetchData = async () => {
    try {
      if (!token) return;
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/manufacturing`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const d = res.data?.data;
      if (d) {
        setExisting(d);
        // map text fields
        setForm((s) => ({
          ...s,
          description: d.description || "",
          strategyTitle1: d.strategyTitle1 || "",
          strategyDescription1: d.strategyDescription1 || "",
          strategicDescription: d.strategicDescription || "",
          strategicTitle1: d.strategicTitle1 || "",
          strategicDescription1: d.strategicDescription1 || "",
          strategicTitle2: d.strategicTitle2 || "",
          strategicDescription2: d.strategicDescription2 || "",
          strategicTitle3: d.strategicTitle3 || "",
          strategicDescription3: d.strategicDescription3 || "",
          businessDescription: d.businessDescription || "",
          businessTitle1: d.businessTitle1 || "",
          businessDescription1: d.businessDescription1 || "",
          businessTitle2: d.businessTitle2 || "",
          businessDescription2: d.businessDescription2 || "",
          businessTitle3: d.businessTitle3 || "",
          businessDescription3: d.businessDescription3 || "",
        }));

        setPreview({
          banner: fullUrl(d.banner),
          image: fullUrl(d.image),
          strategyImage1: fullUrl(d.strategyImage1),
          strategicImage: fullUrl(d.strategicImage),
          businessImage1: fullUrl(d.businessImage1),
          businessImage2: fullUrl(d.businessImage2),
          businessImage3: fullUrl(d.businessImage3),
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch manufacturing data.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit (create/add) — user said only add & get
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    try {
      if (!token) {
        setError("Token missing. Please login.");
        setLoading(false);
        return;
      }

      const fd = new FormData();

      // Append files if present
      Object.keys(files).forEach((key) => {
        if (files[key]) fd.append(key, files[key]);
      });

      // Append text fields
      Object.keys(form).forEach((k) => {
        if (form[k] !== undefined && form[k] !== null) {
          fd.append(k, form[k]);
        }
      });

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/manufacturing`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMsg(res.data?.message || "Saved successfully!");
      // reset files (keep previews for new created if backend returns path we will re-fetch)
      setFiles({
        banner: null,
        image: null,
        strategyImage1: null,
        strategicImage: null,
        businessImage1: null,
        businessImage2: null,
        businessImage3: null,
      });
      // re-fetch to reflect saved data and server paths
      await fetchData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong while saving."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8  mx-auto bg-white shadow-lg rounded-xl space-y-8">

      <div>
        <label className="font-semibold">Banner (Full width)</label>
        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={changeFile}
          className="block w-full border p-2 rounded-lg"
        />
        {preview.banner && (
          <img
            src={preview.banner}
            alt="banner"
            className="w-full h-80 object-cover rounded-lg mt-3"
          />
        )}
      </div>

      {/* Top description & main image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={changeText}
            className="w-full border p-3 rounded-lg h-40"
            placeholder="Enter description..."
          />
        </div>

        <div>
          <label className="font-semibold">Main Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={changeFile}
            className="block w-full border p-2 rounded-lg"
          />
          {preview.image && (
            <img
              src={preview.image}
              alt="main"
              className="w-full h-40 object-cover rounded-lg mt-3"
            />
          )}
        </div>
      </div>

      {/* Strategy 1 */}
      <div>
        <h3 className="font-semibold text-lg">Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div>
            <label className="font-medium">Image</label>
            <input
              type="file"
              name="strategyImage1"
              accept="image/*"
              onChange={changeFile}
              className="block w-full border p-2 rounded-lg"
            />
            {preview.strategyImage1 && (
              <img
                src={preview.strategyImage1}
                alt="strategy1"
                className="w-full h-28 object-cover rounded-lg mt-2"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="font-medium">Title</label>
            <input
              type="text"
              name="strategyTitle1"
              value={form.strategyTitle1}
              onChange={changeText}
              className="w-full border p-2 rounded-lg"
            />

            <label className="font-medium mt-3 block">Description</label>
            <textarea
              name="strategyDescription1"
              value={form.strategyDescription1}
              onChange={changeText}
              className="w-full border p-2 rounded-lg h-28"
            />
          </div>
        </div>
      </div>

      {/* Strategic section */}
      <div>
        <h3 className="font-semibold text-lg">Strategic Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="md:col-span-2">
            <label className="font-medium">Strategic Description</label>
            <textarea
              name="strategicDescription"
              value={form.strategicDescription}
              onChange={changeText}
              className="w-full border p-2 rounded-lg h-32"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="font-medium">Strategic Title 1</label>
                <input
                  type="text"
                  name="strategicTitle1"
                  value={form.strategicTitle1}
                  onChange={changeText}
                  className="w-full border p-2 rounded-lg"
                />
                <label className="font-medium mt-2 block">Description 1</label>
                <textarea
                  name="strategicDescription1"
                  value={form.strategicDescription1}
                  onChange={changeText}
                  className="w-full border p-2 rounded-lg h-20"
                />
              </div>

              <div>
                <label className="font-medium">Strategic Title 2</label>
                <input
                  type="text"
                  name="strategicTitle2"
                  value={form.strategicTitle2}
                  onChange={changeText}
                  className="w-full border p-2 rounded-lg"
                />
                <label className="font-medium mt-2 block">Description 2</label>
                <textarea
                  name="strategicDescription2"
                  value={form.strategicDescription2}
                  onChange={changeText}
                  className="w-full border p-2 rounded-lg h-20"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="font-medium">Strategic Title 3</label>
              <input
                type="text"
                name="strategicTitle3"
                value={form.strategicTitle3}
                onChange={changeText}
                className="w-full border p-2 rounded-lg"
              />
              <label className="font-medium mt-2 block">Description 3</label>
              <textarea
                name="strategicDescription3"
                value={form.strategicDescription3}
                onChange={changeText}
                className="w-full border p-2 rounded-lg h-20"
              />
            </div>
          </div>

          <div>
            <label className="font-medium">Strategic Image</label>
            <input
              type="file"
              name="strategicImage"
              accept="image/*"
              onChange={changeFile}
              className="block w-full border p-2 rounded-lg"
            />
            {preview.strategicImage && (
              <img
                src={preview.strategicImage}
                alt="strategic"
                className="w-full h-56 object-cover rounded-lg mt-2"
              />
            )}
          </div>
        </div>
      </div>

      {/* Business section (3 items) */}
      <div>
        <h3 className="font-semibold text-lg">Business Growth</h3>
        <label className="font-medium mt-2 block">Business Description</label>
        <textarea
          name="businessDescription"
          value={form.businessDescription}
          onChange={changeText}
          className="w-full border p-2 rounded-lg h-28 mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <label className="font-medium">Business Image {i}</label>
              <input
                type="file"
                name={`businessImage${i}`}
                accept="image/*"
                onChange={changeFile}
                className="block w-full border p-2 rounded-lg"
              />
              {preview[`businessImage${i}`] && (
                <img
                  src={preview[`businessImage${i}`]}
                  alt={`business${i}`}
                  className="w-full h-28 object-cover rounded-lg mt-2"
                />
              )}

              <label className="font-medium">Title {i}</label>
              <input
                type="text"
                name={`businessTitle${i}`}
                value={form[`businessTitle${i}`]}
                onChange={changeText}
                className="w-full border p-2 rounded-lg"
              />

              <label className="font-medium mt-1 block">Description {i}</label>
              <textarea
                name={`businessDescription${i}`}
                value={form[`businessDescription${i}`]}
                onChange={changeText}
                className="w-full border p-2 rounded-lg h-24"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Saving..." : "Save Manufacturing"}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="w-full text-center p-3 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}
      {msg && !error && (
        <div className="w-full text-center p-3 rounded-lg bg-green-100 text-green-700">
          {msg}
        </div>
      )}
    </div>
  );
}
