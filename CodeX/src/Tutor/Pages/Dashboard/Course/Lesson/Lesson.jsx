import React, { useState, useEffect } from "react";
import { tutorAxios } from "../../../../../../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useNavigate } from "react-router-dom";
import { setLessonId } from "../../../../../redux/slices/userSlice";
import Loading from "@/User/Components/Loading/Loading";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const id = useSelector((state) => state.user.moduleId);
  const tutor = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [filter, setFilter] = useState("accepted");
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(0);
  const [isAccepted, setIsAccepted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        setLoading(true);
        const response = await tutorAxios.get(`view-module/${id}/`);
        setModule(response.data);
      } catch (error) {
        toast.error("Error while fetching Module details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
    fetchLessons();
  }, [id]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await tutorAxios.get(`course-lessons/${id}/`);
      setLessons(response.data);
    } catch (error) {
      toast.error("Error while fetching Lessons details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pending = lessons.filter((c) => c.status === "pending").length;
    const accepted = lessons.filter((c) => c.status === "accepted").length;
    const rejected = lessons.filter((c) => c.status === "rejected").length;

    const result = lessons.filter((lesson) => {
      if (filter === "accepted") return lesson.status === "accepted";
      return lesson.status === filter;
    });
    setFilteredLessons(result);

    setIsPending(pending);
    setIsAccepted(accepted);
    setIsRejected(rejected);
  }, [lessons, filter]);

  useEffect(() => {
    try {
      setLoading(true);
      fetchLessons();
    } catch {
      console.log("error while fetching lesson");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDocumentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFile(file);
      setDocumentPreview(URL.createObjectURL(file));
    } else {
      setDocumentFile(null);
      setDocumentPreview(null);
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailFile(null);
      setThumbnailPreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.title?.trim()) {
      errors.title = "Title is required";
      toast.error("Title is required");
    }
    if (!formData.description?.trim()) {
      errors.description = "Description is required";
      toast.error("Description is required");
    }
    if (!documentFile) {
      errors.document = "Document is required";
      toast.error("Document is required");
    }
    if (!thumbnailFile) {
      errors.thumbnail = "Thumbnail is required";
      toast.error("Thumbnail is required");
    }
    if (!videoFile) {
      errors.video = "Video is required";
      toast.error("Video is required");
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!id) {
        toast.error("Module ID is missing");
        return;
      }
      if (!validateForm(formData)) return;

      setLoading(true);

      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      formPayload.append("module_id", id);
      formPayload.append("documents", documentFile);
      formPayload.append("thumbnail", thumbnailFile);
      formPayload.append("video", videoFile);

      console.log("Form Payload:", formPayload, "Module ID:", id);
      toast.info("Uploading lesson...");

      const response = await tutorAxios.post("create-lesson/", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lesson Added Successfully");
      toast.success("Wait for Admin Approval");
      fetchLessons();

      // Reset form state
      setFormData({});
      setDocumentFile(null);
      setVideoFile(null);
      setThumbnailFile(null);
      setDocumentPreview(null);
      setThumbnailPreview(null);
      setVideoPreview(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error Adding Lesson:", error.response || error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.title?.[0] ||
        error.response?.data?.description?.[0] ||
        error.response?.data?.documents?.[0] ||
        error.response?.data?.thumbnail?.[0] ||
        error.response?.data?.video?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        "Error while Adding Lesson";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggle_status = async (e, id) => {
    e.preventDefault();
    try {
      setLoading(true);
      await tutorAxios.post(`lesson-status/${id}/`);
      toast.success("Status Updated Successfully");
      fetchLessons();
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Error While Updating Status"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditModal = (id) => {
    setSelectedData(id);
    const selectedLesson = lessons.find((les) => les.id === id);
    setEditFormData({
      title: selectedLesson.title,
      description: selectedLesson.description,
      thumbnail: selectedLesson.thumbnail,
      video: selectedLesson.video,
      documents: selectedLesson.documents,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      if (!editFormData.title?.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!editFormData.description?.trim()) {
        toast.error("Description is required");
        return;
      }

      setLoading(true);

      const formPayload = new FormData();
      formPayload.append("title", editFormData.title);
      formPayload.append("description", editFormData.description);

      // Only add files if user re-selected
      if (documentFile) {
        formPayload.append("documents", documentFile);
      }
      if (thumbnailFile) {
        formPayload.append("thumbnail", thumbnailFile);
      }
      if (videoFile) {
        formPayload.append("video", videoFile);
      }

      toast.info("Updating lesson...");

      await tutorAxios.put(`edit-lesson/${selectedData}/`, formPayload);

      toast.success("Lesson Edited Successfully");
      fetchLessons();

      // Reset states
      setIsEditModalOpen(false);
      setSelectedData(null);
      setEditFormData({});
      setDocumentFile(null);
      setThumbnailFile(null);
      setVideoFile(null);
      setDocumentPreview(null);
      setThumbnailPreview(null);
      setVideoPreview(null);
    } catch (error) {
      console.error("Error Editing Lesson:", error.response || error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.title?.[0] ||
        error.response?.data?.description?.[0] ||
        error.response?.data?.documents?.[0] ||
        error.response?.data?.thumbnail?.[0] ||
        error.response?.data?.video?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        "Error while Editing Lesson";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    dispatch(setLessonId(lessonId));
    navigate("/tutor/lesson/overview");
  };

  return (
    <Layout page="Courses">
      {loading ? (
        <Loading />
      ) : (
        <div className="p-4 min-h-screen relative z-10 text-white">
          <div className="max-w-7xl mx-auto">
            {/* Wait until course is loaded */}
            {!module ? (
              <div className="text-center text-xl">
                Loading Lessons details...
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-2 bg-gradient-to-br from-cyan-900/40 to-purple-800/40 p-6 rounded-3xl shadow-2xl relative">
                  <div className="flex justify-between items-start flex-wrap">
                    <div>
                      <h2 className="text-5xl font-extrabold text-white mb-3">
                        {module.title}
                      </h2>
                      <p className="text-lg text-gray-300 max-w-2xl mb-4">
                        {module.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-md">
                        <div>
                          <span className="font-bold">Created On:</span>{" "}
                          {module.created_at}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        className="text-xl font-bold px-5 py-2 mr-2 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white hover:border-white transition-all duration-300"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Create Lesson
                      </button>
                      <button
                        className="text-xl font-bold px-5 py-2 mr-20 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white hover:border-white transition-all duration-300"
                        onClick={() => navigate("/tutor/course/modules")}
                      >
                        Back
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
                        className={`text-xl font-bold px-5 py-2 ml-2 mt-2 mr-24 ${
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
                  </div>
                  <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
                </div>

                {/* Lessons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                    >
                      <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                      {/* Fixed Thumbnail Container */}
                      <div className="w-full h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={lesson.thumbnail || ""}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div>
                          <p className="text-gray-800 font-semibold text-lg mb-3">
                            {lesson.title}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <span className="text-xs font-medium">
                                Created At: {lesson.created_at}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Button Container - Right Bottom Aligned */}
                        <div className="flex justify-end items-center gap-2 mt-4">
                          {lesson.status === "rejected" ? (
                            <button
                              className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition flex items-center gap-1"
                              onClick={() => handleEditModal(lesson.id)}
                            >
                              Rejected <DeleteForeverIcon fontSize="small" />
                            </button>
                          ) : lesson.status === "pending" ? (
                            <button className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition flex items-center gap-1">
                              Pending <PendingActionsIcon fontSize="small" />
                            </button>
                          ) : (
                            <>
                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleLessonClick(lesson.id)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </button>

                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleEditModal(lesson.id)}
                              >
                                <ModeEditIcon fontSize="small" />
                              </button>

                              {lesson.is_active ? (
                                <button
                                  className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                  onClick={(e) => toggle_status(e, lesson.id)}
                                >
                                  <DeleteForeverIcon fontSize="small" />
                                </button>
                              ) : (
                                <button
                                  className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                  onClick={(e) => toggle_status(e, lesson.id)}
                                >
                                  <RestoreFromTrashIcon fontSize="small" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 font-sans bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-full overflow-y-auto border border-gray-200 dark:border-gray-700 animate-slideUp">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
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
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="bg-green-500 text-transparent bg-clip-text">
                    <h2 className="text-3xl font-extrabold mb-1">
                      Create Lesson
                    </h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Fill in the details to create a new Lesson
                  </p>
                </div>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        name="title"
                        type="text"
                        value={formData.title || ""}
                        placeholder=""
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <input
                        name="description"
                        type="text"
                        value={formData.description || ""}
                        placeholder=""
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Document
                      </label>
                      <input
                        name="documents"
                        type="file"
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleDocumentChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Thumbnail
                      </label>
                      <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Video
                      </label>
                      <input
                        type="file"
                        name="video"
                        accept="video/*"
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleVideoChange}
                      />
                    </div>
                  </div>
                  {documentPreview && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Selected document: {documentFile?.name}
                    </p>
                  )}
                  {thumbnailPreview && (
                    <div className="pt-2">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="w-32 h-20 object-cover border rounded shadow"
                      />
                    </div>
                  )}
                  {videoPreview && (
                    <div className="pt-2">
                      <video
                        controls
                        width="220"
                        height="240"
                        src={videoPreview}
                        className="rounded shadow"
                      />
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg text-white bg-black font-extrabold text-xl hover:bg-white hover:text-black shadow-lg hover:shadow-black-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={handleSubmit}
                    >
                      Create Lesson
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {isEditModalOpen && (
            <div className="fixed inset-0 font-sans bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-full overflow-y-auto border border-gray-200 dark:border-gray-700 animate-slideUp">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
                  onClick={() => setIsEditModalOpen(false)}
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
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
                    <h2 className="text-3xl font-extrabold mb-1">
                      Edit Lesson
                    </h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Fill in the details to edit the Lesson
                  </p>
                </div>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        name="title"
                        type="text"
                        value={editFormData.title || ""}
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <input
                        name="description"
                        type="text"
                        value={editFormData.description || ""}
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Document
                      </label>
                      <input
                        name="documents"
                        type="file"
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleDocumentChange}
                      />
                      {editFormData.documents && (
                        <a
                          href={editFormData.documents}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          View current document
                        </a>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Thumbnail
                      </label>
                      <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleThumbnailChange}
                      />
                      {editFormData.thumbnail && (
                        <img
                          src={editFormData.thumbnail}
                          alt="Current Thumbnail"
                          className="mt-2 w-32 h-20 object-cover rounded-md border"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Video
                      </label>
                      <input
                        type="file"
                        name="video"
                        accept="video/*"
                        className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        onChange={handleVideoChange}
                      />
                      {editFormData.video && (
                        <video
                          src={editFormData.video}
                          controls
                          className="mt-2 w-full rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg text-white bg-black font-extrabold text-xl hover:bg-white hover:text-black shadow-lg hover:shadow-black-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={handleEditSubmit}
                    >
                      Edit Lesson
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Lessons;
