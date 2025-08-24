import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";


import Home from "./pages/Home";                       
import PlantDetail from "./pages/PlantDetail";         
import Login from "./pages/Login";                     
import Register from "./pages/Register";               
import Profile from "./pages/Profile";                 
import Order from "./pages/Orders";                   
import AddPlant from "./pages/Admin/AddPlant";         
import ManageOrders from "./pages/Admin/ManageOrders"; 
import VerifyOtp from "./pages/VerifyOtp";
import MyOrders from "./pages/MyOrders";
import About from "./pages/About";
import UpdatePlant from "./pages/Admin/UpdatePlant";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyAccount from "./pages/VerifyAccount";
import ContactUs from "./pages/ContactUs";

function PrivateRoute({ children }) {
  const { isLoggedIn, authReady } = useAuth();
  if (!authReady) return <div className="p-8 text-center">Loading...</div>; 
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isLoggedIn, user, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-gray-500">
        Checking access…
      </div>
    );
  }

  return isLoggedIn && user?.isAdmin ? children : <Navigate to="/" replace />;
}
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-1">
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/verify" element={<VerifyOtp />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/contact" element={<ContactUs />} />

            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/plants/:id/edit"
              element={
                <AdminRoute>
                  <UpdatePlant />
                </AdminRoute>
              }
            />

            
            <Route
              path ="/admin/add-plant"
              element={
                <AdminRoute>
                  <AddPlant />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <ManageOrders />
                </AdminRoute>
              }
            />

            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        
        <ToastContainer position="bottom-right" autoClose={1500} hideProgressBar />
      </div>
    </BrowserRouter>
  );
}
