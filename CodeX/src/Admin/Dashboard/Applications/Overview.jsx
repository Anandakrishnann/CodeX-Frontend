import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminAxios } from "../../../../axiosConfig";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { toast } from "react-toastify";
import Loading from "../../../User/Components/Loading/Loading";
import Layout from "../Layout/Layout";
import { useSelector } from "react-redux";

const Overview = () => {
  const id = useSelector((state) => state.user.applicationId);
  const [userData, setUserData] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reason, setReason] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserData();
      fetchReason();
    }
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get(`application_view/${id}/`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReason = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get(`rejected_reason/${id}`);
      setReason(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching reason:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptApplication = async (applicationId) => {
    if (!applicationId) {
      console.error("Error: applicationId is undefined");
      toast.error("Invalid application ID");
      return;
    }

    try {
      setLoading(true);
      await adminAxios.post(`/accept_application/${applicationId}/`);
      console.log("Application accepted");

      setUserData((prevData) => ({
        ...prevData,
        status: "accepted",
      }));
      toast.success("Application Accepted");
      fetchUserData();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const rejectApplication = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setLoading(true);
      await adminAxios.post(`/reject_application/${userData.id}/`, {
        reason: rejectionReason,
      });

      setUserData((prevData) => ({
        ...prevData,
        status: "rejected",
      }));

      toast.success("Application Rejected");
      setShowRejectModal(false);
      setRejectionReason("");
      fetchReason();
      fetchUserData();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <Loading />;
  }

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        gradient: "from-amber-400 to-orange-500",
        icon: <AccessTimeIcon className="w-5 h-5" />,
        text: "Pending Review",
      },
      verified: {
        gradient: "from-emerald-400 to-green-600",
        icon: <TaskAltIcon className="w-5 h-5" />,
        text: "Verified",
      },
      rejected: {
        gradient: "from-red-400 to-rose-600",
        icon: <CancelIcon className="w-5 h-5" />,
        text: "Rejected",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(userData.status);

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header with Status Badge */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  Application Overview
                </h1>
                <p className="text-gray-400">
                  Review and manage tutor application
                </p>
              </div>
              <div
                className={`bg-gradient-to-r ${statusConfig.gradient} px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transform hover:scale-105 transition-all duration-300`}
              >
                {statusConfig.icon}
                <span className="text-white font-bold text-lg">
                  {statusConfig.text}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card - Right Side (shown first on mobile) */}
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10 sticky top-6">
                  {/* Cover & Profile Picture */}
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <img
                          src={userData.profile_picture}
                          alt={userData.username}
                          className="w-32 h-32 rounded-full border-4 border-slate-800 object-cover shadow-xl"
                        />
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-4 border-slate-800"></div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="pt-20 pb-6 px-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {userData.username}
                      <span className="ml-2 text-purple-400 text-lg">
                        ({userData.age})
                      </span>
                    </h2>
                    <p className="text-gray-400 mb-4 flex items-center justify-center gap-2">
                      <WorkIcon className="w-4 h-4" />
                      {userData.occupation}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="bg-slate-700/50 rounded-xl p-3">
                        <p className="text-purple-400 font-semibold flex items-center justify-center gap-2 mb-1">
                          <EmojiObjectsIcon className="w-4 h-4" />
                          Expertise
                        </p>
                        <p className="text-white">{userData.expertise}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-3">
                        <p className="text-blue-400 font-semibold flex items-center justify-center gap-2 mb-1">
                          <SchoolIcon className="w-4 h-4" />
                          Education
                        </p>
                        <p className="text-white">{userData.education}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-3">
                        <p className="text-emerald-400 font-semibold flex items-center justify-center gap-2 mb-1">
                          <TrendingUpIcon className="w-4 h-4" />
                          Experience
                        </p>
                        <p className="text-white">{userData.experience}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {userData.status === "pending" && (
                        <>
                          <button
                            onClick={() => acceptApplication(userData.id)}
                            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <DoneOutlineIcon className="w-5 h-5" />
                            Accept Application
                          </button>
                          <button
                            onClick={handleRejectClick}
                            className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <CloseIcon className="w-5 h-5" />
                            Reject Application
                          </button>
                        </>
                      )}
                      {userData.status === "verified" && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                          <DoneOutlineIcon className="w-5 h-5" />
                          Verified
                        </div>
                      )}
                      {userData.status === "rejected" && (
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                          <CloseIcon className="w-5 h-5" />
                          Rejected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
                {userData.status === "rejected" && reason && (
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-red-500/30 text-white">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-rose-400 rounded-full"></div>
                      Rejection Reason
                    </h3>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CancelIcon className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white leading-relaxed">
                            {reason.reason}
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            {new Date(reason.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      icon={<EmailIcon className="w-5 h-5" />}
                      label="Email Address"
                      value={userData.email}
                      color="text-white"
                    />
                    <InfoField
                      icon={<CakeIcon className="w-5 h-5" />}
                      label="Date of Birth"
                      value={userData.date_of_birth}
                      color="text-white"
                    />
                    <InfoField
                      icon={<SchoolIcon className="w-5 h-5" />}
                      label="Education"
                      value={userData.education}
                      color="text-white"
                    />
                    <InfoField
                      icon={<EmojiObjectsIcon className="w-5 h-5" />}
                      label="Expertise"
                      value={userData.expertise}
                      color="text-white"
                    />
                    <InfoField
                      icon={<WorkIcon className="w-5 h-5" />}
                      label="Occupation"
                      value={userData.occupation}
                      color="text-white"
                    />
                    <InfoField
                      icon={<TrendingUpIcon className="w-5 h-5" />}
                      label="Experience"
                      value={userData.experience}
                      color="text-white"
                    />
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed bg-slate-700/30 p-4 rounded-xl border border-white/5">
                    {userData.about}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    Contact Information
                  </h3>
                  <InfoField
                    icon={<PhoneIcon className="w-5 h-5" />}
                    label="Phone Number"
                    value={userData.phone}
                    color="text-white"
                  />
                </div>

                {/* Documents & Media */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    <span>Verification Documents</span>
                  </h3>

                  {/* PDF Document */}
                  <div className="mb-6">
                    <span className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                      Verification Document
                    </span>
                    {userData.verification_file ? (
                      <a
                        href={userData.verification_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 rounded-xl p-4 transition-all duration-300 group"
                      >
                        <div className="bg-red-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                          <PictureAsPdfIcon className="w-8 h-8 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            View Verification PDF
                          </p>
                          <p className="text-gray-400 text-sm">
                            Click to open document
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        No document uploaded
                      </div>
                    )}
                  </div>

                  {/* Presentation Video */}
                  <div>
                    <span className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                      Presentation Video
                    </span>
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                      <video
                        src={userData.presentation_video}
                        controls
                        className="w-full aspect-video bg-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showRejectModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                        <CancelIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          Reject Application
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Please provide a reason for rejection
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="block text-sm font-semibold text-gray-400 mb-2">
                        Rejection Reason
                      </span>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter the reason for rejecting this application..."
                        className="w-full bg-slate-700/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        rows="4"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleRejectCancel}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={rejectApplication}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <CloseIcon className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

const InfoField = ({ icon, label, value, color }) => (
  <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <span className={color}>{icon}</span>
      <label
        className="text-sm font-semibold uppercase tracking-wider"
        style={{ color: "white" }}
      >
        {label}
      </label>
    </div>
    <p className="text-white font-medium">{value}</p>
  </div>
);

export default Overview;
