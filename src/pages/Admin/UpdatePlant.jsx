import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const STATIC_CATEGORY_OPTIONS = [
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

export default function UpdatePlant() {
  const { user, isLoggedIn, authReady } = useAuth();
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);

  
  const [categories, setCategories] = useState([]); 
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  
  const [backendOptions, setBackendOptions] = useState([]); 

  
  const allOptions = useMemo(() => {
    const map = new Map();
    [...backendOptions, ...STATIC_CATEGORY_OPTIONS].forEach((opt) => {
      const key = String(opt.value);
      if (!map.has(key)) map.set(key, opt);
    });
    return Array.from(map.values());
  }, [backendOptions]);

  
  const selectedOptions = useMemo(() => {
    const byValue = new Map(allOptions.map((o) => [String(o.value), o]));
    return categories
      .map((v) => byValue.get(String(v)) || { value: v, label: String(v) })
      .filter(Boolean);
  }, [categories, allOptions]);

    const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories"); 
      if (Array.isArray(data?.categories || data)) {
        const list = (data.categories || data).map((c) => ({
          value: c._id,
          label: Array.isArray(c.keywords) && c.keywords.length ? c.keywords[0] : "Category",
        }));
        setBackendOptions(list);
      }
    } catch {
      // silently fall back to static options
    }
  };

  
  const fetchPlant = async () => {
    const { data } = await api.get(`/plants/${id}`);
    const p = data?.plant || data;
    if (!p?._id) throw new Error("Plant not found");

    setName(p.name || "");
    setPrice(p.price ?? "");
    setAvailable(Boolean(p.available));
    setImagePreview(p.image || "");

    
    const catValues = [];
    if (Array.isArray(p.categories) && p.categories.length) {
      for (const c of p.categories) {
        if (typeof c === "string") {
          catValues.push(c); 
        } else if (c && typeof c === "object") {
          
          if (c._id) catValues.push(String(c._id));
          else if (Array.isArray(c.keywords) && c.keywords[0]) catValues.push(c.keywords[0]);
        }
      }
    } else if (Array.isArray(p.categoryNames)) {
      
      catValues.push(...p.categoryNames);
    }
    setCategories(Array.from(new Set(catValues)));
  };

  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn || !user?.isAdmin) {
      toast.error("Not authorized");
      nav("/");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCategories(), fetchPlant()]);
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message || "Failed to load plant");
        nav("/plants");
      } finally {
        setLoading(false);
      }
    })();
  }, [authReady, isLoggedIn, user, id, nav]);

  const onImageChange = (file) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (!price) return toast.error("Price is required");
    if (!categories.length) return toast.error("Select at least one category");

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("price", price);
    fd.append("available", String(available));

    
    fd.append("categories", JSON.stringify(categories));
    categories.forEach((c) => fd.append("categories[]", c));

    if (imageFile) fd.append("image", imageFile);

    try {
      setSaving(true);
      const { data } = await api.put(`/plants/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.success) {
        toast.success("Plant updated successfully");
        setTimeout(() => nav(`/plant/${id}`), 400);
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!authReady || loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Plant</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl shadow-sm p-6 space-y-5"
      >
        
        <div>
          <label className="block text-sm font-medium mb-1">Plant Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Money Plant"
          />
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 199"
          />
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Categories</label>
          <Select
            isMulti
            options={allOptions}
            value={selectedOptions}
            onChange={(sel) => setCategories((sel || []).map((o) => o.value))}
            classNamePrefix="select"
            placeholder="Select categories"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tip: Uses Category IDs when available; keywords fallback is supported.
          </p>
        </div>

        
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <span>Available in stock</span>
          </label>
        </div>

        
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="h-36 w-full object-cover rounded-lg border mb-2"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange(e.target.files?.[0] || null)}
            className="w-full border rounded-lg px-3 py-2"
          />
          {!imageFile && (
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep existing image.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
