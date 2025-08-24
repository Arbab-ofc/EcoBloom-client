import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../utils/api";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const { name, email, number, password } = form;
    if (!name || !email || !number || !password) {
      toast.error("All fields are required");
      return false;
    }
    const emailOk = /\S+@\S+\.\S+/.test(email);
    if (!emailOk) {
      toast.error("Enter a valid email");
      return false;
    }
    const phoneOk = /^[0-9]{10}$/.test(number);
    if (!phoneOk) {
      toast.error("Enter a valid 10-digit phone");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/users/register", form);
      if (data?.success) {
        toast.success("Registered! OTP sent to your email.");
        nav("/verify", { state: { email: form.email } });
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
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
            Create your EcoBloom account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Register, verify your account via OTP, then login.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Arbab Arshad"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              name="number"
              value={form.number}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="10-digit number"
              autoComplete="tel"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute inset-y-0 right-2 my-auto p-2 text-gray-500 hover:text-emerald-600"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Min 8 characters. Use a strong password.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        
        <div className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-3 flex-wrap">
          <span>Already registered?</span>
          <Link to="/login" className="text-emerald-700 font-medium hover:underline">
            Login
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/verify-account" className="text-emerald-700 font-medium hover:underline">
            Verify your account
          </Link>
        </div>
      </div>
    </div>
  );
}
