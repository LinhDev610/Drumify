import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/Products/Products";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import HRWorkspace from "../pages/Admin/ManageStaffAccounts/HRWorkspace";
import CustomerManagement from "../pages/Admin/ManageCustomerAccounts/CustomerManagement";
import AuthRedirectHandler from "../components/Auth/AuthRedirectHandler";
import WarehouseWorkspace from "../pages/Admin/Warehouse/WarehouseWorkspace";
import CashierWorkspace from "../pages/Admin/Cashier/CashierWorkspace";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthRedirectHandler />
      
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:slug" element={<ProductDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
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
            <Route path="hr" element={<HRWorkspace />} />
            <Route path="hr/recruitment" element={<HRWorkspace />} />
            <Route path="hr/attendance" element={<HRWorkspace />} />
            <Route path="hr/contracts" element={<HRWorkspace />} />
            <Route path="hr/payroll" element={<HRWorkspace />} />
            <Route path="hr/reports" element={<HRWorkspace />} />
            <Route path="users" element={<CustomerManagement />} />
            <Route path="products" element={<WarehouseWorkspace />} />
            <Route path="categories" element={<WarehouseWorkspace />} />
            <Route path="inventory" element={<WarehouseWorkspace />} />
            <Route path="inventory/import" element={<WarehouseWorkspace />} />
            <Route path="inventory/export" element={<WarehouseWorkspace />} />
            <Route path="inventory/suppliers" element={<WarehouseWorkspace />} />
            <Route path="inventory/reports" element={<WarehouseWorkspace />} />
            <Route path="orders" element={<WarehouseWorkspace />} />
            <Route path="shipping" element={<WarehouseWorkspace />} />
            <Route path="pos" element={<CashierWorkspace />} />
            <Route path="finance/transactions" element={<CashierWorkspace />} />
            <Route path="products/lookup" element={<CashierWorkspace />} />
            <Route path="finance/reports/shift" element={<CashierWorkspace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
