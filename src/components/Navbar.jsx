import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlusCircle,
  FaClipboardList,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, setLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);

  
  const [text] = useTypewriter({
    words: [
      "EcoBloom 🌿",
      "“Grow green, live clean.”",
      "“Plants make people happy.”",
      "“Breathe better with greens.”",
    ],
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  
  useEffect(() => {
    if (isLoggedIn && !sessionStorage.getItem("reloadedAfterLogin")) {
      
      sessionStorage.setItem("reloadedAfterLogin", "1");
      
      setTimeout(() => {
        window.location.reload();
      }, 50);
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout", null, {
        params: { _t: Date.now() },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      
      setLoggedIn(false);
      setOpen(false);
      
      sessionStorage.removeItem("reloadedAfterLogin");
      toast.success("Logged out successfully 🌿");

      
      window.location.replace("/login");
    } catch {
      toast.error("Logout failed ❌");
    }
  };

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          
          <Link to="/" className="flex items-center">
            <div className="pl-0 text-lg sm:text-xl font-serif tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500">
              {text}
              <Cursor cursorStyle="|" />
            </div>
          </Link>

          
          <div className="hidden md:flex items-center gap-6 lg:gap-5 text-gray-700">
            
            <Link
              to="/about"
              className="md:inline-flex lg:hidden text-2xl hover:text-emerald-600"
              title="About"
            >
              <FaClipboardList />
            </Link>
            <Link
              to="/contact"
              className="md:inline-flex lg:hidden text-2xl hover:text-emerald-600"
              title="Contact"
            >
              <FaEnvelope />
            </Link>

            {!isLoggedIn ? (
              <>
                
                <Link
                  to="/login"
                  className="hidden lg:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50 transition"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  to="/register"
                  className="hidden lg:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  <FaUserPlus /> Register
                </Link>

                
                <Link
                  to="/login"
                  className="md:inline-flex lg:hidden text-2xl hover:text-emerald-600"
                  title="Login"
                >
                  <FaSignInAlt />
                </Link>
                <Link
                  to="/register"
                  className="md:inline-flex lg:hidden text-2xl text-emerald-600 hover:text-emerald-700"
                  title="Register"
                >
                  <FaUserPlus />
                </Link>
              </>
            ) : (
              <>
                
                {user?.isAdmin && (
                  <>
                    <Link
                      to="/admin/add-plant"
                      className="hidden lg:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50 transition"
                    >
                      <FaPlusCircle className="text-emerald-600" /> Add Plant
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="hidden lg:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50 transition"
                    >
                      <FaClipboardList className="text-emerald-600" /> Manage Orders
                    </Link>

                    
                    <Link
                      to="/admin/add-plant"
                      className="md:inline-flex lg:hidden text-2xl text-emerald-600 hover:text-emerald-700"
                      title="Add Plant"
                    >
                      <FaPlusCircle />
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="md:inline-flex lg:hidden text-2xl text-emerald-600 hover:text-emerald-700"
                      title="Manage Orders"
                    >
                      <FaClipboardList />
                    </Link>
                  </>
                )}

                
                <Link
                  to="/my-orders"
                  className="hidden lg:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50 transition"
                >
                  <FaClipboardList /> My Orders
                </Link>
                <Link
                  to="/profile"
                  className="hidden lg:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <FaUser /> {user?.name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden lg:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border hover:bg-gray-50 transition"
                >
                  <FaSignOutAlt /> Logout
                </button>

                
                <Link
                  to="/orders"
                  className="md:inline-flex lg:hidden text-2xl hover:text-emerald-600"
                  title="My Orders"
                >
                  <FaClipboardList />
                </Link>
                <Link
                  to="/profile"
                  className="md:inline-flex lg:hidden text-2xl text-emerald-600 hover:text-emerald-700"
                  title="Profile"
                >
                  <FaUser />
                </Link>
                <button
                  onClick={handleLogout}
                  className="md:inline-flex lg:hidden text-2xl hover:text-rose-600"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </>
            )}
          </div>

          
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 border hover:bg-gray-50"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        
        {open && (
          <div className="md:hidden pb-4 mt-2 space-y-2">
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-md hover:bg-gray-100"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Contact
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  <FaSignInAlt className="inline mr-2" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 rounded-md bg-emerald-600 text-white"
                >
                  <FaUserPlus className="inline mr-2" /> Register
                </Link>
              </>
            ) : (
              <>
                {user?.isAdmin && (
                  <>
                    <Link
                      to="/admin/add-plant"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                      <FaPlusCircle className="inline mr-2" /> Add Plant
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                      <FaClipboardList className="inline mr-2" /> Manage Orders
                    </Link>
                  </>
                )}
                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  <FaClipboardList className="inline mr-2" /> My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  <FaUser className="inline mr-2" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
