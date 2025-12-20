import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../../../Component/BackgroundAnimation";
import Footer from "../Footer/Footer";
import { Button } from "../../../Component/ui/button";
import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, setSubscribedTrue } from "../../../redux/slices/userSlice";
import { tutorAxios, userAxios } from "../../../../axiosConfig";
import Loading from "@/User/Components/Loading/Loading";

const TutorHome = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isApplication, setIsApplication] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const tutor = useSelector((state) => state.user.user);
  const subscribed = useSelector((state) => state.user.subscribed);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadTutorData = async () => {
      try {
        await fetchTutor();
        await tutorSubscribed();
        await tutorapplication()
      } catch (error) {
        console.error("Error initializing tutor data:", error);
      } finally {
        setLoading(false); // Move setLoading here
      }
    };
    loadTutorData();
  }, []);

  const fetchTutor = async () => {
    try {
      const response = await userAxios.get("tutor-home/");

      if (response.status === 200 && response.data.user) {
        dispatch(loginUser(response.data.user));
        return response.data.user;
      } else {
        console.warn("⚠️ Tutor API did not return a user:", response.data);
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching tutor:", error);
    }
  };

  const tutorSubscribed = async () => {
    try {
      const response = await tutorAxios.get("tutor-subscribed/");
      console.log(response.data);
      if (response.data.subscribed) {
        setIsSubscribed(true);
        dispatch(setSubscribedTrue());
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.log("Error while checking subscription:", error);
      setIsSubscribed(false);
    }
  };

  const tutorapplication = async () => {
    try {
      const response = await tutorAxios.get("tutor-application/");
      console.log(response.data);
      if (response.data.application) {
        setIsApplication(true);
      } else {
        setIsApplication(false);
      }
    } catch (error) {
      console.log("Error while checking subscription:", error);
      setIsApplication(false);
    }
  }

  const form = () => {
    navigate("/tutor/form");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // FIXED: Better loading state with proper check
  if (loading || !tutor) {
    <Loading />
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-codex-darkBg text-white relative">
        <AnimatedBackground />

        <main
          className="container mx-auto px-6 py-12 text-white "
          style={{ marginTop: "100px" }}
        >
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-8xl font-bold mb-4 relative z-10">
                Empower Your
                <div className="text-green-500 relative z-10">
                  Teaching Journey
                </div>
              </h1>

              <p className="text-lg md:text-lg max-w-2xl mx-auto mb-4 text-white relative z-10">
                Welcome to Tutor Portal—your space to grow! Start your career,
                build your platform, master our Creator Academy, and connect
                with creators in the Creator Center.
              </p>

              <div className=" w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">I'm ready to...</h2>
                {tutor.role !== "tutor" && subscribed === false && isApplication === false? (
                  // Case 1: Not a tutor but subscribed
                  <div className="grid gap-6">
                    <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                      <h3 className="text-2xl font-bold mb-6 text-green-500">
                        Start my career
                      </h3>
                      <Button
                        className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                        onClick={form}
                      >
                        Check eligibility
                      </Button>
                    </div>
                  </div>
                ) : tutor?.role === "tutor" && subscribed === false && isApplication === false ? (
                  // Case 2: Is a tutor but not subscribed (Show subscription card)
                  <div className="grid">
                    <div className="bg-black bg-opacity-50 border border-green-800 p-4 rounded-lg transform hover:scale-105 transition-all">
                      <h3 className="text-2xl font-bold mb-6 text-green-500">
                        Activate Your Tutor Access
                      </h3>
                      <p className="text-white mb-4">
                        To access your tutor dashboard and start teaching,
                        please subscribe to our tutor plan.
                      </p>
                      <Button
                        className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                        onClick={() => navigate("/tutor/subscription")}
                      >
                        Go to Subscription Page
                      </Button>
                    </div>
                  </div>
                ) : tutor?.role === "tutor" && isSubscribed === true && isApplication === false? (
                  // Case 3: Is a tutor and subscribed
                  <div className="grid">
                    <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                      <h3 className="text-2xl font-bold mb-6 text-green-500">
                        Tutor Dashboard
                      </h3>
                      <Button
                        className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                        onClick={() => navigate("/tutor/dashboard")}
                      >
                        Go to Tutor Panel
                      </Button>
                    </div>
                  </div>
                ) : <div className="grid">
                    <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                      <h3 className="text-2xl font-bold mb-6 text-green-500">
                        Application Pending
                      </h3>
                      <Button
                        className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                      >
                        Wait For The Admin Approval
                      </Button>
                    </div>
                  </div>}
              </div>
            </div>
            <motion.section
              className="container mx-auto px-4 py-16 relative z-10"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <motion.h2
                className="text-7xl font-bold text-white text-center mb-12"
                variants={fadeIn}
              >
                Why Teach with <span className="text-white">Code</span>
                <span className="text-green-500">X</span>
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Card 1 */}
                <motion.div className="text-center p-6" variants={fadeIn}>
                  <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-20 w-20 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Verified Tutor Badge
                  </h3>
                  <p className="text-gray-400">
                    Stand out with our verified badge and build trust with
                    learners.
                  </p>
                </motion.div>

                {/* Card 2 */}
                <motion.div className="text-center p-6" variants={fadeIn}>
                  <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-20 w-20 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 16v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Grow Your Audience
                  </h3>
                  <p className="text-gray-400">
                    Reach thousands of learners across domains and boost your
                    profile visibility.
                  </p>
                </motion.div>

                {/* Card 3 */}
                <motion.div className="text-center p-6" variants={fadeIn}>
                  <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-20 w-20 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m2 4H7m6-16v4m0 0v4m0-4h4m-4 0H7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Monetize Your Skills
                  </h3>
                  <p className="text-gray-400">
                    Turn your teaching into a revenue stream with our
                    subscription plans.
                  </p>
                </motion.div>

                {/* Card 4 */}
                <motion.div className="text-center p-6" variants={fadeIn}>
                  <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-20 w-20 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h4v4H3v-4zm0 0L9 21h6l6-11H3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Gamified Teaching
                  </h3>
                  <p className="text-gray-400">
                    Engage learners with points, levels, and certifications.
                  </p>
                </motion.div>

                {/* Card 5 */}
                <motion.div className="text-center p-6" variants={fadeIn}>
                  <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-20 w-20 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v1m0 14v1m7.778-10.222l-.707.707M5.929 18.071l-.707.707m12.02 0l-.707-.707M5.929 5.929l-.707-.707M21 12h-1M4 12H3m9-9a9 9 0 100 18 9 9 0 000-18z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    24/7 Technical Support
                  </h3>
                  <p className="text-gray-400">
                    Never get stuck—our support team is available round the
                    clock.
                  </p>
                </motion.div>

                {/* Card 6 */}
                <motion.div className="text-center p-6" variants={fadeIn}>
                  <div className="bg-codex-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-20 w-20 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 10h16M10 14h10M10 18h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-400">
                    Track student progress and course performance with real-time
                    insights.
                  </p>
                </motion.div>
              </div>
            </motion.section>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TutorHome;
