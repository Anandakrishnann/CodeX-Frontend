import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
  User,
  Tag,
  Calendar,
  FileClock,
  FileText,
  Save,
  Pencil,
  Edit3,
  LineChart,
  FilePen,
  FileCheck,
} from "lucide-react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useDispatch, useSelector } from "react-redux";
import { adminAxios, tutorAxios } from "../../../../../../axiosConfig";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../Course/Course.css";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useNavigate } from "react-router-dom";
import { setCourseId } from "../../../../../redux/slices/userSlice";
import Loading from "@/User/Components/Loading/Loading";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [courseRejections, setCoursesRejections] = useState([])
  const [formData, setFormData] = useState({});
  const [module, setModule] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const tutor = useSelector((state) => state.user.user);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedLevel, setselectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [levels, setLevels] = useState([]);
  const [step, setStep] = useState(1);
  const [editStep, setEditStep] = useState(1);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filter, setFilter] = useState("accepted");
  const [isPending, setIsPending] = useState(0);
  const [isAccepted, setIsAccepted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(tutor.email);
  console.log(categories);
  console.log("courses ", courses);
  console.log("courses rejections", courseRejections);
  console.log("form data ", formData);
  console.log("selected data", selectedData);
  console.log("selected category", selectedCategory);
  console.log("selected level", selectedLevel);
  console.log("edit data", editFormData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminAxios.get("list-category/");
        setCategories(response.data);
      } catch (error) {
        toast.error("Error While Fetching Category");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await tutorAxios.get("get_levels/");
        console.log("get level");

        setLevels(res.data);
        console.log("levelss ", res.data);
      } catch (err) {
        console.error("Error fetching levels", err);
      }
    };

    fetchLevels();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchCourses(),
          fetchCoursesRejections()
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [formData, editFormData]);

  const fetchCourses = async () => {
    try {
      const response = await tutorAxios.get("list-course/");
      setCourses(response.data);
    } catch (error) {
      toast.error("Error While Fetching Data");
    }
  };

  const fetchCoursesRejections = async () => {
    try {
      const response = await tutorAxios.get("course-rejections/");
      setCoursesRejections(response.data);
    } catch (error) {
      toast.error("Error While Fetching Data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category_id") {
      setSelectedCategory(value);
    }
  };

  const handleModal = () => {
    setIsModalOpen(true);
  };

  const handleEditModal = (course_id) => {
    setSelectedData(course_id);
    const selectedCourse = courses.find((cour) => cour.id === course_id);
    setSelectedCategory(selectedCourse.category_id);
    if (selectedCourse) {
      setEditFormData({
        name: selectedCourse.name,
        title: selectedCourse.title,
        requirements: selectedCourse.requirements,
        benefits: selectedCourse.benefits,
        price: selectedCourse.price,
        description: selectedCourse.description,
        category_id: selectedCourse.category_id,
        level: selectedCourse.level,
      });
    } else {
      console.error("Course not found for editing");
    }
    setIsEditModal(true);
  };

  const editModalClose = () => {
    setSelectedCategory(null);
    setSelectedData(null);
    setIsEditModal(false);
    setEditFormData({});
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      toast.error("Name is required");
    }

    if (!formData.title.trim()) {
      errors.name = "Title is required";
      toast.error("Title is required");
    }

    if (!formData.requirements.trim()) {
      errors.description = "requirements is required";
      toast.error("requirements is required");
    }

    if (!formData.benefits.trim()) {
      errors.description = "benefits is required";
      toast.error("benefits is required");
    }

    if (!formData.price) {
      errors.price = "Price is required";
      toast.error("Price is required");
    } else if (isNaN(formData.price)) {
      errors.price = "Price must be a number";
      toast.error("Price must be a number");
    } else if (Number(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
      toast.error("Price must be greater than 0");
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      toast.error("Description is required");
    }

    return Object.keys(errors).length === 0;
  };

  const validateStep1 = (formData, selectedCategory) => {
    let isValid = true;

    if (!formData.name?.trim()) {
      toast.error("Course Name is required");
      isValid = false;
    }

    if (!formData.title?.trim()) {
      toast.error("Course Title is required");
      isValid = false;
    }

    if (!formData.requirements?.trim()) {
      toast.error("Requirements are required");
      isValid = false;
    }

    if (!formData.benefits?.trim()) {
      toast.error("Benefits are required");
      isValid = false;
    }

    if (!selectedCategory) {
      toast.error("Select a Category");
      isValid = false;
    }

    return isValid;
  };

  const validateStep2 = (formData, selectedLevel) => {
    let isValid = true;

    if (!selectedLevel) {
      toast.error("Select a Level");
      isValid = false;
    }

    if (!formData.price) {
      toast.error("Price is required");
      isValid = false;
    } else if (isNaN(formData.price)) {
      toast.error("Price must be a number");
      isValid = false;
    } else if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      isValid = false;
    }

    if (!formData.description?.trim()) {
      toast.error("Description is required");
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1(formData, selectedCategory)) return;
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    try {
      if (validateForm(formData)) {
        if (!selectedCategory) {
          toast.error("Select Category");
        } else {
          const data = {
            name: formData.name,
            title: formData.title,
            description: formData.description,
            requirements: formData.requirements,
            benefits: formData.benefits,
            price: parseFloat(formData.price).toFixed(2),
            category_id: selectedCategory,
            level: selectedLevel,
          };
          console.log("data  ", data);

          const response = await tutorAxios.post("create-course/", data);

          toast.success("Course Added Successfully");
          toast.success("Wait for the Admin Approval");
          setCourses((prevCourses) => [...prevCourses, response.data]);
          setFormData({});
          setSelectedCategory(null);
          setIsModalOpen(false);
          handleNavigation(response.data.id);
          setStep(1);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.errors?.name?.[0] ||
        "Error while Adding Course";

      toast.error(errorMessage);
      console.error("Error Adding Course:", error);
    }
  };

  const handleNavigation = (id) => {
    dispatch(setCourseId(id));
    navigate("/tutor/course/modules");
  };

  const handleEditSubmit = async () => {
    try {
      if (validateForm(editFormData)) {
        const data = {
          ...editFormData,
          category_id: Number(editFormData.category_id), // Ensure category_id is a number
          price: parseFloat(editFormData.price).toFixed(2), // Ensure price is formatted
        };
        console.log("Sending edit data:", data); // Debugging
        await tutorAxios.put(`edit-course/${selectedData}/`, data);
        toast.success("Course Updated Successfully");
        fetchCourses();
        setEditStep(1);
        editModalClose();
        setEditFormData({});
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.errors?.name?.[0] ||
        "Error while Editing Course";
      toast.error(errorMessage);
      console.error("Error Editing Course:", error);
    }
  };

  const handleCourseClick = (id) => {
    dispatch(setCourseId(id));
    navigate("/tutor/course/modules");
  };

  const handleCourseAnalytics = (id) => {
    dispatch(setCourseId(id));
    navigate("/tutor/course/analytics");
  };

  const setDraft = async (id) => {
    try {
      await tutorAxios.post(`set-draft/${id}/`);
      toast.success("Course set to Draft");
      fetchCourses();
    } catch (error) {
      toast.error(error || "Error While Set Draft");
    }
  };

  const toggle_status = async (e, course_id) => {
    e.preventDefault();
    try {
      await tutorAxios.post(`course-status/${course_id}/`);
      toast.success("Status Changed Successfully");
      fetchCourses();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Course not Found"
      );
    }
  };

  useEffect(() => {
    const pending = courses.filter((c) => c.status === "pending").length;
    const accepted = courses.filter((c) => c.status === "accepted").length;
    const rejected = courses.filter((c) => c.status === "rejected").length;

    const result = courses.filter((course) => {
      if (filter === "accepted") return course.status === "accepted";
      return course.status === filter;
    });
    setFilteredLessons(result);

    setIsPending(pending);
    setIsAccepted(accepted);
    setIsRejected(rejected);
  }, [courses, filter]);

  if (loading) {
    return (
      <Layout page="Courses">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout page="Courses">
      <div className="p-8 min-h-screen relative z-10  text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex mb-8">
            <div className="flex">
              <h2 className="text-5xl font-extrabold text-white">
                Course Dashboard
              </h2>

              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
            </div>
          </div>
          {/* Filter Buttons */}
          <div className="mb-10">
            <button
              className="text-2xl ml-6 mr-24 text-black bg-white p-1 rounded-md font-extrabold m-3 border border-white hover:text-white hover:bg-black hover:border-white hover:border-2"
              style={{ width: "180px" }}
              onClick={handleModal}
            >
              Create Course
            </button>

            <button
              className={`text-xl font-bold px-5 py-2 ml-20 mt-2 ${
                filter === "pending"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("pending")}
            >
              Pending{" "}
                <span className="bg-yellow-300 border border-black rounded-full px-2 py-1 ml-2">
                  {isPending}
                </span>
            </button>
            <button
              className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                filter === "accepted"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("accepted")}
            >
              Accepted{" "}
                <span className="bg-green-500 border border-black rounded-full px-2 py-1 ml-2">
                  {isAccepted}
                </span>
            </button>
            <button
              className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                filter === "rejected"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
              onClick={() => setFilter("rejected")}
            >
              Rejected{" "}
                <span className="bg-red-500 border border-black rounded-full px-2 py-1 ml-2">
                  {isRejected}
                </span>
            </button>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLessons &&
              filteredLessons.map((course, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  {/* Top Gradient Strip */}
                  <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                  <div className="p-6 flex flex-col justify-between h-full">
                    {/* Header Info */}
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                          {course.name}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm
                          ${
                            course.level === "beginer"
                              ? "bg-green-100 text-green-800"
                              : course.level === "intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                        >
                          {course.level}
                        </span>
                      </div>

                      {/* Title */}
                      <p className="text-gray-800 font-semibold mb-3 text-lg">
                        {course.title}
                      </p>

                      {/* Tutor, Category, Date */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-700">
                          <Tag size={16} className="mr-2 text-cyan-500" />
                          <span className="font-medium text-gray-900">
                            Category:
                          </span>
                          <span className="ml-2 text-gray-700">
                            {course.category}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2 text-cyan-500" />
                          <span className="text-xs font-medium">
                            {course.created_at}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-bold text-lg">
                        $ {course.price}
                      </span>

                      <div className="flex items-center space-x-2">
                        {course.status === "pending" ? (
                          <button
                            className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                            onClick={() => handleEditModal(course.id)}
                          >
                            Pending <PendingActionsIcon fontSize="small" />
                          </button>
                        ) : course.status === "rejected" ? (
                          <button
                            className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                            onClick={() => handleEditModal(course.id)}
                          >
                            Rejected <DeleteForeverIcon fontSize="small" />
                          </button>
                        ) : (
                          <>
                            <Tooltip title="View Analytics" arrow>
                              <button
                                onClick={() => handleCourseAnalytics(course.id)}
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                              >
                                <LineChart fontSize="small" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Details" arrow>
                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleCourseClick(course.id)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Edit" arrow>
                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleEditModal(course.id)}
                              >
                                <ModeEditIcon fontSize="small" />
                              </button>
                            </Tooltip>
                            {course.is_draft ? (
                              <Tooltip title="Published" arrow>
                                <button
                                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 hover:border hover:border-green-600 transition"
                                  onClick={() => setDraft(course.id)}
                                >
                                  <FileCheck fontSize="small" />
                                </button>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Set as Draft" arrow>
                                <button
                                  className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-white hover:text-yellow-600 hover:border hover:border-yellow-600 transition"
                                  onClick={() => setDraft(course.id)}
                                >
                                  <FilePen fontSize="small" />
                                </button>
                              </Tooltip>
                            )}

                            {course.is_active ? (
                              <Tooltip title="Delete" arrow>
                                <button
                                  className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                  onClick={(e) => toggle_status(e, course.id)}
                                >
                                  <DeleteForeverIcon fontSize="small" />
                                </button>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Restore" arrow>
                                <button
                                  className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                  onClick={(e) => toggle_status(e, course.id)}
                                >
                                  <RestoreFromTrashIcon fontSize="small" />
                                </button>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {isModalOpen && (
          <>
            <div className="fixed inset-0 font-sans backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-full overflow-y-auto border border-gray-200 dark:border-gray-700 animate-slideUp">
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Header with gradient */}
                <div className="mb-6 pb-4 border-b border-green-200 dark:border-green-700">
                  <div className="bg-gradient-to-r from-green-600 to-green-400 text-transparent bg-clip-text">
                    <h2 className="text-3xl font-extrabold mb-1">
                      Create Course
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ">
                    Fill in the details to create a new course
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className={`text-sm font-medium ${
                        step === 1
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500"
                      }`}
                      onClick={() => setStep(1)}
                    >
                      Basic Info
                    </button>
                    <button
                      type="button"
                      className={`text-sm font-medium ${
                        step === 2
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500"
                      }`}
                      onClick={() => setStep(2)}
                    >
                      Additional Info
                    </button>
                  </div>

                  {/* Section 1: Basic Info */}
                  {step === 1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className=" font-medium text-gray-700 dark:text-gray-300">
                            Course Name
                          </label>
                          <input
                            name="name"
                            type="text"
                            value={formData.name || ""}
                            placeholder="e.g. Web Development Masterclass"
                            className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Course Title
                          </label>
                          <input
                            name="title"
                            type="text"
                            value={formData.title || ""}
                            placeholder="e.g. Become a Full-Stack Developer"
                            className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Requirements
                          </label>
                          <input
                            name="requirements"
                            type="text"
                            value={formData.requirements || ""}
                            placeholder="e.g. Basic HTML, CSS knowledge"
                            className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Benefits
                          </label>
                          <input
                            name="benefits"
                            type="text"
                            value={formData.benefits || ""}
                            placeholder="e.g. Job-ready skills, Portfolio projects"
                            className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </label>
                        <div className="relative">
                          <select
                            name="category"
                            value={selectedCategory || ""}
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                            className="w-full p-3 pr-10 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                          >
                            <option value="" disabled>
                              Select a category
                            </option>
                            {categories &&
                              categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500 dark:text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Optional: Display selected category as a pill/tag for visual consistency */}
                        {selectedCategory && categories && (
                          <div className="mt-2">
                            <span className="inline-block rounded-full px-4 py-2 bg-green-600 text-white border-2 border-green-600">
                              {
                                categories.find(
                                  (cat) => cat.id === selectedCategory
                                )?.name
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Section 2: Additional Info */}
                  {step === 2 && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Level
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {levels.map((lev) => (
                            <label
                              key={lev.id}
                              className={`rounded-full px-4 py-2 cursor-pointer border-2 transition-all duration-200 ${
                                selectedLevel === lev.id
                                  ? "bg-green-600 text-white border-green-600"
                                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500"
                              }`}
                            >
                              <input
                                type="radio"
                                name="level"
                                value={lev.id}
                                className="sr-only"
                                onChange={() => setselectedLevel(lev.id)}
                                checked={selectedLevel === lev.id}
                              />
                              {lev.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400">
                              $
                            </span>
                          </div>
                          <input
                            name="price"
                            type="number"
                            placeholder="99.99"
                            className="w-full pl-8 p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description || ""}
                          placeholder="Provide a detailed description of your course..."
                          className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          rows="4"
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Level
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {levels.map((lev) => (
                            <label
                              key={lev.id}
                              className={`rounded-full px-4 py-2 cursor-pointer border-2 transition-all duration-200 ${
                                selectedLevel === lev.id
                                  ? "bg-green-600 text-white border-green-600"
                                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500"
                              }`}
                            >
                              <input
                                type="radio"
                                name="level"
                                value={lev.id}
                                className="sr-only"
                                onChange={() => setselectedLevel(lev.id)}
                                checked={selectedLevel === lev.id}
                              />
                              {lev.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400">
                              $
                            </span>
                          </div>
                          <input
                            name="price"
                            type="number"
                            placeholder="99.99"
                            className="w-full pl-8 p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description || ""}
                          placeholder="Provide a detailed description of your course..."
                          className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          rows="4"
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Level
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {levels.map((lev) => (
                            <label
                              key={lev.id}
                              className={`rounded-full px-4 py-2 cursor-pointer border-2 transition-all duration-200 ${
                                selectedLevel === lev.id
                                  ? "bg-green-600 text-white border-green-600"
                                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500"
                              }`}
                            >
                              <input
                                type="radio"
                                name="level"
                                value={lev.id}
                                className="sr-only"
                                onChange={() => setselectedLevel(lev.id)}
                                checked={selectedLevel === lev.id}
                              />
                              {lev.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400">
                              $
                            </span>
                          </div>
                          <input
                            name="price"
                            type="number"
                            placeholder="99.99"
                            className="w-full pl-8 p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description || ""}
                          placeholder="Provide a detailed description of your course..."
                          className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          rows="4"
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {step !== 1 && (
                      <>
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-lg bg-gray-700 text-white font-extrabold text-xl hover:bg-gray-600 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </button>
                      </>
                    )}
                    {step === 1 ? (
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-lg text-white bg-green-600 font-extrabold text-xl hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-lg text-white bg-green-600 font-extrabold text-xl hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={handleSubmit}
                      >
                        Create Course
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 font-sans bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-full overflow-y-auto border border-gray-200 dark:border-gray-700 animate-slideUp">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
                onClick={editModalClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Header with gradient */}
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
                  <h2 className="text-3xl font-extrabold mb-1">Edit Course</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Fill in the details to Edit Course
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    className={`text-sm font-medium ${
                      editStep === 1 ? "text-gray-500" : "text-black"
                    }`}
                    onClick={() => setEditStep(1)}
                  >
                    Basic Info
                  </button>
                  <button
                    type="button"
                    className={`text-sm font-medium ${
                      editStep === 2 ? "text-gray-500" : "text-black"
                    }`}
                    onClick={() => setEditStep(2)}
                  >
                    Additional Info
                  </button>
                </div>

                {/* Section 1: Basic Info */}
                {editStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Course Name
                        </label>
                        <input
                          name="name"
                          value={editFormData.name || ""}
                          type="text"
                          placeholder="e.g. Web Development Masterclass"
                          className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Course Title
                        </label>
                        <input
                          name="title"
                          value={editFormData.title || ""}
                          type="text"
                          placeholder="e.g. Become a Full-Stack Developer"
                          className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Requirements
                        </label>
                        <input
                          name="requirements"
                          value={editFormData.requirements || ""}
                          type="text"
                          placeholder="e.g. Basic HTML, CSS knowledge"
                          className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Benefits
                        </label>
                        <input
                          name="benefits"
                          value={editFormData.benefits || ""}
                          type="text"
                          placeholder="e.g. Job-ready skills, Portfolio projects"
                          className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          name="category_id"
                          value={editFormData.category_id || ""}
                          onChange={handleEditChange}
                          className="w-full p-3 pr-10 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 appearance-none"
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {categories &&
                            categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 dark:text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Display selected category as a pill/tag */}
                      {editFormData.category_id && categories && (
                        <div className="mt-2">
                          <span className="inline-block rounded-full px-4 py-2 bg-black text-white border-2 border-black">
                            {
                              categories.find(
                                (cat) =>
                                  cat.id === Number(editFormData.category_id)
                              )?.name
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Section 2: Additional Info */}
                {editStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {levels.map((lev) => (
                          <label
                            key={lev.id}
                            className={`rounded-full px-4 py-2 cursor-pointer border-2 transition-all duration-200 ${
                              editFormData.level === lev.id
                                ? "bg-black text-white border-black"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-black"
                            }`}
                          >
                            <input
                              type="radio"
                              name="level"
                              value={lev.id}
                              className="sr-only"
                              onChange={() => setselectedLevel(lev.id)}
                              checked={editFormData.level === lev.id}
                            />
                            {lev.name}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">
                            $
                          </span>
                        </div>
                        <input
                          name="price"
                          type="number"
                          placeholder="99.99"
                          value={editFormData.price || ""}
                          className="w-full pl-8 p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editFormData.description || ""}
                        placeholder="Provide a detailed description of your course..."
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        rows="4"
                        onChange={handleEditChange}
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {editStep !== 1 && (
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg bg-black font-extrabold text-xl hover:bg-white hover:text-black dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      onClick={() => setEditStep(1)}
                    >
                      Back
                    </button>
                  )}
                  {editStep === 1 ? (
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg text-white bg-black font-extrabold text-xl hover:bg-white hover:text-black shadow-lg hover:shadow-black-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={() => setEditStep(2)}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg text-white bg-black font-extrabold text-xl hover:bg-white hover:text-black shadow-lg hover:shadow-black-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={handleEditSubmit}
                    >
                      Edit Course
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Course;
