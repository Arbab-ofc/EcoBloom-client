import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaKey,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const STATUS_BADGE = {
  verified: "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700",
  unverified: "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700",
  admin: "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700",
};

const prettyDate = (d) => (d ? new Date(d).toLocaleString() : "—");

export default function Profile() {
  const { authReady, isLoggedIn, user, setLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);


  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");


  const [pwLoading, setPwLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const isAdmin = !!me?.isAdmin;
  const isVerified = !!me?.isVerified;

  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users/me");
        const u = data?.user || data;
        setMe(u);
        setName(u?.name || "");
        setNumber(u?.number || "");
      } catch (e) {
        toast.error(e?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        setOrdersLoading(true);
        const { data } = await api.get("/orders/me", { params: { limit: 3, page: 1 } });
        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (e) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, [authReady, isLoggedIn, navigate]);

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    setEditing(false);
    setName(me?.name || "");
    setNumber(me?.number || "");
  };

  const saveProfile = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (!/^\d{10}$/.test(String(number || "").trim())) {
      return toast.error("Enter valid 10-digit phone number");
    }
    try {
      const { data } = await api.put("/users/me", { name: name.trim(), number: String(number).trim() });
      if (data?.success) {
        toast.success("Profile updated");
        setMe((m) => ({ ...m, name: name.trim(), number: String(number).trim() }));
        setEditing(false);
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All password fields are required");
    }
    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New & confirm password must match");
    }
    try {
      setPwLoading(true);
      const { data } = await api.patch("/users/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (data?.success) {
        toast.success("Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data?.message || "Failed to update password");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
      setLoggedIn(false);
      toast.success("Logged out");
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  const OrdersList = useMemo(() => {
    if (ordersLoading) {
      return (
        <div className="text-gray-500 text-sm py-4">Loading recent orders…</div>
      );
    }
    if (!orders.length) {
      return (
        <div className="text-gray-500 text-sm py-4">You have no recent orders.</div>
      );
    }
    return (
      <ul className="divide-y">
        {orders.map((o) => {
          const itemsCount = o.items?.reduce((n, it) => n + (it.quantity || 0), 0) || 0;
          const total =
            typeof o.total === "number"
              ? o.total
              : (o.items || []).reduce(
                  (sum, it) => sum + (Number(it.priceAtPurchase ?? it.price ?? 0) || 0) * (Number(it.quantity) || 0),
                  0
                );
        const status = (o.status || "pending").toLowerCase();
          return (
            <li key={o._id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">#{o._id?.slice(-8)}</div>
                <div className="text-xs text-gray-500">
                  {itemsCount} item{o.itemsCount === 1 ? "" : "s"} • {o.paymentMethod || "—"} • {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">₹{total}</div>
                <div
                  className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                    status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : status === "confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : status === "shipped"
                      ? "bg-indigo-100 text-indigo-700"
                      : status === "delivered"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }, [orders, ordersLoading]);

  if (!authReady || loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-gray-500">
        Loading profile…
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-gray-500">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-500">Manage your account details and security</p>
        </div>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <span className={STATUS_BADGE.verified}>
              <FaCheckCircle /> Verified
            </span>
          ) : (
            <span className={STATUS_BADGE.unverified}>
              <FaTimesCircle /> Unverified
            </span>
          )}
          {isAdmin && (
            <span className={STATUS_BADGE.admin}>
              <FaShieldAlt /> Admin
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
            {!editing ? (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={saveProfile}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4">
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              {!editing ? (
                <div className="font-medium">{me?.name || "—"}</div>
              ) : (
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              )}
            </div>

            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <div className="font-medium">{me?.email || "—"}</div>
              <p className="text-xs text-gray-400">Email cannot be changed.</p>
            </div>

            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              {!editing ? (
                <div className="font-medium">{me?.number || "—"}</div>
              ) : (
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="10-digit phone"
                />
              )}
            </div>

            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Member Since</label>
              <div className="font-medium">{prettyDate(me?.createdAt)}</div>
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
              <FaKey className="text-emerald-600" />
            </div>

            <form className="mt-4 space-y-3" onSubmit={changePassword}>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {pwLoading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>

          
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <Link
                to="/my-orders"
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50"
              >
                <FaClipboardList /> View All
              </Link>
            </div>
            <div className="mt-3">{OrdersList}</div>
          </div>

          
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Session</h2>
            </div>
            <button
              onClick={logout}
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 border hover:bg-gray-50 text-rose-600"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
