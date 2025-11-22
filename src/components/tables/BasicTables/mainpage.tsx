// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HomeAdminPage() {
      const [form, setForm] = useState({
            bannerTitle: "",
            bannerDescription: "",
            aboutDescription: [""],
            visionDescription: "",
            coreTitle: "",
            coreItems: [""],
            // mechstrat titles/descriptions
            mechstratTitle1: "",
            mechstratDescription1: "",
            mechstratTitle2: "",
            mechstratDescription2: "",
            mechstratTitle3: "",
            mechstratDescription3: "",
            mechstratTitle4: "",
            mechstratDescription4: "",
            mechstratTitle5: "",
            mechstratDescription5: "",
      });

      const [files, setFiles] = useState({
            banner: null,
            image: null,
            coreImage: null,
            mechstratImage1: null,
            mechstratImage2: null,
            mechstratImage3: null,
            mechstratImage4: null,
            mechstratImage5: null,
      });

      const [preview, setPreview] = useState({
            banner: null,
            image: null,
            coreImage: null,
            mechstratImage1: null,
            mechstratImage2: null,
            mechstratImage3: null,
            mechstratImage4: null,
            mechstratImage5: null,
      });

      const [existingId, setExistingId] = useState(null);
      const [loading, setLoading] = useState(false);
      const [msg, setMsg] = useState("");
      const [error, setError] = useState("");

      const token = localStorage.getItem("mechstratToken");

      const fullUrl = (p) => {
            if (!p) return null;
            return `${import.meta.env.VITE_APP_URL}${p}`;
      };

      const changeText = (e) => {
            const { name, value } = e.target;
            setForm((s) => ({ ...s, [name]: value }));
      };

      const setAboutAt = (index, value) => {
            const arr = [...form.aboutDescription];
            arr[index] = value;
            setForm((s) => ({ ...s, aboutDescription: arr }));
      };
      const addAbout = () =>
            setForm((s) => ({
                  ...s,
                  aboutDescription: [...s.aboutDescription, ""],
            }));
      const removeAbout = (index) => {
            const arr = [...form.aboutDescription];
            if (arr.length > 1) arr.splice(index, 1);
            setForm((s) => ({ ...s, aboutDescription: arr }));
      };

      const changeFile = (e) => {
            const name = e.target.name;
            const file = e.target.files[0];
            setFiles((s) => ({ ...s, [name]: file }));
            if (file)
                  setPreview((p) => ({
                        ...p,
                        [name]: URL.createObjectURL(file),
                  }));
      };

      const fetchData = async () => {
            try {
                  if (!token) return;
                  const res = await axios.get(
                        `${import.meta.env.VITE_APP_URL}api/admin/home`,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );
                  const d = res.data?.data;
                  if (!d) return;

                  setExistingId(d._id);

                  setForm((s) => ({
                        ...s,
                        bannerTitle: d.bannerTitle || "",
                        bannerDescription: d.bannerDescription || "",
                        aboutDescription: d.aboutDescription?.length
                              ? d.aboutDescription
                              : [""],
                        visionDescription: d.visionDescription || "",
                        coreTitle: d.coreTitle || "",
                        coreItems: d.coreItems || "",
                        mechstratTitle1: d.mechstratTitle1 || "",
                        mechstratDescription1: d.mechstratDescription1 || "",
                        mechstratTitle2: d.mechstratTitle2 || "",
                        mechstratDescription2: d.mechstratDescription2 || "",
                        mechstratTitle3: d.mechstratTitle3 || "",
                        mechstratDescription3: d.mechstratDescription3 || "",
                        mechstratTitle4: d.mechstratTitle4 || "",
                        mechstratDescription4: d.mechstratDescription4 || "",
                        mechstratTitle5: d.mechstratTitle5 || "",
                        mechstratDescription5: d.mechstratDescription5 || "",
                  }));

                  setPreview({
                        banner: fullUrl(d.banner),
                        image: fullUrl(d.image),
                        coreImage: fullUrl(d.coreImage),
                        mechstratImage1: fullUrl(d.mechstratImage1),
                        mechstratImage2: fullUrl(d.mechstratImage2),
                        mechstratImage3: fullUrl(d.mechstratImage3),
                        mechstratImage4: fullUrl(d.mechstratImage4),
                        mechstratImage5: fullUrl(d.mechstratImage5),
                  });
            } catch (err) {
                  console.error(err);
                  setError("Failed to fetch home data.");
            }
      };

      const setCoreItemAt = (index, value) => {
            const arr = [...form.coreItems];
            arr[index] = value;
            setForm((s) => ({ ...s, coreItems: arr }));
      };

      const addCoreItem = () => {
            setForm((s) => ({
                  ...s,
                  coreItems: [...s.coreItems, ""],
            }));
      };

      const removeCoreItem = (index) => {
            const arr = [...form.coreItems];
            if (arr.length > 1) arr.splice(index, 1);
            setForm((s) => ({ ...s, coreItems: arr }));
      };

      useEffect(() => {
            fetchData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // Submit: if existingId → PUT to update, otherwise POST create
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

                  // append files only if user selected a new file
                  Object.keys(files).forEach((k) => {
                        if (files[k]) fd.append(k, files[k]);
                  });

                  // append aboutDescription as JSON string
                  fd.append(
                        "aboutDescription",
                        JSON.stringify(form.aboutDescription)
                  );
                  fd.append("coreItems", JSON.stringify(form.coreItems));

                  // append all other text fields
                  const textKeys = [
                        "bannerTitle",
                        "bannerDescription",
                        "visionDescription",
                        "coreTitle",
                        "mechstratTitle1",
                        "mechstratDescription1",
                        "mechstratTitle2",
                        "mechstratDescription2",
                        "mechstratTitle3",
                        "mechstratDescription3",
                        "mechstratTitle4",
                        "mechstratDescription4",
                        "mechstratTitle5",
                        "mechstratDescription5",
                  ];
                  textKeys.forEach((k) => fd.append(k, form[k] ?? ""));

                  const headers = {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                  };

                  const res = await axios.post(
                        `${import.meta.env.VITE_APP_URL}api/admin/home`,
                        fd,
                        { headers }
                  );
                  setMsg(res.data?.message || "Created successfully");

                  await fetchData();
            } catch (err) {
                  console.error(err);
                  setError(err.response?.data?.message || "Save failed.");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="p-8 mx-auto bg-white rounded-xl shadow space-y-6">
                  {/* Banner image + title + description */}
                  <div>
                        <label className="font-semibold">
                              Banner Image (Full width)
                        </label>
                        <input
                              type="file"
                              name="banner"
                              accept="image/*"
                              onChange={changeFile}
                              className="block w-full border p-2 rounded"
                        />
                        {preview.banner && (
                              <img
                                    src={preview.banner}
                                    alt="banner"
                                    className="w-full h-80 object-cover rounded mt-2"
                              />
                        )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div>
                              <label className="font-semibold">
                                    Banner Title
                              </label>
                              <input
                                    name="bannerTitle"
                                    value={form.bannerTitle}
                                    onChange={changeText}
                                    className="w-full border p-2 rounded"
                                    placeholder="Banner title"
                              />
                        </div>
                        <div>
                              <label className="font-semibold mt-2">
                                    Banner Description
                              </label>
                              <textarea
                                    name="bannerDescription"
                                    value={form.bannerDescription}
                                    onChange={changeText}
                                    className="w-full border p-2 rounded h-20"
                                    placeholder="Banner description"
                              />
                        </div>
                  </div>

                  {/* About descriptions array */}
                  <div>
                        <h2 className="font-semibold text-lg mb-2">
                              About Description
                        </h2>
                        {form.aboutDescription.map((txt, i) => (
                              <div key={i} className="flex gap-2 mb-2">
                                    <textarea
                                          value={txt}
                                          onChange={(e) =>
                                                setAboutAt(i, e.target.value)
                                          }
                                          className="flex-1 border p-2 rounded"
                                          placeholder={`Paragraph ${i + 1}`}
                                    />
                                    <div className="flex flex-col gap-2">
                                          <button
                                                type="button"
                                                onClick={() => removeAbout(i)}
                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                          >
                                                Remove
                                          </button>
                                    </div>
                              </div>
                        ))}
                        <button
                              type="button"
                              onClick={addAbout}
                              className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                              + Add Paragraph
                        </button>
                  </div>

                  {/* Vision and core */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                              <label className="font-semibold">
                                    Vision Description
                              </label>
                              <textarea
                                    name="visionDescription"
                                    value={form.visionDescription}
                                    onChange={changeText}
                                    className="w-full border p-2 rounded h-24"
                              />
                              <label className="font-semibold mt-3">
                                    Core Title
                              </label>
                              <input
                                    name="coreTitle"
                                    value={form.coreTitle}
                                    onChange={changeText}
                                    className="w-full border p-2 rounded"
                              />
                              <label className="font-semibold mt-3">
                                    Core Items (comma separated)
                              </label>
                              {form.coreItems.map((txt, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                          <input
                                                value={txt}
                                                onChange={(e) =>
                                                      setCoreItemAt(
                                                            i,
                                                            e.target.value
                                                      )
                                                }
                                                className="flex-1 border p-2 rounded"
                                                placeholder={`Core Item ${
                                                      i + 1
                                                }`}
                                          />

                                          <button
                                                type="button"
                                                onClick={() =>
                                                      removeCoreItem(i)
                                                }
                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                          >
                                                X
                                          </button>
                                    </div>
                              ))}

                              <button
                                    type="button"
                                    onClick={addCoreItem}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                              >
                                    + Add Core Item
                              </button>
                        </div>

                        <div>
                              <label className="font-semibold">
                                    Core Image
                              </label>
                              <input
                                    type="file"
                                    name="coreImage"
                                    accept="image/*"
                                    onChange={changeFile}
                                    className="block w-full border p-2 rounded"
                              />
                              {preview.coreImage && (
                                    <img
                                          src={preview.coreImage}
                                          alt="core"
                                          className="w-full h-40 object-cover rounded mt-2"
                                    />
                              )}
                        </div>
                  </div>

                  <div>
                        <h2 className="font-semibold text-lg mb-3">
                              Mechstrat Cards
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                          key={i}
                                          className="border rounded-lg p-4"
                                    >
                                          <label className="font-medium">
                                                Image {i}
                                          </label>
                                          <input
                                                type="file"
                                                name={`mechstratImage${i}`}
                                                accept="image/*"
                                                onChange={changeFile}
                                                className="block w-full border p-2 rounded mb-2"
                                          />
                                          {preview[`mechstratImage${i}`] && (
                                                <img
                                                      src={
                                                            preview[
                                                                  `mechstratImage${i}`
                                                            ]
                                                      }
                                                      alt={`mechstrat${i}`}
                                                      className="w-full h-28 object-cover rounded mb-2"
                                                />
                                          )}

                                          <label className="font-medium">
                                                Title {i}
                                          </label>
                                          <input
                                                name={`mechstratTitle${i}`}
                                                value={
                                                      form[`mechstratTitle${i}`]
                                                }
                                                onChange={changeText}
                                                className="w-full border p-2 rounded mb-2"
                                          />

                                          <label className="font-medium">
                                                Description {i}
                                          </label>
                                          <textarea
                                                name={`mechstratDescription${i}`}
                                                value={
                                                      form[
                                                            `mechstratDescription${i}`
                                                      ]
                                                }
                                                onChange={changeText}
                                                className="w-full border p-2 rounded h-20"
                                          />
                                    </div>
                              ))}
                        </div>
                  </div>

                  <div>
                        <button
                              onClick={handleSubmit}
                              disabled={loading}
                              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50"
                        >
                              {loading
                                    ? "Saving..."
                                    : existingId
                                    ? "Update Home"
                                    : "Create Home"}
                        </button>
                  </div>

                  {/* messages */}
                  {error && (
                        <div className="text-red-700 bg-red-100 p-3 rounded">
                              {error}
                        </div>
                  )}
                  {msg && (
                        <div className="text-green-700 bg-green-100 p-3 rounded">
                              {msg}
                        </div>
                  )}
            </div>
      );
}
