import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/Products/Products";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import HRManagement from "../pages/Admin/ManageStaffAccounts/HRManagement";
import AuthRedirectHandler from "../components/Auth/AuthRedirectHandler";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthRedirectHandler />
      
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="products" element={<Products />} />

          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ADMIN WORKSPACE */}
        <Route 
          path="/admin" 
          element={
            <RoleProtectedRoute 
              requiredRoles={["ADMIN", "DIRECTOR", "STAFF"]} 
              requiredGroups={["HR", "WAREHOUSE", "CASHIER", "CS", "MARKETING"]}
            />
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="hr" element={<HRManagement />} />
            <Route path="users" element={<HRManagement />} />
            {/* Placeholder for other admin pages */}
            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
