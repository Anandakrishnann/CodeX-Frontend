import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { userAxios } from "../../../../axiosConfig";
import { IoStar } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoMdStarOutline } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { setCourseId, setTutorId } from "../../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

const TutorDetails = () => {
  const [tutor, setTutor] = useState(null);
  const [tutorId, setTutorId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tutor_id = useSelector((state) => state.user.tutorId);
  const user = useSelector((state) => state.user.user);
  const user_id = user.id

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await userAxios.get(`tutor_details/${tutor_id}/`);
      setTutor(response.data.tutor);
      setCourses(response.data.courses);
      setTutorId(response.data.tutor.id);
    } catch (error) {
      console.log(error || "Error While Fetching Course Details");
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await userAxios.get(`tutor/${tutorId}/feedback/`);
      setAverageRating(response.data.average_rating || 0);
      setTotalFeedback(response.data.total_feedback || 0);
      setFeedbackList(response.data.feedback || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    if (tutor_id) {
      fetchCourse();
    }
  }, [tutor_id]);

  useEffect(() => {
    if (tutorId) {
      fetchFeedback();
    }
  }, [tutorId]);

  const handleSubmitReview = async () => {
    if (userRating === 0 || reviewText.trim() === "") {
      alert("Please provide both rating and review");
      return;
    }

    setIsSubmitting(true);

    try {
      await userAxios.post("tutor/feedback/", {
        tutor: tutorId,
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

  const handleDeleteReview = async (feedbackId) => {
    try {
      await userAxios.delete(`tutor/${tutorId}/feedback/`);
      toast.success("Review deleted successfully!");
      fetchFeedback();
    } catch (error) {
      console.error("Error deleting review:", error);
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

  const handleCourseView = (courseId) => {
    dispatch(setCourseId(courseId));
    navigate("/courses/details");
  };

  return (
    <div className="min-h-screen bg-black text-white font-poppins">
      <Navbar />

      <div className="px-6 pt-24 pb-10 max-w-6xl mx-auto">
        {tutor ? (
          <>
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <img
                  src={
                    tutor.profile_picture ||
                    "https://i.pinimg.com/736x/6d/ac/d4/6dacd4cf41a3637d021f0aba48de54fc.jpg"
                  }
                  alt="tutor"
                  className="w-72 h-72 object-cover rounded-xl border-2 border-white"
                />
              </div>

              <div className="md:w-2/3 space-y-4 font-serif">
                <div className="flex">
                  <h1 className="text-5xl font-bold">
                    {tutor.full_name} ( {tutor.age} )
                  </h1>
                </div>
                <p className="text-gray-300 text-lg">{tutor.about}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="bg-white text-black px-2 py-1 rounded">
                    {tutor.expertise}
                  </span>
                  <span className="text-green-500 font-medium mt-1">
                    ({totalFeedback} Reviews)
                  </span>
                  <span>{tutor.created_at}</span>
                </div>
              </div>
            </div>

            {/* Learn & Purchase */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {/* What you'll learn */}
              <div className="md:col-span-2 bg-gradient-to-br from-black to-gray-900 text-white p-8 rounded-2xl shadow-xl border border-green-500/20 font-serif relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"></div>

                <h2 className="text-2xl flex items-center font-bold mb-6 text-green-500 relative">
                  More Info{" "}
                  <CiCircleInfo className="ml-2 text-3xl animate-pulse" />
                  <span className="absolute -bottom-2 left-0 w-16 h-1 bg-green-500 rounded-full"></span>
                </h2>

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Education:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.education}
                    </span>
                  </div>

                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Occupation:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.occupation}
                    </span>
                  </div>

                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Expertise:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.expertise}
                    </span>
                  </div>

                  <div className="flex items-center p-2 bg-black/50 rounded-xl border-l-4 border-green-500 hover:bg-black/70 transition-all duration-300">
                    <span className="text-gray-400 w-28 text-lg">
                      Experience:
                    </span>
                    <span className="text-white font-bold text-xl ml-2">
                      {tutor.experience} Years
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTU5LjkxIDU5LjkxVjBIMHY1OS45MWg1OS45MVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
              </div>

              {/* Purchase Box */}
              <div className="bg-gradient-to-br from-black to-gray-900 text-white p-8 rounded-2xl shadow-xl border border-green-500/20 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-transparent to-green-500"></div>

                <div className="relative z-10">
                  <div className="mb-6 pb-4 border-b border-gray-800">
                    <h3 className="text-xl font-semibold text-gray-400">
                      Contact Information
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="text-xl font-bold text-white">
                        Email:
                      </span>
                      <span className="text-xl font-bold text-green-500 ml-3 bg-black/30 px-3 py-1 rounded-lg">
                        {tutor.email}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-white">Rating:</p>
                      <div className="flex ml-3 bg-black/30 px-3 py-1 rounded-lg">
                        {renderStars(averageRating, "text-2xl")}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center">
                      <span className="bg-black/50 text-green-400 font-bold text-lg px-4 py-1.5 rounded-full border border-green-500/30">
                        {totalFeedback} Reviews
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTU5LjkxIDU5LjkxVjBIMHY1OS45MWg1OS45MVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-20"></div>
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

              {/* Add Review Form */}
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
                        You rated: {userRating} star{userRating > 1 ? "s" : ""}
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
                      placeholder="Share your thoughts about this tutor..."
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
                            backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)`,
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

            {/* My Courses Section */}
            <motion.h2
              className="text-7xl font-bold text-white text-center mt-16 mb-8 relative z-10"
              variants={fadeIn}
            >
              My Courses
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="relative flex flex-col h-[350px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-green-500/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-green-400/30 transition-all duration-500 group"
                >
                  <div className="absolute -top-12 -right-12 w-44 h-44 bg-green-400/10 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>

                  <div className="p-6 flex-grow z-10">
                    <span
                      className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-xl text-white backdrop-blur-md animate-pulse ${(() => {
                        const level = course.level?.trim().toLowerCase();
                        if (level === "beginner") return "bg-green-500/90";
                        if (level === "intermediate") return "bg-yellow-500/90";
                        if (level === "advanced") return "bg-red-500/90";
                        return "bg-gray-400/90 text-black";
                      })()}`}
                    >
                      {course.level}
                    </span>

                    <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="space-y-3 mb-4 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">
                          Category:
                        </span>
                        <span className="text-white bg-gray-800/50 px-2 py-0.5 rounded-md">
                          {course.category}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">
                          Instructor:
                        </span>
                        <span className="text-white">{course.created_by}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">
                          Price:
                        </span>
                        <span className="text-green-400 font-bold text-base">
                          $ {course.price}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">
                          Created:
                        </span>
                        <span className="text-gray-300">
                          {new Date(course.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto bg-gradient-to-t from-black via-transparent to-transparent z-10">
                    <button
                      onClick={() => handleCourseView(course.id)}
                      className="w-full bg-green-500/10 hover:bg-green-600 text-green-300 hover:text-white border border-green-400 rounded-xl font-semibold py-3 transition-all duration-300 hover:shadow-xl backdrop-blur-lg"
                    >
                      🚀 View Course
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTU5LjkxIDU5LjkxVjBIMHY1OS45MWg1OS45MVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-10 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 mt-20">
            Loading course content...
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TutorDetails;
