
import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const isObjectId = (s = "") => /^[a-fA-F0-9]{24}$/.test(s.trim());

export default function PlantSearch({ className = "" }) {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const boxRef = useRef(null);

  const debouncedQ = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    if (!debouncedQ || isObjectId(debouncedQ)) {
      setList([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        
        const params = new URLSearchParams({ search: debouncedQ, limit: "8", page: "1" });
        const { data } = await api.get(`/plants?${params.toString()}`);
        if (!cancelled) {
          setList(Array.isArray(data?.plants) ? data.plants : []);
          setOpen(true);
        }
      } catch {
        if (!cancelled) {
          setList([]);
          setOpen(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [debouncedQ]);

  
  useEffect(() => {
    function onDoc(e) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const goToPlant = (id) => {
    setOpen(false);
    setQ("");
    nav(`/plant/${id}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      const v = debouncedQ;
      if (!v) return;
      if (isObjectId(v)) {
        goToPlant(v);
      } else if (list[0]?._id) {
        goToPlant(list[0]._id);
      }
    }
  };

  
  const gridCols = list.length <= 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`relative ${className}`} ref={boxRef}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search plants by name or ID…"
          className="w-full border rounded-lg pl-9 pr-3 py-2"
          onFocus={() => list.length && setOpen(true)}
        />
      </div>

      {open && (
        
        <div className="absolute left-1/2 -translate-x-1/2 z-30 mt-2 w-[min(90vw,40rem)] bg-white border rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="px-4 py-4 text-sm text-gray-500">Searching…</div>
          ) : list.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-500">No matches</div>
          ) : (
            <div className={`grid ${gridCols} gap-2 p-2 max-h-[24rem] overflow-auto`}>
              {list.map((p) => (
                <button
                  key={p._id}
                  onClick={() => goToPlant(p._id)}
                  className="text-left bg-white border rounded-xl hover:shadow-md transition shadow-sm overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-emerald-50 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">{p.name}</div>
                      <div className="text-xs text-gray-500 truncate">₹{p.price}</div>
                      <div className="text-[11px] text-gray-400 truncate">{p._id}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
