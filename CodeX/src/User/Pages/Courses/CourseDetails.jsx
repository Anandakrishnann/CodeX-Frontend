import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { userAxios } from "../../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { setTutorId } from "../../../redux/slices/userSlice";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const [openSection, setOpenSection] = useState(null);
  const [course, setCourse] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const course_id = useSelector((state) => state.user.courseId);
  const user = useSelector((state) => state.user.user);
  const [showModal, setShowModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("course_id", course_id);
  console.log("user", user.email);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await userAxios.get(`course_details/${course_id}/`);
      setCourse(response.data);
    } catch (error) {
      console.log(error || "Error While Fetching Course Details");
    }
  };

  const checkUserEnrollment = async () => {
    try {
      const res = await userAxios.get("/check_enrollment/", {
        params: {
          user_email: user.email,
          course_id: course_id,
        },
      });

      if (res.data.enrolled) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error("Enrollment check failed:", error);
    }
  };

  const handlePaymentApprove = async (
    data,
    actions,
    course,
    user,
    navigate,
    handleClose
  ) => {
    try {
      const details = await actions.order.capture();
      console.log("Payment Successful:", details);

      // Verify payment
      const verifyRes = await userAxios.post("payment_verification/", {
        user_email: user.email,
        course_id: course.id,
      });

      if (verifyRes.status !== 200) {
        toast.error(verifyRes.data?.error || "Payment Verification Failed");
        return;
      }

      // Mark payment success and enroll
      const successRes = await userAxios.post("paypal_success/", {
        user_email: user.email,
        course_id: course.id,
        payment_details: details,
      });

      console.log("Backend Response:", successRes.data);
      toast.success(
        "Payment Successful 🎉 Go To Dashboard To See Course Details"
      );
      navigate("/user/order-success");
      handleClose();
    } catch (error) {
      const errMsg =
        error?.response?.data?.error || "Payment processing failed";
      console.error("Error sending to backend:", error);
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    fetchCourse();
    checkUserEnrollment();
  }, [course_id]);

  const toggleSection = useCallback((index) => {
    setOpenSection((prev) => (prev === index ? null : index));
  }, []);

  const TutorDetails = (tutorId) => {
    dispatch(setTutorId(tutorId));
    navigate("/tutor/details");
  };

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      <Navbar />

      <div className="px-6 pt-24 pb-10 max-w-6xl mx-auto">
        {course ? (
          <>
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <img
                  src={
                    course.profile_picture ||
                    "https://i.pinimg.com/736x/6d/ac/d4/6dacd4cf41a3637d021f0aba48de54fc.jpg"
                  }
                  alt="Course"
                  className="w-72 h-72 object-cover rounded-xl border-2 border-white"
                />
                <h2 className="mt-4 text-4xl font-bold text-green-500">
                  {course.first_name} {course.last_name}
                </h2>
                <button
                  className=" bg-white hover:bg-black hover:text-green-500 text-black font-semibold p-2 rounded-lg mt-3"
                  onClick={() => TutorDetails(course.tutor_id)}
                >
                  View Tutor Details
                </button>
              </div>

              <div className="md:w-2/3 space-y-4">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="text-gray-300 text-lg">{course.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="bg-white text-black px-2 py-1 rounded">
                    Category: {course.category}
                  </span>
                  <span className="text-green-500 font-medium">
                    (335,678 ratings)
                  </span>
                  <span>{course.created_at}</span>
                </div>
              </div>
            </div>

            {/* Learn & Purchase */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {/* What you'll learn */}
              <div className="md:col-span-2 bg-white text-black p-6 rounded-2xl shadow">
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  {course?.module_data?.map((module, index) => (
                    <li key={index}>{module.title}</li>
                  ))}
                </ul>
              </div>

              {/* Purchase Box */}
              <div className="bg-gray-900 text-white p-6 rounded-2xl shadow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-400">
                    By {course.first_name} {course.last_name}
                  </p>
                  <p className="text-2xl font-bold text-green-500 mt-2 mb-4">
                    ₹{course.price}
                  </p>
                  {isEnrolled ? (
                    <button
                      onClick={() => navigate("/user-dashboard")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mb-4"
                    >
                      Go to Dashboard
                    </button>
                  ) : (
                    <button
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg mb-4 disabled:opacity-50"
                      onClick={() => setShowModal(true)}
                      disabled={!course?.price}
                    >
                      BUY COURSE
                    </button>
                  )}
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {course?.benefits?.split(",").map((b, idx) => (
                      <li key={idx}>{b.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modules Accordion */}
            <div className="mt-12 bg-white text-black p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              {course?.module_data?.map((module, index) => (
                <div
                  key={index}
                  className="mb-4 border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
                  >
                    <span className="font-semibold text-lg flex items-center gap-2">
                      {openSection === index ? "▼" : "►"} {module.title}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {module.lessons.length} Lessons
                    </span>
                  </button>

                  {openSection === index && (
                    <ul className="bg-white p-4 space-y-2 text-sm">
                      {module.lessons.map((lesson, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-black text-xl">•</span>
                            <span className="text-black font-medium">
                              {lesson.title}
                            </span>
                          </div>
                          <span className="text-gray-600 text-sm">
                            {lesson.created_at}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Requirements & Description */}
            <div className="mt-12 bg-white text-black p-6 rounded-2xl shadow space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Requirements</h3>
                <p className="text-lg">{course.requirements}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Benefits</h3>
                <ul className="list-disc list-inside text-lg">
                  {course?.benefits?.split(",").map((b, idx) => (
                    <li key={idx}>{b.trim()}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Description</h3>
                <p className="text-lg text-gray-800">
                  {showFullDesc
                    ? course.description
                    : `${course.description?.slice(0, 250)}...`}
                </p>
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
                  >
                    {showFullDesc ? "Show Less" : "Show More"}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 mt-20">
            Loading course content...
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>

            {/* PayPal Buttons */}
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: course.price.toString(),
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                const orderID = data.orderID; // ✅ Correct order ID

                try {
                  const successRes = await userAxios.post("paypal_success/", {
                    user_email: user.email,
                    course_id: course.id,
                    orderID: orderID, // ✅ Correctly pass orderID
                  });
                  toast.success("Payment Successful 🎉 Go to Dashboard");
                  navigate("/user/order-success");
                  handleClose();
                } catch (error) {
                  toast.error("Payment Verification Failed");
                  console.error(error);
                }
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetails;
