// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Technology() {
  const [form, setForm] = useState({
    aboutChallenge:"",
    challengeTitle:"",
    challengeDescription:"",
    marketDescription: "",
    marketStrategy: [{ title: "", description: "" }],
    partnershipDescription: "",
    partnershipStrategy: [{ title: "", description: "" }],
    businessDescription: "",
    businessGrowthTitle1: "",
    businessGrowthDescription1: "",
    businessGrowthTitle2: "",
    businessGrowthDescription2: "",
    businessGrowthTitle3: "",
    businessGrowthDescription3: "",
  });

  const [files, setFiles] = useState({
    banner: null,
    businessGrowthImage1: null,
    businessGrowthImage2: null,
    businessGrowthImage3: null,
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

  // -------------------- HANDLE IMAGE CHANGE --------------------
  const changeFile = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    setFiles({ ...files, [name]: file });
    setPreview({ ...preview, [name]: URL.createObjectURL(file) });
  };

  // -------------------- CHANGE ARRAY FIELD (marketStrategy / partnershipStrategy) --------------------
  const handleArrayChange = (index, field, value, key) => {
    const list = [...form[key]];
    list[index][field] = value;
    setForm({ ...form, [key]: list });
  };

  const addArrayItem = (key) => {
    setForm({
      ...form,
      [key]: [...form[key], { title: "", description: "" }],
    });
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
        `${import.meta.env.VITE_APP_URL}api/admin/technology`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.data) {
        const d = res.data.data;
        setExistingId(d._id);

        setForm({
          challengeDescription: d.challengeDescription ,
          aboutChallenge:d.aboutChallenge,
          challengeTitle:d.challengeTitle,
          marketDescription: d.marketDescription,
          marketStrategy: d.marketStrategy,
          partnershipDescription: d.partnershipDescription,
          partnershipStrategy: d.partnershipStrategy,
          businessDescription: d.businessDescription,
          businessGrowthTitle1: d.businessGrowthTitle1,
          businessGrowthDescription1: d.businessGrowthDescription1,
          businessGrowthTitle2: d.businessGrowthTitle2,
          businessGrowthDescription2: d.businessGrowthDescription2,
          businessGrowthTitle3: d.businessGrowthTitle3,
          businessGrowthDescription3: d.businessGrowthDescription3,
        });

        setPreview({
          banner: `${import.meta.env.VITE_APP_URL}${d.banner}`,
          businessGrowthImage1: `${import.meta.env.VITE_APP_URL}${
            d.businessGrowthImage1
          }`,
          businessGrowthImage2: `${import.meta.env.VITE_APP_URL}${
            d.businessGrowthImage2
          }`,
          businessGrowthImage3: `${import.meta.env.VITE_APP_URL}${
            d.businessGrowthImage3
          }`,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------- HANDLE SUBMIT --------------------
  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");
    setError("");

    const fd = new FormData();

    Object.keys(files).forEach((key) => {
      if (files[key]) fd.append(key, files[key]);
    });

    fd.append("marketStrategy", JSON.stringify(form.marketStrategy));
    fd.append("partnershipStrategy", JSON.stringify(form.partnershipStrategy));

    Object.keys(form).forEach((key) => {
      if (
        ![
          "marketStrategy",
          "partnershipStrategy",
        ].includes(key)
      ) {
        fd.append(key, form[key]);
      }
    });

    try {
      const token = localStorage.getItem("mechstratToken");

      const url = `${import.meta.env.VITE_APP_URL}api/admin/technology`;
      const method = "post";
      await axios[method](url, fd, {
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

  // -------------------- UI BELOW --------------------
  return (
    <div className="p-8 mx-auto bg-white shadow-lg rounded-xl space-y-8">
      <div>
        <label className="font-semibold text-lg">Banner (Full Width)</label>
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
            className="w-full h-80 object-cover rounded-lg mt-3"
          />
        )}
      </div>

      {/* ---------------------------------------------------
                       MARKET STRATEGY (ARRAY)
            ---------------------------------------------------- */}
      <div>
        <h2 className="text-xl font-semibold">Market Strategy</h2>

        {form.marketStrategy.map((item, i) => (
          <div key={i} className="border p-4 rounded-lg mb-3">
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleArrayChange(i, "title", e.target.value, "marketStrategy")
              }
              className="w-full border p-2 rounded-lg mb-2"
            />
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(
                  i,
                  "description",
                  e.target.value,
                  "marketStrategy"
                )
              }
              className="w-full border p-2 rounded-lg"
            />
            <button
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeArrayItem("marketStrategy", i)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() => addArrayItem("marketStrategy")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add More
        </button>
      </div>

      {/* ---------------------------------------------------
                      PARTNERSHIP STRATEGY (ARRAY)
            ---------------------------------------------------- */}
      <div>
        <h2 className="text-xl font-semibold">Partnership Strategy</h2>

        {form.partnershipStrategy.map((item, i) => (
          <div key={i} className="border p-4 rounded-lg mb-3">
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleArrayChange(
                  i,
                  "title",
                  e.target.value,
                  "partnershipStrategy"
                )
              }
              className="w-full border p-2 rounded-lg mb-2"
            />
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(
                  i,
                  "description",
                  e.target.value,
                  "partnershipStrategy"
                )
              }
              className="w-full border p-2 rounded-lg"
            />
            <button
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeArrayItem("partnershipStrategy", i)}
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

      {/* ---------------------------------------------------
                       BUSINESS GROWTH IMAGES (SMALL)
            ---------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-4">
        {[
          "businessGrowthImage1",
          "businessGrowthImage2",
          "businessGrowthImage3",
        ].map((field) => (
          <div key={field}>
            <label className="font-semibold">{field}</label>
            <input
              type="file"
              name={field}
              accept="image/*"
              onChange={changeFile}
              className="block border p-2 rounded-lg w-full"
            />
            {preview[field] && (
              <img
                src={preview[field]}
                className="w-full h-32 object-cover rounded-lg border mt-2"
              />
            )}
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------
                      SMALL TEXT FIELDS
            ---------------------------------------------------- */}
      {[
        "aboutChallenge",
        "challengeTitle",
        "challengeDescription",
        "marketDescription",
        "partnershipDescription",
        "businessDescription",
        "businessGrowthTitle1",
        "businessGrowthDescription1",
        "businessGrowthTitle2",
        "businessGrowthDescription2",
        "businessGrowthTitle3",
        "businessGrowthDescription3",
      ].map((key) => (
        <div key={key}>
          <label className="font-semibold">{key}</label>
          <textarea
            name={key}
            value={form[key]}
            onChange={changeText}
            className="w-full border p-2 rounded-lg"
          />
        </div>
      ))}

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
