// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ContactBannerPage() {
      const [banner, setBanner] = useState(null);
      const [preview, setPreview] = useState("");
      const [existingId, setExistingId] = useState(null);
      const [loading, setLoading] = useState(false);
      const [msg, setMsg] = useState("");
      const [error, setError] = useState("");

      // Handle file selection
      const changeFile = (e) => {
            const file = e.target.files[0];
            setBanner(file);
            setPreview(URL.createObjectURL(file));
      };

      // Fetch existing banner
      const fetchData = async () => {
            try {
                  const token = localStorage.getItem("mechstratToken");
                  const res = await axios.get(
                        `${import.meta.env.VITE_APP_URL}api/admin/banner`,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );

                  if (res.data?.data) {
                        const d = res.data.data;
                        setExistingId(d._id);

                        if (d.banner) {
                              setPreview(
                                    `${import.meta.env.VITE_APP_URL}${d.banner}`
                              );
                        }
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      useEffect(() => {
            fetchData();
      }, []);

      // Save / Update banner
      const handleSubmit = async () => {
            setLoading(true);
            setMsg("");
            setError("");

            const fd = new FormData();

            if (banner) fd.append("banner", banner);

            try {
                  const token = localStorage.getItem("mechstratToken");

                  await axios.post(
                        `${import.meta.env.VITE_APP_URL}api/admin/banner`,
                        fd,
                        {
                              headers: {
                                    "Content-Type": "multipart/form-data",
                                    Authorization: `Bearer ${token}`,
                              },
                        }
                  );

                  setMsg("Saved Successfully!");
                  fetchData();
            } catch (err) {
                  setError("Something went wrong");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="p-8 mx-auto bg-white shadow-lg rounded-xl space-y-10">
                  {/* Banner Upload */}
                  <div>
                        <label className="font-semibold text-lg">
                              Contact Page Banner
                        </label>
                        <input
                              type="file"
                              name="banner"
                              accept="image/*"
                              onChange={changeFile}
                              className="w-full border p-2 rounded-lg"
                        />

                        {preview && (
                              <img
                                    src={preview}
                                    className="w-full h-100 object-cover mt-3 rounded-lg"
                              />
                        )}
                  </div>

                  {/* Submit Button */}
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
