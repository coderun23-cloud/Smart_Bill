import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import { useContext } from "react";
import { AppContext } from "./pages/context/AppContext";
import Admin from "./pages/admin/Admin";
import SuperAdmin from "./pages/superadmin/SuperAdmin";
import MeterReader from "./pages/meterreader/MeterReader";
import Customer from "./pages/customer/Customer";
import Profile from "./pages/Auth/Profile.jsx";
import Users from "./pages/superadmin/Users.jsx";
import Tariff from "./pages/superadmin/Tariff.jsx";
import Notification from "./pages/superadmin/Notification.jsx";
import Report from "./pages/superadmin/Report.jsx";
import Tracking from "./pages/superadmin/Tracking.jsx";
import Reading from "./pages/meterreader/Reading.jsx";
import Tracking_Meter_Reader from "./pages/meterreader/Tracking_Meter_Reader.jsx";
import Report_Meter_Reader from "./pages/meterreader/Report_Meter_Reader.jsx";
import Notification_Meter_Reader from "./pages/meterreader/Notifications_Meter_Reader.jsx";
import Customer_admin from "./pages/admin/Customers_admin.jsx";
import Report_admin from "./pages/admin/Report_admin.jsx";
import Notification_admin from "./pages/admin/Notification_admin.jsx";
import Bill from "./pages/admin/Bill.jsx";
import Bill_Details from "./pages/admin/Bill_Details.jsx";
import Bill_List from "./pages/customer/Bill_List.jsx";
import Complaint from "./pages/customer/Complaint.jsx";
import Usage from "./pages/customer/Usage.jsx";
import Notify from "./pages/customer/Notify.jsx";
import PaymentSuccess from "./pages/customer/PaymentSuccess.jsx";
import PaymentFailed from "./pages/customer/PaymentFailed.jsx";
import PaymentCallback from "./pages/customer/PaymentCallback.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
function App() {
  const { user } = useContext(AppContext);
  const isAdmin = user && user.role === "admin";
  const isSuperAdmin = user && user.role === "superadmin";
  const isReader = user && user.role === "meterreader";
  const isCustomer = user && user.role === "customer";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/index"
          element={
            isAdmin ? (
              <Admin />
            ) : isSuperAdmin ? (
              <SuperAdmin />
            ) : isReader ? (
              <MeterReader />
            ) : isCustomer ? (
              <Customer />
            ) : (
              <NotFound />
            )
          }
        />
        <Route
          path="/users"
          element={isSuperAdmin ? <Users /> : <NotFound />}
        />
        <Route
          path="/tariff"
          element={isSuperAdmin ? <Tariff /> : <NotFound />}
        />
        <Route
          path="/notifications"
          element={isSuperAdmin ? <Notification /> : <NotFound />}
        />
        <Route
          path="/report"
          element={isSuperAdmin ? <Report /> : <NotFound />}
        />
        <Route
          path="/tracking"
          element={isSuperAdmin ? <Tracking /> : <NotFound />}
        />
        <Route
          path="/reading"
          element={isReader ? <Reading /> : <NotFound />}
        />
        <Route
          path="/notifications_meterreader"
          element={isReader ? <Notification_Meter_Reader /> : <NotFound />}
        />{" "}
        <Route
          path="/report_meterreader"
          element={isReader ? <Report_Meter_Reader /> : <NotFound />}
        />{" "}
        <Route
          path="/tracking_meterreader"
          element={isReader ? <Tracking_Meter_Reader /> : <NotFound />}
        />
        <Route
          path="/customer_admin"
          element={isAdmin ? <Customer_admin /> : <NotFound />}
        />
        <Route path="/bill" element={isAdmin ? <Bill /> : <NotFound />} />
        <Route
          path="/report_admin"
          element={isAdmin ? <Report_admin /> : <NotFound />}
        />
        <Route
          path="/notification_admin"
          element={isAdmin ? <Notification_admin /> : <NotFound />}
        />
        <Route
          path="/bill_details/:id"
          element={isAdmin ? <Bill_Details /> : <NotFound />}
        />
        <Route
          path="/bill_list/:id"
          element={isCustomer ? <Bill_List /> : <NotFound />}
        />
        <Route
          path="complaint"
          element={isCustomer ? <Complaint /> : <NotFound />}
        />
        <Route path="usage" element={isCustomer ? <Usage /> : <NotFound />} />
        <Route path="notify" element={isCustomer ? <Notify /> : <NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
