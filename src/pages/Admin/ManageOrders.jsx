
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaSync, FaTrashAlt, FaSearch } from "react-icons/fa";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";


const API_PATH = "orders/admin/orders";

const PAYMENT_STATUS = ["pending", "paid", "failed"];
const TRACKING_STATUS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const PAYMENT_METHODS = ["COD", "UPI", "Card", "NetBanking"];
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function ManageOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  
  const [q, setQ] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); 
  const [tracking, setTracking] = useState("");           
  const [paymentMethod, setPaymentMethod] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / limit)),
    [totalCount, limit]
  );

  const computeTotal = (o) => {
    if (typeof o.totalAmount === "number") return o.totalAmount;
    const items = Array.isArray(o.items) ? o.items : [];
    return items.reduce(
      (sum, it) =>
        sum +
        (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    );
  };

  const fetchOrders = async (opts = {}) => {
    const _page = opts.page ?? page;
    const _limit = opts.limit ?? limit;
    const params = new URLSearchParams({
      page: String(_page),
      limit: String(_limit),
    });
    const _q = (opts.q ?? q).trim();
    const _paymentStatus = (opts.paymentStatus ?? paymentStatus)?.toLowerCase();
    const _tracking = (opts.tracking ?? tracking)?.toLowerCase();
    const _paymentMethod = opts.paymentMethod ?? paymentMethod;

    if (_q) params.set("q", _q);
    if (_paymentStatus) params.set("paymentStatus", _paymentStatus);
    if (_tracking) params.set("status", _tracking); 
    if (_paymentMethod) params.set("paymentMethod", _paymentMethod);

    try {
      setLoading(true);
      setError("");
      const { data } = await api.get(`/${API_PATH}?${params.toString()}`);
      setOrders(data?.orders || []);
      setTotalCount(data?.total ?? data?.count ?? data?.orders?.length ?? 0);
    } catch (e) {
      setOrders([]);
      setTotalCount(0);
      setError(e?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders({ page: 1 });
   
  }, []);

  const applyFilters = () => {
    setPage(1);
    fetchOrders({
      page: 1,
      q,
      paymentStatus,
      tracking,
      paymentMethod,
      limit,
    });
  };

  const resetFilters = () => {
    setQ("");
    setPaymentStatus("");
    setTracking("");
    setPaymentMethod("");
    setPage(1);
    fetchOrders({
      page: 1,
      q: "",
      paymentStatus: "",
      tracking: "",
      paymentMethod: "",
    });
  };

  const onPageChange = (dir) => {
    const next = Math.min(Math.max(1, page + dir), totalPages);
    setPage(next);
    fetchOrders({ page: next });
  };

  
  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/${API_PATH}/${orderId}`, { paymentStatus: newStatus.toLowerCase() });
      toast.success("Payment status updated");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, paymentStatus: newStatus.toLowerCase() } : o
        )
      );
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update payment status");
    }
  };

  
  const updateTrackingStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/${API_PATH}/${orderId}/status`, { OrderStatus: newStatus.toLowerCase() });
      toast.success("Tracking status updated");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus.toLowerCase() } : o
        )
      );
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update tracking status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await api.delete(`/${API_PATH}/${orderId}`);
      toast.success("Order deleted");
      setRefreshing(true);
      await fetchOrders({ page });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete order");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
          <p className="text-sm text-gray-500">Admin: {user?.name || "—"}</p>
        </div>
        <button
          onClick={() => fetchOrders({ page })}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 border hover:bg-gray-50"
          disabled={refreshing || loading}
          title="Refresh"
        >
          <FaSync className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      
      <div className="mt-6 bg-white border rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <input
                className="w-full border rounded-lg pl-9 pr-3 py-2"
                placeholder="Order ID / Email / Name / Phone"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">All</option>
              {PAYMENT_STATUS.map((s) => (
                <option key={s} value={s}>{cap(s)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tracking Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
            >
              <option value="">All</option>
              {TRACKING_STATUS.map((s) => (
                <option key={s} value={s}>{cap(s)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">All</option>
              {PAYMENT_METHODS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={applyFilters}
            className="rounded-full bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="rounded-full border px-4 py-2 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      
      <div className="mt-6 bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-left px-4 py-3">Payment Method</th>
                <th className="text-left px-4 py-3">Payment Status</th>
                <th className="text-left px-4 py-3">Tracking Status</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                    Loading orders…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-rose-600">
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const total = computeTotal(o);
                  const itemsCount = o.items?.reduce((n, it) => n + (it.quantity || 0), 0) || 0;
                  const currentPayment = (o.paymentStatus || "pending").toLowerCase();
                  const currentTracking = (o.status || "pending").toLowerCase();

                  return (
                    <tr key={o._id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">{o._id?.slice(-8) || "—"}</div>
                        <div className="text-gray-500">{o._id || "—"}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium">{o.customerName || o.user?.name || "—"}</div>
                        <div className="text-gray-500 text-xs">
                          {o.user?.email || o.customerEmail || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-3">{itemsCount}</td>
                      <td className="px-4 py-3">{o.paymentMethod || "—"}</td>

                      
                      <td className="px-4 py-3">
                        <select
                          className="border rounded-lg px-2 py-1"
                          value={currentPayment}
                          onChange={(e) => updatePaymentStatus(o._id, e.target.value)}
                        >
                          {PAYMENT_STATUS.map((s) => (
                            <option key={s} value={s}>{cap(s)}</option>
                          ))}
                        </select>
                      </td>

                      
                      <td className="px-4 py-3">
                        <select
                          className="border rounded-lg px-2 py-1"
                          value={currentTracking}
                          onChange={(e) => updateTrackingStatus(o._id, e.target.value)}
                        >
                          {TRACKING_STATUS.map((s) => (
                            <option key={s} value={s}>{cap(s)}</option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3 text-right font-semibold">₹{total}</td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteOrder(o._id)}
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border hover:bg-gray-50 text-rose-600"
                          title="Delete order"
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="flex items-center gap-2 text-sm">
            <span>Rows:</span>
            <select
              className="border rounded px-2 py-1"
              value={limit}
              onChange={(e) => {
                const v = Number(e.target.value) || 10;
                setLimit(v);
                setPage(1);
                fetchOrders({ page: 1, limit: v });
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-gray-500">
              {orders.length} / {totalCount}
            </span>
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
