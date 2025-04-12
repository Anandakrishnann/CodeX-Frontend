import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { tutorAxios } from '../../../../../axiosConfig';
import BackgroundAnimation from '../../../../Component/BackgroundAnimation';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { TiStarOutline } from 'react-icons/ti';
import Layout from '../Layout/Layout';
import VerifiedIcon from '@mui/icons-material/Verified';
import { MdEdit } from 'react-icons/md';
import ProfilePictureModal from '../../../../Component/ProfilePictureModal/ProfilePictureModal'; // Import the new component
import { toast } from 'react-toastify'; // Assuming toast is used for notifications

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
  const [newImage, setNewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [edited, setEdit] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    leetcode_id: '',
    dob: '',
    education: '',
    expertise: '',
    occupation: '',
    experience: '',
    about: '',
  });

  console.log(user);
  console.log(picture);
  console.log(edited);

  const subscribedOn = user?.plan_details?.subscribed_on
    ? new Date(user.plan_details.subscribed_on)
    : null;
  const expiresOn = user?.plan_details?.expires_on
    ? new Date(user.plan_details.expires_on)
    : null;

    const uploadToCloudinary = async (file, folder, resourceType = "auto") => {
      if (!file) {
        toast.error(`No ${folder} file selected!`);
        return null;
      }
    
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("resource_type", resourceType);
    
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: "POST",
          body: formData,
        });
    
        const data = await response.json();
    
        if (data.secure_url) {
          toast.success(`${folder} uploaded successfully!`);
          return data.secure_url; // ✅ Use public URL
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error(`Cloudinary ${folder} Upload Error:`, error);
        toast.error(`Failed to upload ${folder}`);
        return null;
      }
  };


  const handleProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file)); // this one is used for preview
      setSelectedFile(file); // create a second state just for actual file upload
    }
  };
  
  

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        const profilePictureUrl = await uploadToCloudinary(selectedFile, "profile_picture", "image");
        const response = await tutorAxios.post(`profile_picture/${userData.email}/`, {
          profilePictureUrl: profilePictureUrl,
        });
        setPicture(response.data);
        setNewImage(null);
        setSelectedFile(null);
        setIsProfileModalOpen(false)
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
  };

  const handleProfileClick = (pic) => {
    setPicture(pic);
    setIsProfileModalOpen(true);
  };

  const validate = (data) => {
    let tempErrors = {};

    if (!data.first_name.trim()) {
      tempErrors.first_name = 'First name is required';
      toast.error(tempErrors.first_name);
    } else if (!/^[a-zA-Z]+$/.test(data.first_name)) {
      tempErrors.first_name = 'First name can only contain letters';
      toast.error(tempErrors.first_name);
    }

    if (!data.last_name.trim()) {
      tempErrors.last_name = 'Last name is required';
      toast.error(tempErrors.last_name);
    } else if (!/^[a-zA-Z]+$/.test(data.last_name)) {
      tempErrors.last_name = 'Last name can only contain letters';
      toast.error(tempErrors.last_name);
    }

    if (!data.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
      toast.error(tempErrors.phone);
    } else if (!/^\d{10}$/.test(data.phone)) {
      tempErrors.phone = 'Phone number must be 10 digits';
      toast.error(tempErrors.phone);
    }

    if (!data.leetcode_id.trim()) {
      tempErrors.leetcode_id = 'Leetcode ID is required';
      toast.error(tempErrors.leetcode_id);
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.leetcode_id)) {
      tempErrors.leetcode_id =
        'Leetcode ID can only contain letters, numbers, and underscores';
      toast.error(tempErrors.leetcode_id);
    }

    if (!data.dob.trim()) {
      tempErrors.dob = 'Date of birth is required';
      toast.error(tempErrors.dob);
    }

    if (!data.education.trim()) {
      tempErrors.education = 'Education field is required';
      toast.error(tempErrors.education);
    }

    if (!data.expertise.trim()) {
      tempErrors.expertise = 'Expertise field is required';
      toast.error(tempErrors.expertise);
    }

    if (!data.occupation.trim()) {
      tempErrors.occupation = 'Occupation field is required';
      toast.error(tempErrors.occupation);
    }

    if (!data.experience.trim()) {
      tempErrors.experience = 'Experience field is required';
      toast.error(tempErrors.experience);
    }

    if (!data.about.trim()) {
      tempErrors.about = 'About section is required';
      toast.error(tempErrors.about);
    }
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const user = {
      first_name: edited.first_name || userData.first_name,
      last_name: edited.last_name || userData.last_name,
      phone: edited.phone || userData.phone,
      leetcode_id: edited.leetcode_id || userData.leetcode_id,
    };
  
    const tutor = {
      dob: edited.dob || userData.dob,
      education: edited.education || userData.education,
      expertise: edited.expertise || userData.expertise,
      occupation: edited.occupation || userData.occupation,
      experience: edited.experience || userData.experience,
      about: edited.about || userData.about,
    };
  
    const data = { user, tutor };
  
    if (validate({ ...user, ...tutor })) {
      try {
        const response = await tutorAxios.put(`/edit_tutor/${selectedUser}/`, data);
        setUserData(response.data);
        toast.success('Profile updated successfully');
        setIsModalOpen(false);
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data;
  
          // Handle 404 error (e.g., "User not found")
          if (errorData.error) {
            toast.error(errorData.error);
          }
  
          // Handle 400 validation errors (e.g., serializer.errors)
          if (error.response.status === 400) {
            Object.entries(errorData).forEach(([field, messages]) => {
              // Messages is typically an array of strings
              if (Array.isArray(messages)) {
                messages.forEach((message) => toast.error(`${field}: ${message}`));
              } else {
                // Fallback for unexpected formats
                toast.error(`${field}: ${messages}`);
                console.log(messages);
                
              }
            });
          }
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          toast.error('An error occurred while updating the profile.');
        }
      }
    }
  };

  useEffect(() => {
    if (!user || !user.email) {
      console.warn('User or user email is undefined');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await tutorAxios.get(`/tutor_profile/${user.email}/`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [picture]);

  return (
    <Layout page={'Profile'}>
      <BackgroundAnimation />
      <div className="flex flex-col font-serif md:flex-row items-start justify-center min-h-screen bg-black text-black p-4 relative z-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-2/3">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-serif">Profile</h1>
            <div className="text-white px-4 py-2 rounded-lg space-x-2">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-black px-4 py-2 rounded"
                  style={{ marginLeft: '320px' }}
                >
                  Previous
                </button>
              )}
              {currentStep < 2 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-black text-white px-4 py-2 rounded"
                  style={{ marginLeft: '350px' }}
                >
                  Next
                </button>
              )}
            </div>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => handleOpenModal(userData)}
            >
              <EditNoteIcon />
              <span className="font-semibold">Edit Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {userData ? (
              <>
                {currentStep === 1 && (
                  <>
                    <div>
                      <label className="block text-gray-600">First Name</label>
                      <input
                        type="text"
                        value={userData.first_name || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Last Name</label>
                      <input
                        type="text"
                        value={userData.last_name || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Email address</label>
                      <input
                        type="email"
                        value={userData.email || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Date of Birth</label>
                      <input
                        type="text"
                        value={userData.dob || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Phone</label>
                      <input
                        type="text"
                        value={userData.phone || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Leetcode Id</label>
                      <input
                        type="text"
                        value={userData.leetcode_id || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Education</label>
                      <input
                        type="text"
                        value={userData.education || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Expertise</label>
                      <input
                        type="text"
                        value={userData.expertise || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Occupation</label>
                      <input
                        type="text"
                        value={userData.occupation || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600">Experience</label>
                      <input
                        type="text"
                        value={userData.experience || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        read実は
                      />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div>
                      <label className="block text-gray-600">About</label>
                      <textarea
                        value={userData.about || ''}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        rows="4"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-4">Verification File</label>
                      {userData.verification_file ? (
                        <a
                          href={userData.verification_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black border-2 border-black p-2 inline-flex items-center space-x-2"
                        >
                          <FileOpenIcon />
                          <span>View Verification PDF</span>
                        </a>
                      ) : (
                        <p className="text-gray-500">No file available</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600">Verification Video</label>
                      {userData.verification_video ? (
                        <video
                          controls
                          style={{ width: '900px', height: '200px' }}
                          className="mt-1 border border-gray-300 rounded-lg bg-gray-100"
                        >
                          <source src={userData.verification_video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <p className="text-gray-500">No video available</p>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-9 w-full md:w-1/3 mt-8 md:mt-0 md:ml-6 text-center">
          {userData ? (
            <>
              <div className="relative w-32 h-32 mx-auto">
              {userData?.profile_picture ? (
                <img
                  src={userData.profile_picture || ''}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-black shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-black shadow-lg">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
                <button
                  className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white shadow-md hover:bg-gray-800"
                  title="Edit Profile Picture"
                  onClick={() => handleProfileClick(userData.profile_picture)}
                >
                  <MdEdit />
                </button>
              </div>
              <h2 className="mt-4 text-2xl font-bold">
                {userData.first_name} {userData.last_name} ({userData.age}) <VerifiedIcon />
              </h2>
              <p className="text-gray-600 font-semibold">{userData.occupation}</p>
              <p className="text-gray-500 text-sm mt-2">Expertise In - {userData.expertise}</p>
              <p className="text-gray-500 text-sm">{userData.education}</p>

              <div className="text-white p-2 rounded-xl shadow-xl border border-white max-w-sm mx-auto">
                <h1 className="bg-black text-white text-2xl mb-2 px-6 py-3 rounded-lg flex items-center justify-center mx-auto gap-2 hover:bg-white hover:text-black border border-white transition-all duration-300 shadow">
                  Subscription Plan
                </h1>

                <button className="bg-black text-white text-lg px-6 py-3 rounded-lg flex items-center justify-center mx-auto gap-2 hover:bg-white hover:text-black border border-white transition-all duration-300 shadow">
                  <TiStarOutline fontSize="1.5rem" />
                  <span className="font-semibold">{user.plan_details.name || ''}</span>
                </button>

                <div className="mt-2 bg-black text-white p-4 rounded-md space-y-2 shadow-inner border border-black">
                  <p className="text-lg font-bold">{user.plan_details.plan_category || ''}</p>
                  <p className="text-sm font-extrabold">
                    {user.plan_details.plan_type || ''} Plan • ₹{user.plan_details.price || ''}
                  </p>
                  <p className="text-xl font-extrabold">Expires In</p>
                  <p className="text-xl rounded-md font-extrabold">
                    {subscribedOn?.toLocaleDateString()} → {expiresOn?.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" style={{ height: 'auto' }}>
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

            {currentEditStep === 1 && (
              <>
                <div>
                  <label className="block text-gray-600">First Name</label>
                  <input
                    name="first_name"
                    type="text"
                    value={edited.first_name}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Last Name</label>
                  <input
                    name="last_name"
                    type="text"
                    value={edited.last_name}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    value={edited.phone}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Leetcode Id</label>
                  <input
                    name="leetcode_id"
                    type="text"
                    value={edited.leetcode_id}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <button
                  className="mt-4 bg-black text-white px-4 py-2 rounded-md"
                  onClick={() => setCurrentEditStep(2)}
                >
                  Next
                </button>
              </>
            )}

            {currentEditStep === 2 && (
              <>
                <div>
                  <label className="block text-gray-600">Date of Birth</label>
                  <input
                    name="dob"
                    type="text"
                    value={edited.dob}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Education</label>
                  <input
                    name="education"
                    type="text"
                    value={edited.education}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Expertise</label>
                  <input
                    name="expertise"
                    type="text"
                    value={edited.expertise}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Occupation</label>
                  <input
                    name="occupation"
                    type="text"
                    value={edited.occupation}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Experience</label>
                  <input
                    name="experience"
                    type="text"
                    value={edited.experience}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">About</label>
                  <textarea
                    name="about"
                    type="text"
                    value={edited.about}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md"
                    onClick={() => setCurrentEditStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
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

export default TutorProfile;