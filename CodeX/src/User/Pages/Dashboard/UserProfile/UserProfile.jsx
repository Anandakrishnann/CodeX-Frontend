import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { userAxios } from "../../../../../axiosConfig";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "sonner";
import Layout from "../Layout/Layout";
import { MdEdit } from "react-icons/md";
import ProfilePictureModal from "../../../../Component/ProfilePictureModal/ProfilePictureModal";
import StreakTracker from "../StreakTracker/StreakTracker";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [picture, setPicture] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [edited, setEdit] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setSelectedUser(userData.email);
    setEdit({
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

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

        const response = await userAxios.post("profile_picture/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setPicture(response.data);
        setNewImage(null);
        setSelectedFile(null);
        setIsProfileModalOpen(false);
        toast.success("Profile Picture added Successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const validate = (data) => {
    let tempErrors = {};

    if (!data.first_name.trim()) {
      tempErrors.first_name = "First name is required";
      toast.error("First name is required");
    } else if (!/^[a-zA-Z]+$/.test(data.first_name)) {
      tempErrors.first_name = "First name can only contain letters";
      toast.error("First name can only contain letters");
    }

    if (!data.last_name.trim()) {
      tempErrors.last_name = "Last name is required";
      toast.error("Last name is required");
    } else if (!/^[a-zA-Z]+$/.test(data.last_name)) {
      tempErrors.last_name = "Last name can only contain letters";
      toast.error("Last name can only contain letters");
    }

    if (!data.phone.trim()) {
      tempErrors.phone = "Phone number is required";
      toast.error("Phone number is required");
    } else if (!/^\d{10}$/.test(data.phone)) {
      tempErrors.phone = "Phone number is invalid";
      toast.error("Phone number is invalid");
    }

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      first_name: edited.first_name || userData.first_name,
      last_name: edited.last_name || userData.last_name,
      email: edited.email || userData.email,
      phone: edited.phone || userData.phone,
    };
    if (validate(data)) {
      try {
        const response = await userAxios.put("edit_user/", data);
        setUserData(response.data);
        toast.success("Profile Edited Successfully");
        setIsModalOpen(false);
      } catch (error) {
        if (error.response) {
          Object.entries(error.response.data).forEach(([key, value]) => {
            toast.error(`${key}: ${value}`);
          });
        } else if (error.request) {
          toast.error("No response from server.");
        } else {
          toast.error("Request setup failed.");
        }
      }
    }
  };

  useEffect(() => {
    const fetchUserUser = async () => {
      try {
        const response = await userAxios.get("user_profile/");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserUser();
    }
  }, [picture, user]);

  if (!userData) {
    return (
      <Layout page={"Profile"}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <div className="text-white text-xl font-semibold">Loading profile...</div>
          </div>
        </div>
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
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-400">Manage your personal information</p>
            </div>
            <button
              onClick={handleOpenModal}
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
                      <img
                        src={
                          userData.profile_picture ||
                          "https://i.pinimg.com/736x/de/0a/47/de0a470a4617bb6272ad32dea7c497ce.jpg"
                        }
                        alt={userData.first_name}
                        className="w-32 h-32 rounded-full border-4 border-slate-800 object-cover shadow-xl"
                      />
                      <button
                        onClick={handleProfileClick}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-lg hover:scale-110 transition-transform"
                      >
                        <MdEdit className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20 pb-6 px-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <p className="text-gray-400 mb-4 flex items-center justify-center gap-2">
                    <EmailIcon className="w-4 h-4" />
                    {userData.email}
                  </p>
                  <p className="text-gray-400 mb-6 flex items-center justify-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    {userData.phone}
                  </p>

                  {/* Streak Tracker */}
                  {/* <div className="bg-slate-700/30 rounded-2xl p-4 border border-white/5">
                    <StreakTracker />
                  </div> */}
                </div>
              </div>
            </div>

            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField
                    icon={<PersonIcon className="w-5 h-5" />}
                    label="First Name"
                    value={userData.first_name}
                  />
                  <InfoField
                    icon={<PersonIcon className="w-5 h-5 " />}
                    label="Last Name"
                    value={userData.last_name}
                  />
                  <InfoField
                    icon={<EmailIcon className="w-5 h-5" />}
                    label="Email Address"
                    value={userData.email}
                  />
                  <InfoField
                    icon={<PhoneIcon className="w-5 h-5" />}
                    label="Phone Number"
                    value={userData.phone}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <EditNoteIcon className="text-white" />
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <EditField
                label="First Name"
                name="first_name"
                value={edited.first_name}
                onChange={handleChange}
              />
              <EditField
                label="Last Name"
                name="last_name"
                value={edited.last_name}
                onChange={handleChange}
              />
              <EditField
                label="Phone Number"
                name="phone"
                value={edited.phone}
                onChange={handleChange}
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProfilePictureModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        picture={
          newImage ||
          userData?.profile_picture ||
          "https://i.pinimg.com/736x/c9/e3/e8/c9e3e810a8066b885ca4e882460785fa.jpg"
        }
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

export default UserProfile;