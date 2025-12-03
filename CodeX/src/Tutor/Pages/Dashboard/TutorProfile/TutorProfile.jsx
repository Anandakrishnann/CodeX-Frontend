import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { tutorAxios } from "../../../../../axiosConfig";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { TiStarOutline } from "react-icons/ti";
import Layout from "../Layout/Layout";
import VerifiedIcon from "@mui/icons-material/Verified";
import { MdEdit } from "react-icons/md";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProfilePictureModal from "../../../../Component/ProfilePictureModal/ProfilePictureModal";
import { toast } from "react-toastify";
import Loading from "@/User/Components/Loading/Loading";

const TutorProfile = () => {
  const [userData, setUserData] = useState(null);
  const user = useSelector((state) => state.user.user);
  const plan = useSelector((state) => state.user.plan_details);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentEditStep, setCurrentEditStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [picture, setPicture] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [edited, setEdit] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    education: "",
    expertise: "",
    occupation: "",
    experience: "",
    about: "",
  });

  const subscribedOn = user?.plan_details?.subscribed_on
    ? new Date(user.plan_details.subscribed_on)
    : null;
  const expiresOn = user?.plan_details?.expires_on
    ? new Date(user.plan_details.expires_on)
    : null;

  const handleProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        const response = await tutorAxios.post("profile_picture/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        setPicture(response.data);
        setNewImage(null);
        setSelectedFile(null);
        setIsProfileModalOpen(false);
        fetchTutorData();
        toast.success("Profile Picture added Successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = (data) => {
    setSelectedUser(data.email);
    setEdit(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setCurrentEditStep(1);
  };

  const handleProfileClick = (pic) => {
    setPicture(pic);
    setIsProfileModalOpen(true);
  };

  const validate = (data) => {
    let tempErrors = {};

    if (!data.first_name.trim()) {
      tempErrors.first_name = "First name is required";
      toast.error(tempErrors.first_name);
    } else if (!/^[a-zA-Z]+$/.test(data.first_name)) {
      tempErrors.first_name = "First name can only contain letters";
      toast.error(tempErrors.first_name);
    }

    if (!data.last_name.trim()) {
      tempErrors.last_name = "Last name is required";
      toast.error(tempErrors.last_name);
    } else if (!/^[a-zA-Z]+$/.test(data.last_name)) {
      tempErrors.last_name = "Last name can only contain letters";
      toast.error(tempErrors.last_name);
    }

    if (!data.phone.trim()) {
      tempErrors.phone = "Phone number is required";
      toast.error(tempErrors.phone);
    } else if (!/^\d{10}$/.test(data.phone)) {
      tempErrors.phone = "Phone number must be 10 digits";
      toast.error(tempErrors.phone);
    }

    if (!data.dob.trim()) {
      tempErrors.dob = "Date of birth is required";
      toast.error(tempErrors.dob);
    }

    if (!data.education.trim()) {
      tempErrors.education = "Education field is required";
      toast.error(tempErrors.education);
    }

    if (!data.expertise.trim()) {
      tempErrors.expertise = "Expertise field is required";
      toast.error(tempErrors.expertise);
    }

    if (!data.occupation.trim()) {
      tempErrors.occupation = "Occupation field is required";
      toast.error(tempErrors.occupation);
    }

    if (!data.experience.trim()) {
      tempErrors.experience = "Experience field is required";
      toast.error(tempErrors.experience);
    }

    if (!data.about.trim()) {
      tempErrors.about = "About section is required";
      toast.error(tempErrors.about);
    }
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userPayload = {
      first_name: edited.first_name || userData.first_name,
      last_name: edited.last_name || userData.last_name,
      phone: edited.phone || userData.phone,
    };

    const tutor = {
      dob: edited.dob || userData.dob,
      education: edited.education || userData.education,
      expertise: edited.expertise || userData.expertise,
      occupation: edited.occupation || userData.occupation,
      experience: edited.experience || userData.experience,
      about: edited.about || userData.about,
    };

    const data = { user: userPayload, tutor };

    if (validate({ ...userPayload, ...tutor })) {
      try {
        const response = await tutorAxios.put("edit_tutor/", data);
        setUserData(response.data);
        toast.success("Profile updated successfully");
        setIsModalOpen(false);
        setCurrentEditStep(1);
        fetchTutorData();
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data;

          if (errorData.error) {
            toast.error(errorData.error);
          }

          if (error.response.status === 400) {
            Object.entries(errorData).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((message) =>
                  toast.error(`${field}: ${message}`)
                );
              } else {
                toast.error(`${field}: ${messages}`);
              }
            });
          }
        } else if (error.request) {
          toast.error("No response from server. Please try again later.");
        } else {
          toast.error("An error occurred while updating the profile.");
        }
      }
    }
  };

  useEffect(() => {
    if (!user || !user.email) {
      console.warn("User or user email is undefined");
      return;
    }

    fetchTutorData();
  }, []);

  const fetchTutorData = async () => {
    try {
      const response = await tutorAxios.get("tutor_profile/");
      setUserData(response.data);
      console.log("tutor profile response data", response.data);
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!userData) {
    return (
      <Layout page={"Profile"}>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout page={"Profile"}>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                My Profile
              </h1>
              <p className="text-gray-400">Manage your profile information</p>
            </div>
            <button
              onClick={() => handleOpenModal(userData)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transform hover:scale-105 transition-all duration-300"
            >
              <EditNoteIcon />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card - Right Side */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10 sticky top-6">
                {/* Cover & Profile Picture */}
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      {userData?.profile_picture ? (
                        <img
                          src={userData.profile_picture}
                          alt={userData.first_name}
                          className="w-32 h-32 rounded-full border-4 border-slate-800 object-cover shadow-xl"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-700 flex items-center justify-center shadow-xl">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleProfileClick(userData.profile_picture)}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-lg hover:scale-110 transition-transform"
                      >
                        <MdEdit className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20 pb-6 px-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                    {userData.first_name} {userData.last_name}
                    <VerifiedIcon className="text-blue-400" />
                  </h2>
                  <span className="text-purple-400 text-lg">({userData.age})</span>
                  <p className="text-gray-400 mb-4 flex items-center justify-center gap-2 mt-2">
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
                  </div>

                  {/* Subscription Card */}
                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <TiStarOutline className="text-yellow-400 text-2xl" />
                      <h3 className="text-lg font-bold text-white">Subscription</h3>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 mb-3">
                      <p className="text-white font-bold text-xl">{user.plan_details.name}</p>
                      <p className="text-white/90 text-sm">{user.plan_details.plan_category}</p>
                    </div>

                    <div className="space-y-2 text-left">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Plan Type:</span>
                        <span className="text-white font-semibold">{user.plan_details.plan_type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-emerald-400 font-bold">₹{user.plan_details.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Expires:</span>
                        <span className="text-orange-400 font-semibold">{expiresOn?.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
              {/* Step Navigation */}
              <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      currentStep === 1
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-700/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    Step 1
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      currentStep === 2
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-700/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    Step 2
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="bg-slate-700/50 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      <ArrowBackIcon />
                      Previous
                    </button>
                  )}
                  {currentStep < 2 && (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      Next
                      <ArrowForwardIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Information - Step 1 */}
              {currentStep === 1 && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField icon={<EmailIcon />} label="First Name" value={userData.first_name} />
                    <InfoField icon={<EmailIcon />} label="Last Name" value={userData.last_name} />
                    <InfoField icon={<EmailIcon />} label="Email Address" value={userData.email} />
                    <InfoField icon={<CakeIcon />} label="Date of Birth" value={userData.dob} />
                    <InfoField icon={<PhoneIcon />} label="Phone" value={userData.phone} />
                    <InfoField icon={<SchoolIcon />} label="Education" value={userData.education} />
                    <InfoField icon={<EmojiObjectsIcon />} label="Expertise" value={userData.expertise} />
                    <InfoField icon={<WorkIcon />} label="Occupation" value={userData.occupation} />
                    <InfoField icon={<TrendingUpIcon />} label="Experience" value={userData.experience + " years"} />
                  </div>
                </div>
              )}

              {/* Additional Information - Step 2 */}
              {currentStep === 2 && (
                <>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                      About
                    </h3>
                    <p className="text-gray-300 leading-relaxed bg-slate-700/30 p-4 rounded-xl border border-white/5">
                      {userData.about}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                      Verification Documents
                    </h3>

                    {/* PDF Document */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                        Verification Document
                      </label>
                      {userData.verification_file ? (
                        <a
                          href={userData.verification_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 rounded-xl p-4 transition-all duration-300 group"
                        >
                          <div className="bg-red-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                            <FileOpenIcon className="w-8 h-8 text-red-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">View Verification PDF</p>
                            <p className="text-gray-400 text-sm">Click to open document</p>
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
                      <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                        Verification Video
                      </label>
                      {userData.verification_video ? (
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                          <video
                            src={userData.verification_video}
                            controls
                            className="w-full aspect-video bg-black"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 bg-slate-700/30 border border-white/10 rounded-xl p-4">
                          No video uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-3xl flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {currentEditStep === 1 && (
                <div className="space-y-4">
                  <EditField label="First Name" name="first_name" value={edited.first_name} onChange={handleChange} />
                  <EditField label="Last Name" name="last_name" value={edited.last_name} onChange={handleChange} />
                  <EditField label="Phone" name="phone" value={edited.phone} onChange={handleChange} />

                  <button
                    onClick={() => setCurrentEditStep(2)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    Next
                    <ArrowForwardIcon />
                  </button>
                </div>
              )}

              {currentEditStep === 2 && (
                <div className="space-y-4">
                  <EditField label="Date of Birth" name="dob" value={edited.dob} onChange={handleChange} />
                  <EditField label="Education" name="education" value={edited.education} onChange={handleChange} />
                  <EditField label="Expertise" name="expertise" value={edited.expertise} onChange={handleChange} />
                  <EditField label="Occupation" name="occupation" value={edited.occupation} onChange={handleChange} />
                  <EditField label="Experience" name="experience" value={edited.experience} onChange={handleChange} />
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">About</label>
                    <textarea
                      name="about"
                      value={edited.about}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentEditStep(1)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <ArrowBackIcon />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ProfilePictureModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        picture={newImage || picture}
        onImageChange={handleProfilePicture}
        onSave={handleProfilePictureSubmit}
      />
    </Layout>
  );
};

const InfoField = ({ icon, label, value }) => (
  <div className="bg-slate-700/30 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300 text-white">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-purple-400">{icon}</span>
      <label className="text-sm font-semibold uppercase tracking-wider">
        {label}
      </label>
    </div>
    <p className="font-medium">{value}</p>
  </div>
);


const EditField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
    />
  </div>
);

export default TutorProfile;