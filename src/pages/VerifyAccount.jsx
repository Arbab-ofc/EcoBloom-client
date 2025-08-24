import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaKey, FaRedo } from "react-icons/fa";
import api from "../utils/api";

export default function VerifyAccount() {
  const [step, setStep] = useState(1);           
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [sending, setSending] = useState(false); 
  const [verifying, setVerifying] = useState(false);

  const [cooldown, setCooldown] = useState(0);   


  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);


  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const sendOtp = async () => {
    if (!email.trim() || !validEmail(email.trim())) {
      return toast.error("Please enter a valid email");
    }
    try {
      setSending(true);
      const { data } = await api.post("/users/resend-otp", { email: email.trim() });
      if (data?.success) {
        toast.success("OTP sent to your email");
        setStep(2);
        setCooldown(30); 
      } else {
        toast.error(data?.message || "Failed to send OTP");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const resendOtp = async () => {
    if (!email.trim() || !validEmail(email.trim())) {
      return toast.error("Please enter a valid email");
    }
    if (cooldown > 0) return; 
    try {
      setSending(true);
      const { data } = await api.post("/users/resend-otp", { email: email.trim() });
      if (data?.success) {
        toast.success("OTP resent");
        setCooldown(30);
      } else {
        toast.error(data?.message || "Failed to resend OTP");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!email.trim() || !validEmail(email.trim())) {
      return toast.error("Invalid email");
    }
    if (!otp.trim()) {
      return toast.error("Please enter the OTP");
    }
    try {
      setVerifying(true);
      const { data } = await api.post("/users/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });
      if (data?.success) {
        toast.success("Account verified! You can log in now.");
        setTimeout(() => (window.location.href = "/"), 700);
      } else {
        toast.error(data?.message || "OTP verification failed");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "OTP verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Verify Your Account</h1>
      <p className="mt-2 text-center text-gray-500">
        {step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP sent to your email."}
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
          <>
            <button
              onClick={sendOtp}
              disabled={sending}
              className="w-full rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {sending ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            
            <div>
              <label className="block text-sm font-medium mb-1">OTP</label>
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full border rounded-lg pl-9 pr-3 py-2 tracking-widest"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={resendOtp}
                disabled={sending || cooldown > 0}
                className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50"
                title="Resend OTP"
              >
                <FaRedo />
                {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Resending..." : "Resend OTP"}
              </button>
            </div>

            <button
              onClick={verifyOtp}
              disabled={verifying}
              className="w-full rounded-full bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </button>

            
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
              }}
              className="w-full rounded-full border px-6 py-3 hover:bg-gray-50 transition"
            >
              Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
