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
import AdminCourseOverview from "./Admin/Dashboard/Courses/AdminCourseOverview/AdminCourseOverview";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// ✅ Import TooltipProvider properly
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Subscription from "./Tutor/Pages/Subscription/Subscription";
import Plans from "./Admin/Dashboard/Plans/Plans";
import Success from "./Tutor/Pages/Subscription/Success";
import Cancel from "./Tutor/Pages/Subscription/Cancel";
import SubscriptionProtectedRoutes from "./Tutor/Components/SubscriptionProtectedRoutes";
import Category from "./Admin/Dashboard/Category/Category";
import Course from "./Tutor/Pages/Dashboard/Course/Course/Course";
import TaskSection from "./User/Pages/Tasks/Tasks";
import CourseRequests from "./Admin/Dashboard/CourseRequests/CourseRequests";
import AdminCourses from "./Admin/Dashboard/Courses/AdminCourses";
import Modules from "./Tutor/Pages/Dashboard/Course/Module/Module";
import Lessons from "./Tutor/Pages/Dashboard/Course/Lesson/Lesson";
import AdminLesson from "./Admin/Dashboard/Courses/AdminLessons/AdminLesson";
import AdminLessonOverview from "./Admin/Dashboard/Courses/AdminLessons/AdminLessonOverview";
import LessonOverview from "./Tutor/Pages/Dashboard/Course/Lesson/LessonOverview";
import Courses from './User/Pages/Courses/Courses'
import CourseDetails from "./User/Pages/Courses/CourseDetails";
import TutorDetails from "./User/Pages/TutorDetails/TutorDetails";
import ForgotPassword from "./User/Pages/ForgotPassword/ForgorPassword";
import ResetPassword from "./User/Pages/ResetPassword/ResetPassword";
import UserCourses from "./User/Pages/Dashboard/UserCourses/UserCourses";
import CourseModules from "./User/Pages/Dashboard/UserCourses/CourseModules/CourseModules";
import CourseLessons from "./User/Pages/Dashboard/UserCourses/CourseLessons/CourseLessons";
import CourseLessonOverview from "./User/Pages/Dashboard/UserCourses/LessonOverview/CourseLessonOverview";
import OrderSuccess from "./User/Pages/OrderSuccess/OrderSuccess";
import Certificate from "./User/Pages/Dashboard/UserCourses/Certificate/Certificate";
import Chat from "./User/Pages/Dashboard/UserChat/UserChat";
import TutorChat from "./Tutor/Pages/Dashboard/TutorChat/TutorChat";
import TutorMeeting from "./Tutor/Pages/Dashboard/TutorMeeting/TutorMeeting";
import UserMeetings from "./User/Pages/Dashboard/UserMeetings/UserMeetings";
import MeetingRoom from "./Component/MeetingRoom/MeetingRoom";
import Review from "./User/Review";
import CourseAnalytics from "./Tutor/Pages/Dashboard/Course/Course/CourseAnalytics";
import AdminCourseAnalytics from "./Admin/Dashboard/Courses/AdminCourseAnalytics";
import Report from "./Admin/Dashboard/Reports/Report";


const queryClient = new QueryClient();  // ✅ Fix QueryClient initialization

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
                <Route path="/review" element={<Review />} />
                <Route path="/" element={<Home />} />
                <Route path="/loading" element={<Loading />} />
                <Route path="/tasks" element={<TaskSection />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/details" element={<CourseDetails />} />
                <Route path="/tutor/details" element={<TutorDetails />} />

                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/otp" element={<Otp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/user-dashboard" element={<UserDashboard />} />
                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="/user/courses" element={<UserCourses />} />
                  <Route path="/user/chat" element={<Chat />} />
                  <Route path="/user/meet" element={<UserMeetings />} />
                  <Route path="/room/:roomID/:userID/:userName" element={<MeetingRoom />} />
                  <Route path="/user/courses-modules" element={<CourseModules />} />
                  <Route path="/user/courses-lessons" element={<CourseLessons />} />
                  <Route path="/user/lesson-overview" element={<CourseLessonOverview />} />
                  <Route path="/user/course-certificate" element={<Certificate />} />
                  <Route path="/user/order-success" element={<OrderSuccess />} />
                  <Route path="/tutor" element={<TutorHome />} />
                  <Route path="/tutor/form" element={<Form />} />
                  <Route path="/tutor/order-complete" element={<OrderCompletion />} />
                  <Route path="/tutor/notifications" element={<Notifications />} />
                </Route>

                {/* Tutor Subscription Protected Routes */}
                <Route element={<SubscriptionProtectedRoutes/>}>
                  <Route path="/tutor/subscription" element={<Subscription />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/cancel" element={<Cancel />} />
                </Route>

                {/* Tutor Protected Routes */}
                <Route element={<TutorProtectedRoutes />}>
                  <Route path="/tutor/dashboard" element={<TutorDashboard />} />
                  <Route path="/tutor/profile" element={<TutorProfile />} />
                  <Route path="/tutor/course" element={<Course />} />
                  <Route path="/tutor/chat" element={<TutorChat />} />
                  <Route path="/tutor/meet" element={<TutorMeeting />} />
                  <Route path="tutor/course/analytics" element={<CourseAnalytics/> } />
                  <Route path="/tutor/course/modules" element={<Modules />} />
                  <Route path="/tutor/course/lessons" element={<Lessons />} />
                  <Route path="/tutor/lesson/overview" element={<LessonOverview />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<AdminProtected />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/tutors" element={<Tutors />} />
                  <Route path="/admin/courses" element={<AdminCourses />} />
                  <Route path="/admin/courses/analytics" element={<AdminCourseAnalytics />} />
                  <Route path="/admin/courses/Overview" element={<AdminCourseOverview />} />
                  <Route path="/admin/courses/lessons" element={<AdminLesson />} />
                  <Route path="/admin/courses/lessons/overview" element={<AdminLessonOverview />} />
                  <Route path="/admin/applications" element={<Applications />} />
                  <Route path="/admin/course-requests" element={<CourseRequests />} />
                  <Route path="/admin/reports" element={<Report />} />
                  <Route path="/admin/plans" element={<Plans />} /> 
                  <Route path="/admin/category" element={<Category />} />
                  <Route path="/admin/application-view/" element={<Overview />} />
                  <Route path="/admin/tutor-view/" element={<TutorView />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </GoogleOAuthProvider>
      </PayPalScriptProvider>
    </QueryClientProvider>
  );
}

export default App;
