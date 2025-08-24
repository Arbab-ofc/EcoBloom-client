import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { FaChevronLeft, FaCartPlus, FaCheckCircle, FaTimesCircle, FaTag } from "react-icons/fa";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [plant, setPlant] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const categories = useMemo(() => {
    if (!plant?.categories) return [];
    return plant.categories.map((c) =>
      typeof c === "string" ? c : (c?.keywords?.[0] || "Category")
    );
  }, [plant]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr("");
    api.get(`/plants/${id}`)
      .then(({ data }) => {
        if (ignore) return;
        setPlant(data?.plant || null);
        if (!data?.plant) setErr("Plant not found");
      })
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load plant"))
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, [id]);

  const onBuy = () => {
    if (!isLoggedIn) {
      toast.info("Please login to continue");
      navigate("/login");
      return;
    }
    if (!plant?.available) {
      toast.error("This plant is out of stock");
      return;
    }
    if (qty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    
    navigate("/orders", {
      state: {
        items: [
          {
            plant: plant._id,
            quantity: qty,
            priceAtPurchase: plant.price,
          },
        ],
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <ReactLoading type="spin" height={40} width={40} />
      </div>
    );
  }

  if (err || !plant) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700">
          <FaChevronLeft /> Back
        </button>
        <div className="mt-8 text-center text-red-600">{err || "Plant not found"}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700">
        <FaChevronLeft /> Back
      </button>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          {plant.image ? (
            <img src={plant.image} alt={plant.name} className="w-full h-full max-h-[520px] object-cover" />
          ) : (
            <div className="h-[360px] bg-emerald-50" />
          )}
        </div>

        
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{plant.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {plant.available ? (
              <span className="inline-flex items-center gap-2 text-emerald-700 text-sm"><FaCheckCircle /> In stock</span>
            ) : (
              <span className="inline-flex items-center gap-2 text-rose-600 text-sm"><FaTimesCircle /> Out of stock</span>
            )}
            <span className="text-gray-300">•</span>
            <span className="text-emerald-700 font-semibold text-xl">₹{plant.price ?? 0}</span>
          </div>

          {!!categories.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c, i) => (
                <Link key={`${c}-${i}`} to="/" state={{ filterCategory: c }}
                  className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full hover:bg-emerald-100">
                  <FaTag className="text-[10px]" /> {c}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Quantity</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button type="button" className="px-3 py-2 hover:bg-gray-50" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <input type="number" min={1} value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 text-center outline-none py-2" />
                <button type="button" className="px-3 py-2 hover:bg-gray-50" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>

            <button onClick={onBuy} disabled={!plant.available}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition">
              <FaCartPlus /> Buy Now
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500">Inclusive of taxes. Delivery charges calculated at checkout.</p>
        </div>
      </div>
    </div>
  );
}
