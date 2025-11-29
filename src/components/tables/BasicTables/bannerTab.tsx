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

  // Custom Fields
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");

  // Handle file upload
  const changeFile = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  // Fetch Existing Data
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
          setPreview(`${import.meta.env.VITE_APP_URL}${d.banner}`);
        }

        setPhone(d.phone || "");
        setFax(d.fax || "");
        setEmail(d.email || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit Handler
  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");
    setError("");

    const fd = new FormData();
    if (banner) fd.append("banner", banner);

    fd.append("phone", phone);
    fd.append("fax", fax);
    fd.append("email", email);

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

      // Success Message
      setMsg("Saved Successfully!");

      // Remove message after 3 seconds
      setTimeout(() => setMsg(""), 3000);

      setLoading(false);

      // Only clear fields if new addition
      if (!existingId) {
        setPhone("");
        setFax("");
        setEmail("");
        setBanner(null);
        setPreview("");
      }

      fetchData(); // Updated data load hoga
      // 🔥 Trigger real-time update (same-tab works!)
window.dispatchEvent(new Event("contactUpdated"));
      // 🔥 Trigger user page auto-refresh
      localStorage.setItem("profileUpdateTrigger", Date.now());


    } catch (err) {
      setError("Something went wrong");
      setTimeout(() => setLoading(false), 1200);
    }
  };

  return (
    <div className="p-8 mx-auto bg-white shadow-lg rounded-xl space-y-10">

      <div>
        <label className="font-semibold text-lg">Contact Page Banner</label>

        <div className="space-y-4 mt-4">

          <div>
            <label className="font-semibold">Phone</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Fax</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg"
              value={fax}
              onChange={(e) => setFax(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={changeFile}
            className="w-full border p-2 rounded-lg"
          />

          {preview && (
            <img
              src={preview}
              className="w-full h-60 object-cover mt-3 rounded-lg"
            />
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg flex justify-center items-center gap-3"
      >
        {loading && (
          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {loading ? "Saving..." : existingId ? "Update" : "Add"}
      </button>

      <div style={{ minHeight: "28px" }}>
        {msg && <p className="text-green-600 text-center">{msg}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>

    </div>
  );
}
