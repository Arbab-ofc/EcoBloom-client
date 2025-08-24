import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function VerifyOtp() {
  const nav = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!emailFromState || !otp) {
      toast.error("Email and OTP are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/users/verify-otp", {
        email: emailFromState,
        otp,
      });
      if (data?.success) {
        toast.success("Account verified 🎉 Please login");
        nav("/login");
      } else {
        toast.error(data?.message || "Verification failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Verification failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500">
            Verify your account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter the OTP sent to <span className="font-medium">{emailFromState}</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={emailFromState}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your OTP"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Didn’t get OTP?{" "}
          <Link to="/resend" state={{ email: emailFromState }} className="text-emerald-700 font-medium hover:underline">
            Resend
          </Link>
        </p>
      </div>
    </div>
  );
}
