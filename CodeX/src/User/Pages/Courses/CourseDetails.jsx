import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { userAxios } from "../../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { setTutorId } from "../../../redux/slices/userSlice";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { IoStar } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoMdStarOutline } from "react-icons/io";
import { Trash2 } from "lucide-react";

const CourseDetails = () => {
  const [openSection, setOpenSection] = useState(null);
  const [course, setCourse] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Review states
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const course_id = useSelector((state) => state.user.courseId);
  const user = useSelector((state) => state.user.user);
  const user_id = user.id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const fetchCourse = async () => {
    try {
      const response = await userAxios.get(`course_details/${course_id}/`);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await userAxios.get(`course/${course_id}/feedback/`);
      setAverageRating(response.data.average_rating || 0);
      setTotalFeedback(response.data.total_feedback || 0);
      setFeedbackList(response.data.feedback || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const checkUserEnrollment = async () => {
    try {
      const res = await userAxios.get("/check_enrollment/", {
        params: {
          user_email: user?.email,
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

  useEffect(() => {
    if (course_id) {
      fetchCourse();
      fetchFeedback();
    }

    if (user && user.email) {
      checkUserEnrollment();
    }
  }, [course_id, user]);

  const handleSubmitReview = async () => {
    if (userRating === 0 || reviewText.trim() === "") {
      toast.error("Please provide both rating and review");
      return;
    }

    setIsSubmitting(true);
    try {
      await userAxios.post("course/feedback/", {
        course: course_id,
        rating: userRating,
        review: reviewText,
      });

      setUserRating(0);
      setReviewText("");
      toast.success("Review submitted successfully!");
      fetchFeedback();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.response?.data?.error || "Failed to submit review. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await userAxios.delete(`course/${course_id}/feedback/`);
      toast.success("Review deleted successfully!");
      fetchFeedback();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (
    rating,
    size = "text-xl",
    interactive = false,
    onStarClick = null,
    onStarHover = null
  ) => {
    const displayRating = interactive ? hoverRating || userRating : rating;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = displayRating >= star;
          const halfFilled =
            displayRating >= star - 0.5 && displayRating < star;

          return (
            <div
              key={star}
              className={`relative ${interactive ? "cursor-pointer" : ""}`}
              onClick={() => interactive && onStarClick && onStarClick(star)}
              onMouseEnter={() =>
                interactive && onStarHover && onStarHover(star)
              }
              onMouseLeave={() => interactive && onStarHover && onStarHover(0)}
            >
              {halfFilled ? (
                <div className="relative">
                  <IoMdStarOutline className={`${size} text-green-400/30`} />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: "50%" }}
                  >
                    <IoStar
                      className={`${size} text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]`}
                    />
                  </div>
                </div>
              ) : filled ? (
                <IoStar
                  className={`${size} text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)] transition-all duration-200`}
                />
              ) : (
                <IoMdStarOutline
                  className={`${size} text-green-400/30 transition-all duration-200`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const toggleSection = useCallback((index) => {
    setOpenSection((prev) => (prev === index ? null : index));
  }, []);

  const TutorDetails = (tutorId) => {
    dispatch(setTutorId(tutorId));
    navigate("/tutor/details");
  };

  const handleClose = () => setShowModal(false);

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
                    course.profile_picture?.startsWith("http")
                      ? course.profile_picture
                      : "https://i.pinimg.com/736x/6d/ac/d4/6dacd4cf41a3637d021f0aba48de54fc.jpg"
                  }
                  alt="Course"
                  className="w-72 h-72 object-cover rounded-xl border-2 border-white"
                />
                <h2 className="mt-4 text-4xl font-bold text-green-500">
                  {course.first_name} {course.last_name}
                </h2>
                <button
                  className="bg-white hover:bg-black hover:text-green-500 text-black font-semibold p-2 rounded-lg mt-3 cursor-pointer"
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
                  <span className="text-green-500 font-medium flex items-center gap-2">
                    {renderStars(averageRating, "text-sm")}({totalFeedback}{" "}
                    ratings)
                  </span>
                  <span>
                    {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Learn & Purchase */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white text-black p-6 rounded-2xl shadow">
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  {course?.module_data?.map((module, index) => (
                    <li key={index}>{module.title}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900 text-white p-6 rounded-2xl shadow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-400">
                    By {course.first_name} {course.last_name}
                  </p>
                  <p className="text-2xl font-bold text-green-500 mt-2 mb-4">
                    $ {course.price}
                  </p>
                  {user ? (
                    isEnrolled ? (
                      <button
                        onClick={() => navigate("/user-dashboard")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mb-4 cursor-pointer"
                      >
                        Go to Dashboard
                      </button>
                    ) : (
                      <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg mb-4 disabled:opacity-50 cursor-pointer"
                        onClick={() => setShowModal(true)}
                        disabled={!course?.price}
                      >
                        BUY COURSE
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg mb-4"
                    >
                      Login to Buy Course
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

            {/* Course Content Accordion */}
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
                      {module?.lessons?.length || 0} Lessons
                    </span>
                  </button>

                  {openSection === index && (
                    <ul className="bg-white p-4 space-y-2 text-sm">
                      {module?.lessons?.map((lesson, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-black text-xl">•</span>
                            <span className="text-black font-medium">
                              {lesson?.title}
                            </span>
                          </div>
                          <span className="text-gray-600 text-sm">
                            {lesson?.created_at &&
                              new Date(lesson.created_at).toLocaleDateString()}
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

            {/* Reviews & Rating Section */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="mt-16"
            >
              <h2 className="text-5xl font-bold text-white mb-8 text-center">
                Reviews & Ratings
              </h2>

              {/* Average Rating Display */}
              <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-8 border border-green-500/20 shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"></div>

                <div className="flex items-center justify-center gap-8 flex-wrap relative z-10">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-green-400 mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    {renderStars(averageRating, "text-3xl")}
                    <p className="text-gray-400 mt-2 text-lg">
                      {totalFeedback} reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Review Form - Only if enrolled */}
              {isEnrolled && (
                <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-8 border border-green-500/20 shadow-xl mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-3xl"></div>

                  <h3 className="text-3xl font-bold mb-6 text-green-400 relative z-10">
                    Share Your Experience
                  </h3>

                  <div className="relative z-10">
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-3 text-lg font-semibold">
                        Your Rating
                      </label>
                      {renderStars(
                        userRating,
                        "text-4xl",
                        true,
                        setUserRating,
                        setHoverRating
                      )}
                      {userRating > 0 && (
                        <p className="text-green-400 mt-2 text-sm">
                          You rated: {userRating} star
                          {userRating > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-300 mb-3 text-lg font-semibold">
                        Your Review
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this course..."
                        className="w-full bg-gray-900/50 border border-green-500/30 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 min-h-[120px]"
                        rows="4"
                      />
                    </div>

                    <button
                      onClick={handleSubmitReview}
                      disabled={
                        isSubmitting ||
                        userRating === 0 ||
                        reviewText.trim() === ""
                      }
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <IoStar className="text-xl" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </div>

                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold mb-4 text-green-400">
                  Student Reviews
                </h3>

                {feedbackList.length > 0 ? (
                  feedbackList.map((feedback) => (
                    <motion.div
                      key={feedback.id}
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-xl relative overflow-hidden group hover:border-green-500/40 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-green-400">
                              {feedback.user_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(feedback.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {renderStars(feedback.rating, "text-lg")}

                            {/* ⭐ DELETE BUTTON (ADDED) */}
                            {feedback.user == user_id && (
                              <button
                                onClick={() => handleDeleteReview(feedback.id)}
                                className="text-green-500 hover:text-red-500 transition-colors duration-200"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed">
                          {feedback.review}
                        </p>
                      </div>

                      <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
           linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)`,
                            backgroundSize: "15px 15px",
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-green-500/20">
                    <IoMdStarOutline className="text-6xl mx-auto mb-4 opacity-30" />
                    <p className="text-lg">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
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
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>

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
                const orderID = data.orderID;

                try {
                  const successRes = await userAxios.post("paypal_success/", {
                    user_email: user?.email,
                    course_id: course.id,
                    orderID,
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
