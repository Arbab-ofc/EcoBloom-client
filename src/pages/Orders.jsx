import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Order() {
  const nav = useNavigate();
  const { isLoggedIn } = useAuth();
  const { state } = useLocation();
  const items = state?.items || [];

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.info("Please login to continue");
      nav("/login");
    }
  }, [isLoggedIn, nav]);

  useEffect(() => {
    if (!items.length) {
      nav("/");
    }
  }, [items, nav]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !address.street?.trim() ||
      !address.city?.trim() ||
      !address.state?.trim() ||
      !address.pincode?.trim()
    ) {
      toast.error("Please fill all required address fields");
      return;
    }

    const payload = {
      items,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || "India",
      },
      paymentMethod,
    };

    setPlacing(true);
    try {
      const { data } = await api.post("/orders", payload);
      if (data?.success) {
        toast.success("Order placed successfully!");
        nav("/orders");
      } else {
        toast.error(data?.message || "Failed to place order");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const total = items.reduce(
    (sum, it) =>
      sum + (it.priceAtPurchase || 0) * (it.quantity || 1),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <form
          onSubmit={onSubmit}
          className="md:col-span-2 bg-white border rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Street</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={address.street}
              onChange={(e) =>
                setAddress((a) => ({ ...a, street: e.target.value }))
              }
              placeholder="House/Street"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={address.city}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, city: e.target.value }))
                }
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={address.state}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, state: e.target.value }))
                }
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pincode</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={address.pincode}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, pincode: e.target.value }))
                }
                placeholder="e.g. 110011"
                inputMode="numeric"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={address.country}
              onChange={(e) =>
                setAddress((a) => ({ ...a, country: e.target.value }))
              }
              placeholder="India"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["COD", "UPI", "Card", "NetBanking"].map((pm) => (
                <label
                  key={pm}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
                    paymentMethod === pm
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm}
                    checked={paymentMethod === pm}
                    onChange={() => setPaymentMethod(pm)}
                  />
                  <span className="font-medium">{pm}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </form>

        
        <div className="bg-white border rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((it, i) => (
              <div
                key={i}
                className="flex items-center justify-between"
              >
                <span>Plant: {it.plant}</span>
                <span>x{it.quantity}</span>
                <span>
                  ₹{(it.priceAtPurchase || 0) * (it.quantity || 1)}
                </span>
              </div>
            ))}
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <Link
            to="/"
            className="inline-block mt-4 text-emerald-700 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
