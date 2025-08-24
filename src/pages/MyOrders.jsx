
import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaSync } from "react-icons/fa";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const STATUS_COLOR = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
};

const pretty = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function MyOrders() {
  const { authReady, isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [q, setQ] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / limit)),
    [totalCount, limit]
  );

  const computeTotal = (o) => {
    if (typeof o.total === "number") return o.total;
    const items = Array.isArray(o.items) ? o.items : [];
    return items.reduce((sum, it) => {
      const unit =
        Number(
          it.priceAtPurchase ??
            it.price ??
            (it.plant && it.plant.price) ??
            0
        ) || 0;
      const qty = Number(it.quantity) || 0;
      return sum + unit * qty;
    }, 0);
  };

  const fetchMyOrders = async (_page = page, _limit = limit) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: String(_page),
        limit: String(_limit),
      });
      const { data } = await api.get(`/orders/me?${params.toString()}`);
      setOrders(data?.orders || []);
      setTotalCount(data?.total ?? data?.count ?? data?.orders?.length ?? 0);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load your orders";
      setError(msg);
      setOrders([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) {
      setError("Please login to view your orders");
      setLoading(false);
      return;
    }
    fetchMyOrders(1, limit);
  }, [authReady, isLoggedIn]); 

  const refresh = async () => {
    setRefreshing(true);
    await fetchMyOrders(page, limit);
    setRefreshing(false);
  };

  const onPageChange = (dir) => {
    const next = Math.min(Math.max(1, page + dir), totalPages);
    setPage(next);
    fetchMyOrders(next, limit);
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter(
      (o) =>
        (o._id || "").toLowerCase().includes(query) ||
        (o._id || "").slice(-8).toLowerCase().includes(query)
    );
  }, [orders, q]);

  if (!authReady) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-gray-500">
        Loading…
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-gray-500">
        Please login to view your orders.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <p className="text-sm text-gray-500">Track your purchases and status</p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 border hover:bg-gray-50"
          disabled={refreshing || loading}
          title="Refresh"
        >
          <FaSync className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      
      <div className="mt-6 bg-white border rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <input
                className="w-full border rounded-lg pl-9 pr-3 py-2"
                placeholder="Search by Order ID"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rows</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={limit}
              onChange={(e) => {
                const v = Number(e.target.value) || 10;
                setLimit(v);
                setPage(1);
                fetchMyOrders(1, v);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      
      <div className="mt-6 bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-left px-4 py-3">Payment</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Placed</th>
                <th className="text-right px-4 py-3">Total</th>
                
                <th className="text-right px-4 py-3">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                    Loading your orders…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-rose-600">
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                    {q ? "No orders match your search." : "You have no orders yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const total = computeTotal(o);
                  const created = o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : "—";
                  const itemsCount =
                    o.items?.reduce((n, it) => n + (it.quantity || 0), 0) || 0;
                  const status = (o.status || "pending").toLowerCase(); // tracking status
                  const paymentStatus = (o.paymentStatus || "pending").toLowerCase();

                  return (
                    <tr key={o._id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">{o._id?.slice(-8) || "—"}</div>
                        <div className="text-gray-500">{o._id || "—"}</div>
                      </td>
                      <td className="px-4 py-3">{itemsCount}</td>
                      <td className="px-4 py-3">{o.paymentMethod || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            STATUS_COLOR[status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pretty(status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{created}</td>
                      <td className="px-4 py-3 text-right font-semibold">₹{total}</td>

                      
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            STATUS_COLOR[paymentStatus] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pretty(paymentStatus)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {filtered.length} of {totalCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange(-1)}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} / {totalPages}
            </span>
            <button
              className="rounded-full border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange(1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
