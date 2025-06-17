import React, { useState, useEffect } from "react";
import { adminAxios, tutorAxios } from "../../../../../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { setModuleId } from "../../../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const AdminCourseOverview = () => {
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const id = useSelector((state) => state.user.courseId);
  const [filter, setFilter] = useState("pending");
  const [filtereModules, setFilteredModules] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("id", id);

  console.log(modules);
  console.log("course data", course);

  useEffect(() => {
    const result = modules.filter((module) => {
      if (filter === "pending") return module.status === "pending";
      return module.status === filter;
    });
    setFilteredModules(result);
  }, [modules, filter]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await adminAxios.get(`view_course/${id}/`);
        setCourse(response.data);
      } catch (error) {
        toast.error("Error while fetching course details");
        console.error(error);
      }
    };

    fetchCourseDetails();
    fetchModules();
  }, [id]);

  const fetchModules = async () => {
    try {
      const response = await adminAxios.get(`course_modules/${id}/`);
      console.log(response.data);
      setModules(response.data);
    } catch (error) {
      toast.error("Error while fetching Modules details");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleAccept = async (e, id) => {
    e.preventDefault();
    try {
      await adminAxios.post(`accept_module/${id}/`);
      toast.success("Module Accepted Successfully");
      fetchModules();
    } catch (error) {
      toast.error(error || "Course not Found");
      console.error("Error:", error);
    }
  };

  const handleReject = async (e, id) => {
    e.preventDefault();
    try {
      await adminAxios.post(`reject_module/${id}/`);
      toast.success("Module Rejected Successfully");
      fetchModules();
    } catch (error) {
      toast.error(error || "Course not Found");
      console.error("Error:", error);
    }
  };

  const toggle_status = async (e, id) => {
    e.preventDefault();
    try {
      await adminAxios.post(`module_status/${id}/`);
      toast.success("Status Updated Successfully");
      fetchModules();
    } catch (error) {
      toast.error("Module not Found");
      console.error("Error:", error);
    }
  };

  const handleModuleClick = (moduleId) => {
    dispatch(setModuleId(moduleId));
    navigate("/admin/courses/lessons");
  };

  return (
    <Layout page="Modules">
      <div className="p-4 min-h-screen relative z-10 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Wait until course is loaded */}
          {!course ? (
            <div className="text-center text-xl">Loading course details...</div>
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
                </div>
                <div>
                  <button
                    className="text-xl font-bold px-5 py-2 ml-2 mt-2 mr-40 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
                    onClick={() => navigate("/admin/courses")}
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
                    Pending
                  </button>
                  <button
                    className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                      filter === "accepted"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
                    onClick={() => setFilter("accepted")}
                  >
                    Accepted
                  </button>
                  <button
                    className={`text-xl font-bold px-5 py-2 ml-2 mt-2 ${
                      filter === "rejected"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    } rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300`}
                    onClick={() => setFilter("rejected")}
                  >
                    Rejected
                  </button>
                </div>
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
              </div>

              {/* Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtereModules.map((module, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

                    <div className="p-6 flex flex-col justify-between h-full">
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
                              {module.created_at}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex justify-between"
                        style={{ marginLeft: "170px" }}
                      >
                        <div className="flex items-center space-x-2">
                          {module.status === "pending" ? (
                            <>
                              <button
                                className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                onClick={(e) => handleAccept(e, module.id)}
                              >
                                Accept
                              </button>
                              <button
                                className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                onClick={(e) => handleReject(e, module.id)}
                              >
                                Reject
                              </button>
                            </>
                          ) : module.status === "accepted" ? (
                            module.is_active ? (
                              <button
                                className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                                onClick={(e) => toggle_status(e, module.id)}
                                style={{ marginLeft: "80px" }}
                              >
                                <DeleteForeverIcon fontSize="small" />
                              </button>
                            ) : (
                              <button
                                className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                                onClick={(e) => toggle_status(e, module.id)}
                                style={{ marginLeft: "80px" }}
                              >
                                <RestoreFromTrashIcon fontSize="small" />
                              </button>
                            )
                          ) : (
                            <span className="p-2 text-white font-semibold bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition">
                              Rejected
                            </span>
                          )}
                          <>
                            <button
                              className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                              style={{ marginLeft: "10px" }}
                              onClick={() => handleModuleClick(module.id)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </button>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourseOverview;
