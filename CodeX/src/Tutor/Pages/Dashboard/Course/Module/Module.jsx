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
import { setModuleId } from "../../../../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import Loading from "@/User/Components/Loading/Loading";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const id = useSelector((state) => state.user.courseId);
  const tutor = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState([{}]);
  const [editFormData, setEditFormData] = useState([{}]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filter, setFilter] = useState("accepted");
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(0);
  const [isAccepted, setIsAccepted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("id", id);

  console.log(modules);
  console.log("course data", course);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await tutorAxios.get(`view-course/${id}/`);
        setCourse(response.data);
      } catch (error) {
        toast.error("Error while fetching course details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
    fetchModules();
  }, [id]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await tutorAxios.get(`course-modules/${id}/`);
      console.log(response.data);
      setModules(response.data);
    } catch (error) {
      toast.error("Error while fetching Modules details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      fetchModules();
    } catch {
      console.log("Error while fetching modules");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      toast.error("Title is required");
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      toast.error("Description is required");
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm(formData)) {
        const data = {
          title: formData.title,
          description: formData.description,
          course_id: id,
        };

        setLoading(true);

        const response = await tutorAxios.post("create-module/", data);
        toast.success("Module Added Successfully Create Lessons");
        toast.success("Wait for the Admin Approval");
        setModules((prevModules) => [...prevModules, response.data]);
        setFormData([{}]);
        setIsModalOpen(false);
        dispatch(setModuleId(response.data.id));
        navigate("/tutor/course/lessons");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.errors?.name?.[0] ||
        "Error while Adding Module";

      toast.error(errorMessage);
      console.error("Error Adding Module:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggle_status = async (e, id) => {
    e.preventDefault();
    try {
      setLoading(true);
      await tutorAxios.post(`module-status/${id}/`);
      toast.success("Status Updated Successfully");
      fetchModules();
    } catch (error) {
      toast.error(error || "Error While Updating Status");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditModal = (id) => {
    setSelectedData(id);
    const selectedModule = modules.find((mol) => mol.id === id);
    setEditFormData({
      title: selectedModule.title,
      description: selectedModule.description,
    });
    setIsEditModalOpen(true);
    console.log("selected data", selectedData);
  };

  const handleEditSubmit = async () => {
    try {
      if (validateForm(editFormData)) {
        setLoading(true);
        await tutorAxios.put(`edit-module/${selectedData}/`, editFormData);
        toast.success("Module Edited Successfully");
        fetchModules();
        setIsEditModalOpen(false);
        setSelectedData(null);
        setEditFormData([{}]);
      }
    } catch (error) {
      toast.error(error || "Error While Editing Module");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pending = modules.filter((c) => c.status === "pending").length;
    const accepted = modules.filter((c) => c.status === "accepted").length;
    const rejected = modules.filter((c) => c.status === "rejected").length;

    const result = modules.filter((module) => {
      if (filter === "accepted") return module.status === "accepted";
      return module.status === filter;
    });
    setFilteredLessons(result);

    setIsPending(pending);
    setIsAccepted(accepted);
    setIsRejected(rejected);
  }, [modules, filter]);

  const handleCourseClick = (moduleId) => {
    dispatch(setModuleId(moduleId));
    navigate("/tutor/course/lessons");
  };

  return (
    <Layout page="Courses">
      {loading ? (
        <Loading />
      ) : (
        <div className="p-2 min-h-screen relative z-10 text-white">
          <div className="max-w-7xl mx-auto">
            {/* Wait until course is loaded */}
            {!course ? (
              <div className="text-center text-xl">
                Loading module details...
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-2 bg-gradient-to-br from-cyan-900/40 to-purple-800/40 p-6 rounded-3xl shadow-2xl relative">
                  <div className="flex justify-between items-start flex-wrap">
                    <div>
                      <h2 className="text-5xl font-extrabold text-white mb-3">
                        {course.name}
                      </h2>
                      <p className="text-lg text-gray-300 max-w-2xl mb-4">
                        {course.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-md">
                        <div className="col-span-2">
                          <span className="font-bold">Requirements:</span>{" "}
                          {course.requirements}
                        </div>
                        <div className="col-span-2">
                          <span className="font-bold">Benefits:</span>{" "}
                          {course.benefits}
                        </div>
                        <div>
                          <span className="font-bold">Created On:</span>{" "}
                          {course.created_at}
                        </div>
                      </div>
                    </div>

                    <div></div>
                    {/* Filter Buttons */}
                    <div>
                      <button
                        className="text-xl font-bold px-5 py-2 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white hover:border-white transition-all duration-300"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Create Module
                      </button>
                      <button
                        className="text-xl font-bold px-5 py-2 ml-2 mt-2 mr-20 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
                        onClick={() => navigate("/tutor/course")}
                      >
                        Back
                      </button>
                      <button
                        className={`text-xl font-bold px-5 py-2 ml-18 mt-2 ${
                          filter === "pending"
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
                        onClick={() => setFilter("pending")}
                      >
                        Pending{" "}
                        <span className="bg-yellow-500 border border-black rounded-full px-2 py-1 ml-2">
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
                  </div>

                  <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
                </div>

                {/* Modules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLessons.map((module, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                    >
                      <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                              {module.title}
                            </h3>
                          </div>
                          <p className="text-gray-800 font-semibold mb-3 text-lg">
                            {module.description}
                          </p>

                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <span className="text-xs font-medium">
                                Created At: {module.created_at}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Button Container - Right Bottom Aligned */}
                        <div className="flex justify-end items-center gap-2 mt-4">
                          {module.status === "rejected" ? (
                            <button
                              className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition flex items-center gap-1"
                              onClick={() => handleEditModal(module.id)}
                            >
                              Rejected <DeleteForeverIcon fontSize="small" />
                            </button>
                          ) : module.status === "pending" ? (
                            <button className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition flex items-center gap-1">
                              Pending <PendingActionsIcon fontSize="small" />
                            </button>
                          ) : (
                            <>
                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleEditModal(module.id)}
                              >
                                <ModeEditIcon fontSize="small" />
                              </button>

                              {module.is_active ? (
                                <button
                                  className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                  onClick={(e) => toggle_status(e, module.id)}
                                >
                                  <DeleteForeverIcon fontSize="small" />
                                </button>
                              ) : (
                                <button
                                  className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                  onClick={(e) => toggle_status(e, module.id)}
                                >
                                  <RestoreFromTrashIcon fontSize="small" />
                                </button>
                              )}

                              <button
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                                onClick={() => handleCourseClick(module.id)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </button>
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
            <>
              <div className="fixed inset-0 font-sans bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-full overflow-y-auto border border-gray-200 dark:border-gray-700 animate-slideUp">
                  {/* Close button */}
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

                  {/* Header with gradient */}
                  <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="bg-green-500 text-transparent bg-clip-text">
                      <h2 className="text-3xl font-extrabold mb-1">
                        Create Module
                      </h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Fill in the details to create a new Module
                    </p>
                  </div>

                  {/* Form */}
                  <form className="space-y-6">
                    {/* Section 1: Basic Info */}
                    <>
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
                      </div>
                    </>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-lg text-white bg-black font-extrabold text-xl hover:bg-white hover:text-black shadow-lg hover:shadow-black-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black"
                        onClick={handleSubmit}
                      >
                        Create Module
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}

          {isEditModalOpen && (
            <>
              <div className="fixed inset-0 font-sans bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-full overflow-y-auto border border-gray-200 dark:border-gray-700 animate-slideUp">
                  {/* Close button */}
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

                  {/* Header with gradient */}
                  <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-black to-blue-500 text-transparent bg-clip-text">
                      <h2 className="text-3xl font-extrabold mb-1">
                        Edit Module
                      </h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Fill in the details to Edit Module
                    </p>
                  </div>

                  {/* Form */}
                  <form className="space-y-6">
                    {/* Section 1: Basic Info */}
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                          </label>
                          <input
                            name="title"
                            type="text"
                            value={editFormData.title || ""}
                            placeholder=""
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
                            placeholder=""
                            className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>
                    </>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-lg text-white bg-black font-extrabold text-xl hover:bg-white hover:text-black shadow-lg hover:shadow-black-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black"
                        onClick={handleEditSubmit}
                      >
                        Edit Module
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Modules;
