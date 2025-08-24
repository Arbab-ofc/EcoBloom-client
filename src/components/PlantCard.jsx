
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function PlantCard({ plant }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const isAdmin = !!user?.isAdmin;

  const [deleting, setDeleting] = useState(false);

  const cats = Array.isArray(plant?.categories) ? plant.categories : [];
  const labels = cats.map((c) =>
    typeof c === "string" ? c : (c?.keywords?.[0] || "Category")
  );

  const goToDetail = () => nav(`/plant/${plant._id}`);

  const handleEdit = (e) => {
    e.stopPropagation();
    nav(`/admin/plants/${plant._id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this plant? This cannot be undone.")) return;
    try {
      setDeleting(true);
      const { data } = await api.delete(`/plants/${plant._id}`);
      if (data?.success) {
        toast.success("Plant deleted");
        
        window.location.reload();
        
      } else {
        toast.error(data?.message || "Failed to delete");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer group"
      onClick={goToDetail}
      role="button"
    >
      {plant.image ? (
        <img
          src={plant.image}
          alt={plant.name}
          className="h-44 w-full object-cover"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
        />
      ) : (
        <div className="h-44 w-full bg-emerald-50" />
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{plant.name}</h3>
        <p className="text-emerald-600 font-bold mt-1">₹{plant.price}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {labels.slice(0, 3).map((k, i) => (
            <span
              key={`${k}-${i}`}
              className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full"
            >
              <FaTag className="text-[10px]" />
              {k}
            </span>
          ))}
        </div>

        <div className="mt-3 text-sm">
          {plant.available ? (
            <span className="text-emerald-700">In stock</span>
          ) : (
            <span className="text-rose-600">Out of stock</span>
          )}
        </div>

        
        {isAdmin && (
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50"
              title="Edit / Update"
            >
              <FaEdit className="text-emerald-600" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50 text-rose-600 disabled:opacity-50"
              title="Delete"
            >
              <FaTrash />
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
