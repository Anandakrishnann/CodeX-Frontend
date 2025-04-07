import React,{useState, useEffect} from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import { tutorAxios } from '../../../../../axiosConfig';
import BackgroundAnimation from '../../../../Component/BackgroundAnimation';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FileOpenIcon from '@mui/icons-material/FileOpen';

const TutorProfile = () => {
  const [activeItem, setActiveItem] = useState("Profile");
  const [userData, setUserData] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentEditStep, setCurrentEditStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edited, setEdit] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone:"",
    leetcode_id:"",
    dob:"",
    education: "",
    expertise:"",
    occupation:"",
    experience:"",
    about:"",
  })
  console.log(selectedUser);
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setEdit((prev) => ({
      ...prev,
      [name]: value
    }))
  } 

  const handleOpenModal = () => {
    setSelectedUser(userData.email)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setIsModalOpen(false)
  }

  const validate = (data) => {
      let tempErrors = {}

      if (!data.first_name.trim()) {
        tempErrors.first_name = 'First name is required';
        toast.error(tempErrors.first_name);
      } else if (!/^[a-zA-Z]+$/.test(data.first_name)) {
        tempErrors.first_name = 'First name can only contain letters';
        toast.error(tempErrors.first_name);
      }
    
      // Last Name
      if (!data.last_name.trim()) {
        tempErrors.last_name = 'Last name is required';
        toast.error(tempErrors.last_name);
      } else if (!/^[a-zA-Z]+$/.test(data.last_name)) {
        tempErrors.last_name = 'Last name can only contain letters';
        toast.error(tempErrors.last_name);
      }
    
      // Phone
      if (!data.phone.trim()) {
        tempErrors.phone = 'Phone number is required';
        toast.error(tempErrors.phone);
      } else if (!/^\d{10}$/.test(data.phone)) {
        tempErrors.phone = 'Phone number must be 10 digits';
        toast.error(tempErrors.phone);
      }
    
      // Leetcode ID
      if (!data.leetcode_id.trim()) {
        tempErrors.leetcode_id = 'Leetcode ID is required';
        toast.error(tempErrors.leetcode_id);
      } else if (!/^[a-zA-Z0-9_]+$/.test(data.leetcode_id)) {
        tempErrors.leetcode_id = 'Leetcode ID can only contain letters, numbers, and underscores';
        toast.error(tempErrors.leetcode_id);
      }
    
      // Date of Birth
      if (!data.dob.trim()) {
        tempErrors.dob = 'Date of birth is required';
        toast.error(tempErrors.dob);
      }
    
      // Education
      if (!data.education.trim()) {
        tempErrors.education = 'Education field is required';
        toast.error(tempErrors.education);
      }
    
      // Expertise
      if (!data.expertise.trim()) {
        tempErrors.expertise = 'Expertise field is required';
        toast.error(tempErrors.expertise);
      }
    
      // Occupation
      if (!data.occupation.trim()) {
        tempErrors.occupation = 'Occupation field is required';
        toast.error(tempErrors.occupation);
      }
    
      // Experience
      if (!data.experience.trim()) {
        tempErrors.experience = 'Experience field is required';
        toast.error(tempErrors.experience);
      }
    
      // About
      if (!data.about.trim()) {
        tempErrors.about = 'About section is required';
        toast.error(tempErrors.about);
      }
    
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;

    }

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const user = {
        first_name: edited.first_name || userData.first_name,
        last_name: edited.last_name || userData.last_name,
        email: edited.email || userData.email,
        phone: edited.phone || userData.phone,
        leetcode_id: edited.leetcode_id || userData.leetcode_id,
        profile_picture: edited.profile_picture || userData.profile_picture,
      };
    
      const tutor = {
        dob: edited.dob || userData.dob,
        education: edited.education || userData.education,
        expertise: edited.expertise || userData.expertise,
        occupation: edited.occupation || userData.occupation,
        experience: edited.experience || userData.experience,
        about: edited.about || userData.about,
        profile_picture: edited.profile_picture || userData.profile_picture, // optional
      };
    
      const data = { user, tutor };
    
      if (validate({ ...user, ...tutor })) {
        try {
          const response = await userAxios.put(`edit_tutor/${selectedUser}/`, data);
          setUserData(response.data);
          toast.success("Profile Edited Successfully");
          setIsModalOpen(false);
        } catch (error) {
          if (error.response && error.response.data) {
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
    if (!user || !user.email) {
      console.warn("User or user email is undefined");
      return;
    }

    const fetchUserUser = async () => {
      try {
        const response = await tutorAxios.get(`tutor_profile/${user.email}/`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserUser();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <BackgroundAnimation />
        <div className="flex flex-col font-serif md:flex-row items-start justify-center min-h-screen bg-black text-black p-6 relative z-10">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-2/3">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold font-serif">Profile</h1>
              <div className="text-white px-4 py-2 rounded-lg  space-x-2">
                    {currentStep > 1 && (
                      <button onClick={() => setCurrentStep(currentStep - 1)} className="bg-green-600 px-4 py-2 rounded" style={{marginLeft:"320px"}}>Previous</button>
                    )}
                    {currentStep < 2 && (
                      <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-green-600 text-white px-4 py-2 rounded" style={{marginLeft:"350px"}}>Next</button>
                    )}
                  </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2" onClick={handleOpenModal}>
                <EditNoteIcon />
                <span className="font-semibold">Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {userData ? (
                <>
                  {currentStep === 1 && (
                    <>
                      <div><label className="block text-gray-600">First Name</label><input type="text" value={userData.first_name || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Last Name</label><input type="text" value={userData.last_name || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Email address</label><input type="email" value={userData.email || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Date of Birth</label><input type="text" value={userData.dob || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Phone</label><input type="text" value={userData.phone || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Leetcode Id</label><input type="text" value={userData.leetcode_id || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Education</label><input type="text" value={userData.education || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Expertise</label><input type="text" value={userData.expertise || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Occupation</label><input type="text" value={userData.occupation || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Experience</label><input type="text" value={userData.experience || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                    </>
                    
                  )}

                  {currentStep === 2 && (
                    <>
                      <div><label className="block text-gray-600">About</label><textarea value={userData.about || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" rows="4" readOnly /></div>
                      <div>
                        <label className="block text-gray-600 mb-4">Verification File</label>
                        {userData.verification_file ? (
                          <a href={userData.verification_file} target="_blank" rel="noopener noreferrer" className="text-black border-2 border-black p-2 inline-flex items-center space-x-2">
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
                          <video controls style={{width: "900px", height:"200px"}} className=" mt-1 border border-gray-300 rounded-lg bg-gray-100">
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

          <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-1/3 mt-6 md:mt-0 md:ml-6 text-center">
            {userData ? (
              <>
                <img src={userData.profile_picture || ""} alt="Profile" className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg -mt-16" />
                <h2 className="mt-4 text-2xl font-bold">{userData.first_name} {userData.last_name}</h2>
                <p className="text-gray-600 font-semibold">{userData.occupation}</p>
                <p className="text-gray-500 text-sm mt-2">Expertise In - {userData.expertise}</p>
                <p className="text-gray-500 text-sm">{userData.education}</p>
                <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto space-x-2">
                  <EditNoteIcon />
                  <span className="font-semibold">Edit Profile</span>
                </button>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" style={{ height: "auto" }}>
      <button
        className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
        onClick={handleCloseModal}
      >
        ×
      </button>
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      {/* Step 1 */}
      {currentEditStep === 1 && (
        <>
          <div><label className="block text-gray-600">First Name</label><input name='first_name' type="text" value={edited.first_name} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">Last Name</label><input name='last_name' type="text" value={edited.last_name} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">Phone</label><input name='phone' type="text" value={edited.phone} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">Leetcode Id</label><input name='leetcode_id' type="text" value={edited.leetcode_id} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={() => setCurrentEditStep(2)}
          >
            Next
          </button>
        </>
      )}

      {/* Step 2 */}
      {currentEditStep === 2 && (
        <>
          <div><label className="block text-gray-600">Date of Birth</label><input name='dob' type="text" value={edited.dob} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">Education</label><input name='education' type="text" value={edited.education} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">Expertise</label><input name='expertise' type="text" value={edited.expertise} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">Occupation</label><input name='occupation' type="text" value={edited.occupation} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">Experience</label><input name='experience' type="text" value={edited.experience} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          <div><label className="block text-gray-600">About</label><textarea name='about' type="text" value={edited.about} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" /></div>
          
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={() => setCurrentEditStep(1)}
            >
              Back
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md"
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
    </div>
  );
};

export default TutorProfile;
