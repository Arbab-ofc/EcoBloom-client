
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import api from "../utils/api";
import PlantCard from "../components/PlantCard";
import PlantSearch from "../components/PlantSearch"; 

const CATEGORY_OPTIONS = [
  "Indoor",
  "Outdoor",
  "Succulent",
  "Air Purifying",
  "Home Decor",
  "Flowering",
  "Medicinal",
  "Decor",
  "Edible",
  "Shade",
];

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [total, setTotal] = useState(0);

  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  
  const featured = useMemo(
    () => ["Indoor", "Outdoor", "Succulent", "Flowering"],
    []
  );

  async function fetchPlants() {
    setLoading(true);
    setErr("");
    try {
      const params = { page, limit };
      if (category) params.category = category;
      if (available !== "") params.available = available;

      const { data } = await api.get("/plants", { params });
      setPlants(data?.plants || []);
      setTotal(data?.total || 0);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load plants");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  useEffect(() => {
    fetchPlants();
    
  }, [category, available, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  
  const FAQS = [
    {
      q: "Which plants are best for low light rooms?",
      a: "Snake Plant, ZZ Plant, Pothos, and Peace Lily do well in low to medium light. Check the 'Indoor' + 'Air Purifying' categories for easy picks.",
    },
    {
      q: "How long does delivery take?",
      a: "Orders are typically delivered within 2–5 business days depending on your city. You can track the status in My Orders (Pending → Confirmed → Shipped → Delivered).",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes. We support COD, UPI, Card, and NetBanking. Select your preferred method on the checkout page.",
    },
    {
      q: "What if my plant arrives damaged?",
      a: "No worries! Contact us within 24 hours with an unboxing photo/video. We’ll arrange a free replacement or refund as applicable.",
    },
    {
      q: "How do I care for a new plant after delivery?",
      a: "Unbox gently, place the plant in bright indirect light, water lightly, and let it acclimate for a few days before repotting.",
    },
    {
      q: "Are pots included with plants?",
      a: "Most plants come in nursery pots. Premium decorative pots are available separately; check the product description for details.",
    },
    {
      q: "Can I filter plants by category and availability?",
      a: "Yes. Use the filters on this page: choose a category (e.g., Indoor, Succulent) and toggle availability to see in-stock options.",
    },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="space-y-16">
      
      <section className="text-center py-16 sm:py-20 bg-gradient-to-r from-emerald-100 via-green-50 to-lime-100 border-b">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500">
          Bring Nature Home 🌿
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Curated indoor, outdoor & air-purifying plants for every space.
        </p>

        
        <div className="mt-6 max-w-xl w-full mx-auto px-4">
          <PlantSearch />
        </div>

        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {featured.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory((prev) => (prev === c ? "" : c));
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full border transition ${
                category === c
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/about"
            className="inline-flex items-center rounded-full px-5 py-2.5 border bg-white/70 backdrop-blur hover:bg-white transition"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>

      
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <select
              className="border rounded-lg px-3 py-2"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg px-3 py-2"
              value={available}
              onChange={(e) => {
                setAvailable(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Availability</option>
              <option value="true">In stock</option>
              <option value="false">Out of stock</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {total > 0 ? `${total} plants found` : "—"}
          </div>
        </div>

        
        {loading && (
          <div className="flex justify-center py-16">
            <ReactLoading type="spin" height={40} width={40} />
          </div>
        )}
        {err && !loading && (
          <div className="text-center text-red-600 py-10">{err}</div>
        )}

        
        {!loading && !err && (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {plants.map((p) => (
                <PlantCard key={p._id} plant={p} />
              ))}
            </div>

            {!plants.length && (
              <div className="text-center text-gray-500 py-12">
                No plants found.
              </div>
            )}

            
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-2 text-sm">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      
      <section className="bg-emerald-50 py-12">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl">🌱</p>
            <h3 className="font-semibold mt-2">Healthy Plants</h3>
            <p className="text-gray-600 text-sm mt-1">
              Fresh, well-nurtured, ready for your space.
            </p>
          </div>
          <div>
            <p className="text-3xl">🚚</p>
            <h3 className="font-semibold mt-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm mt-1">
              Carefully packed, delivered with care.
            </p>
          </div>
          <div>
            <p className="text-3xl">💚</p>
            <h3 className="font-semibold mt-2">Eco-Friendly</h3>
            <p className="text-gray-600 text-sm mt-1">
              Minimal plastic, recyclable materials.
            </p>
          </div>
        </div>
      </section>

      
      <section className="max-w-4xl mx-auto px-4 pb-16 -mt-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">FAQs</h2>
        <div className="mt-6 divide-y rounded-2xl border bg-white shadow-sm">
          {FAQS.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div key={idx} className="px-5">
                <button
                  className="w-full py-4 text-left flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(open ? null : idx)}
                  aria-expanded={open}
                >
                  <span className="font-medium text-gray-800">{item.q}</span>
                  <span
                    className={`transition-transform duration-300 ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▾
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h-40 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 text-sm pr-2">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
