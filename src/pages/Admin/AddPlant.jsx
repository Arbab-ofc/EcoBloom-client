
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORY_OPTIONS = [
  { value: "Indoor", label: "Indoor" },
  { value: "Outdoor", label: "Outdoor" },
  { value: "Air Purifying", label: "Air Purifying" },
  { value: "Home Decor", label: "Home Decor" },
  { value: "Succulent", label: "Succulent" },
  { value: "Flowering", label: "Flowering" },
  { value: "Medicinal", label: "Medicinal" },
  { value: "Decor", label: "Decor" },
  { value: "Edible", label: "Edible" },
  { value: "Shade", label: "Shade" },
];

export default function AddPlant() {
  const { user, isLoggedIn, authReady } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    categories: [],
    available: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);


  if (!authReady) {
    return <div className="p-8 text-center text-gray-500">Checking access…</div>;
  }
  if (!isLoggedIn || !user?.isAdmin) {
    return <div className="p-8 text-center text-red-600">You are not authorized to add plants.</div>;
  }

  const priceValid = useMemo(() => {
    const n = Number(form.price);
    return Number.isFinite(n) && n >= 0;
  }, [form.price]);

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCategoryChange = (selected) => {
    setForm((f) => ({ ...f, categories: (selected || []).map((o) => o.value) }));
  };

  const handleImage = (file) => {
    setImage(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview("");
    }
  };

  const onFileChange = (e) => handleImage(e.target.files?.[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Name is required");
    if (!priceValid) return toast.error("Enter a valid price (₹)");
    if (!form.categories.length) return toast.error("Select at least one category");
    if (!image) return toast.error("Please select an image");

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("price", String(form.price).trim());
    form.categories.forEach((c) => fd.append("categories[]", c)); 
    fd.append("available", form.available);
    fd.append("image", image);

    setSubmitting(true);
    try {
      const { data } = await api.post("/plants", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.success) {
        toast.success("Plant added successfully!");
        nav("/plants"); 
      } else {
        toast.error(data?.message || "Failed to add plant");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add plant");
    } finally {
      setSubmitting(false);
    }
  };

  
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: 8,
      borderColor: "#e5e7eb",
      boxShadow: "none",
      padding: 2,
      ":hover": { borderColor: "#d1d5db" },
    }),
    valueContainer: (base) => ({ ...base, padding: "2px 6px" }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#ecfdf5",
      color: "#047857",
    }),
    multiValueLabel: (base) => ({ ...base, color: "#065f46" }),
    multiValueRemove: (base) => ({ ...base, color: "#065f46", ":hover": { background: "#d1fae5", color: "#065f46" } }),
    menu: (base) => ({ ...base, zIndex: 30 }),
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Plant</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl shadow-sm p-6 space-y-5">
        
        <div>
          <label className="block text-sm font-medium mb-1">Plant Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleBasicChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. Money Plant"
          />
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleBasicChange}
            className={`w-full border rounded-lg px-3 py-2 ${priceValid || form.price === "" ? "" : "border-rose-400"}`}
            placeholder="e.g. 199"
            min="0"
            step="1"
          />
          {!priceValid && form.price !== "" && (
            <p className="mt-1 text-xs text-rose-600">Please enter a valid non-negative number.</p>
          )}
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Categories</label>
          <Select
            isMulti
            name="categories"
            options={CATEGORY_OPTIONS}
            value={CATEGORY_OPTIONS.filter((opt) => form.categories.includes(opt.value))}
            onChange={handleCategoryChange}
            styles={selectStyles}
            placeholder="Select categories…"
          />
          <p className="mt-1 text-xs text-gray-500">
            These map to Category.keywords on the server.
          </p>
        </div>

        
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleBasicChange}
            />
            <span>Available in stock</span>
          </label>
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-56 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {submitting ? "Adding..." : "Add Plant"}
        </button>
      </form>
    </div>
  );
}
