import { useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaKey, FaEye, FaEyeSlash, FaRedo } from "react-icons/fa";
import api from "../utils/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);

  
  const sendOtp = async (e) => {
    e?.preventDefault?.();
    const em = email.trim();
    if (!validEmail(em)) return toast.error("Please enter a valid email");

    try {
      setSending(true);
      const { data } = await api.post("/users/forgot-password", { email: em });
      if (data?.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  
  const resendOtp = async () => {
    const em = email.trim();
    if (!validEmail(em)) return toast.error("Please enter a valid email");

    try {
      setSending(true);
      const { data } = await api.post("/users/forgot-password", { email: em });
      if (data?.success) {
        toast.success("OTP resent");
      } else {
        toast.error(data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setSending(false);
    }
  };

  
  const resetPassword = async (e) => {
    e?.preventDefault?.();
    const em = email.trim();
    if (!validEmail(em)) return toast.error("Invalid email");
    if (!otp.trim()) return toast.error("OTP is required");
    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New & confirm password must match");
    }

    try {
      setResetting(true);
      const { data } = await api.post("/users/reset-password", {
        email: em,
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });
      if (data?.success) {
        toast.success("Password reset successful. Please log in.");
        setTimeout(() => (window.location.href = "/login"), 700);
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Forgot Password</h1>
      <p className="mt-2 text-center text-gray-500">
        {step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP and set a new password."}
      </p>

      <div className="mt-6 bg-white border rounded-2xl shadow-sm p-6 space-y-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className="w-full border rounded-lg pl-9 pr-3 py-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step === 2}
            />
          </div>
        </div>

        {step === 1 ? (
          <button
            onClick={sendOtp}
            disabled={sending}
            className="w-full rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {sending ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            
            <div>
              <label className="block text-sm font-medium mb-1">OTP</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter OTP from email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={resendOtp}
                disabled={sending}
                className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50"
                title="Resend OTP"
              >
                <FaRedo />
                {sending ? "Resending..." : "Resend OTP"}
              </button>
            </div>

            
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className="w-full border rounded-lg pl-3 pr-10 py-2"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNew((s) => !s)}
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full border rounded-lg pl-3 pr-10 py-2"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirm((s) => !s)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              onClick={resetPassword}
              disabled={resetting}
              className="w-full rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {resetting ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
