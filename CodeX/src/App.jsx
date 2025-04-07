import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";  // ✅ Import Toaster
import './index.css';
import Login from './User/Pages/Login/Login';
import Signup from './User/Pages/Signup/Signup';
import Otp from "./User/Pages/Otp/Otp";
import TutorHome from "./Tutor/Pages/Home/Home.jsx";
import Form from "./Tutor/Pages/Form/Form.jsx";
import ProtectedRoute from "./User/Components/ProtectedRoute.jsx";
import PublicRoute from "./User/Components/PublicRoute.jsx";
import Dashboard from "./Admin/Dashboard/Dashboard.jsx";
import AdminProtected from "./Admin/Components/AdminProtected.jsx";
import Users from "./Admin/Dashboard/Users/Users.jsx";
import Tutors from "./Admin/Dashboard/Tutors/Tutor.jsx";
import OrderCompletion from "./Tutor/Pages/OrderCompletion/OrderCompletion.jsx";
import Applications from "./Admin/Dashboard/Applications/Applications.jsx";
import Notifications from "./Tutor/Pages/Notifications/Notifications.jsx";
import Overview from "./Admin/Dashboard/Applications/Overview.jsx";
import TutorView from "./Admin/Dashboard/Tutors/TutorView.jsx";
import Loading from "./Admin/Components/Loading/Loading.jsx";
import UserDashboard from "./User/Pages/Dashboard/UserDashboard.jsx";
import UserProfile from "./User/Pages/Dashboard/UserProfile/UserProfile.jsx";
import TutorProtectedRoutes from "./Tutor/Components/TutorProtectedRoutes.jsx";
import TutorDashboard from "./Tutor/Pages/Dashboard/TutorDashboard.jsx";
import TutorProfile from "./Tutor/Pages/Dashboard/TutorProfile/TutorProfile.jsx";
import NotFound from "./User/Pages/NotFound.jsx";
import Home from "./User/Pages/Home/Home";
import { ToastContainer } from "react-toastify";

// ✅ Import TooltipProvider properly
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Subscription from "./Tutor/Pages/Subscription/Subscription";
import Plans from "./Admin/Dashboard/Plans/Plans";

const queryClient = new QueryClient();  // ✅ Fix QueryClient initialization

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />  {/* ✅ Fix Toaster usage */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loading" element={<Loading />} />

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/otp" element={<Otp />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/tutor" element={<TutorHome />} />
              <Route path="/tutor/form" element={<Form />} />
              <Route path="/tutor/order-complete" element={<OrderCompletion />} />
              <Route path="/tutor/notifications" element={<Notifications />} />
              <Route path="/tutor/subscription" element={<Subscription />} />
            </Route>

            {/* Tutor Protected Routes */}
            <Route element={<TutorProtectedRoutes />}>
              <Route path="/tutor-dashboard" element={<TutorDashboard />} />
              <Route path="/tutor-profile" element={<TutorProfile />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminProtected />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/tutors" element={<Tutors />} />
              <Route path="/admin/applications" element={<Applications />} />
              <Route path="/admin/plans" element={<Plans />} />
              <Route path="/admin/application-view/:userId" element={<Overview />} />
              <Route path="/admin/tutor-view/:userId" element={<TutorView />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
