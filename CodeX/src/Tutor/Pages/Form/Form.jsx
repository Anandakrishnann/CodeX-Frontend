import { useState } from "react";
import "./Form.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { adminAxios } from "../../../../axiosConfig";
import BackgroundAnimation from '../../../Component/BackgroundAnimation';
import { useSelector } from "react-redux";

const Form = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    education: "",
    expertise: "",
    occupation: "",
    experience: "",
    about: "",
    profilePicture: null,
    verificationFile: null,
    verificationVideo: null,
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  const totalSteps = 6;
  const progressPercentage = (step / totalSteps) * 100;

  
  const[profilePicturePreview, setProfilePicturePreview] = useState(null)
  console.log(formData);
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const user = useSelector((state) => state.user.user.email)
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
  
    if (!formData.fullName.trim() || !/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      toast.error("Enter a valid full name (letters & spaces only)");
      isValid = false;
    }

  
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits");
      isValid = false;
    }
  
    if (!formData.dob) {
      toast.error("Date of Birth is required");
      isValid = false;
    }
  
    if (!formData.education.trim()) {
      toast.error("Education level is required");
      isValid = false;
    }
  
    if (!formData.expertise.trim()) {
      toast.error("Expertise field is required");
      isValid = false;
    }
  
    if (!formData.occupation.trim()) {
      toast.error("Occupation is required");
      isValid = false;
    }
  
    if (!/^\d+$/.test(formData.experience)) {
      toast.error("Experience should be a valid number");
      isValid = false;
    }
  
    if (formData.about.length < 50) {
      toast.error("About section must be at least 50 characters");
      isValid = false;
    }
  
    if (!formData.verificationFile) {
      toast.error("Upload a verification document");
      isValid = false;
    }

    if (!formData.profilePicture) {
      toast.error("Upload a profile Picture document");
      isValid = false;
    }
    
    if (!formData.verificationVideo) {
      toast.error("Upload a verification video");
      isValid = false;
    }    
  
    return isValid;
  };

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
    formData.append("folder", folder);
    formData.append("resource_type", resourceType); // ✅ Set resource type
  
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
    const file = event.target.files[0]
    if (file) {
      setFormData({...formData, profilePicture: file})
      setProfilePicturePreview(URL.createObjectURL(file))
    }
  }
  
  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, verificationVideo: file });
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleVerificationFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, verificationFile: file });
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    toast.info("Uploading files... Please wait.");

    const profilePictureUrl = await uploadToCloudinary(formData.profilePicture, "profile_picture", "image");
    const verificationFileUrl = await uploadToCloudinary(formData.verificationFile, "verification_docs", "raw"); // ✅ Set to raw for PDFs
    const verificationVideoUrl = await uploadToCloudinary(formData.verificationVideo, "verification_videos", "video");    

    if (!verificationFileUrl || !verificationVideoUrl || !profilePictureUrl) {
      toast.error("File uploads failed. Please try again.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.fullName);
    formDataToSend.append("email", user);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("education", formData.education);
    formDataToSend.append("expertise", formData.expertise);
    formDataToSend.append("occupation", formData.occupation);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("about", formData.about);
    formDataToSend.append("profile_picture", profilePictureUrl);
    formDataToSend.append("verification_file", verificationFileUrl);
    formDataToSend.append("verification_video", verificationVideoUrl);

    // Debug FormData contents
    for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await adminAxios.post("applications/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Server Response:", response);
  
      if (response.status === 201) {
        toast.success("Application submitted successfully!");
        navigate("/tutor/order-complete");
      }
    } catch (error) {
      console.error("Error submitting application:", error.response?.data || error.message);
      toast.error("Failed to submit application.");
    }
  };

  

  return (
    <>
      <Navbar />
      <BackgroundAnimation />
      <div className="min-h-screen p-6 bg-none text-green-500 relative z-10" style={{marginTop: "100px"}}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">Submit Your Application</h1>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 mt-10">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="max-w-xl mx-auto p-6 text-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-extrabold font-serif mb-4">Step {step} of 6</h2>
            {step === 1 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3 border-green-500">Personal Information</h1>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" className="w-full p-2 text-black  mb-3 rounded " required />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 text-black mb-3 rounded" required />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} max={new Date().toISOString().split("T")[0]} placeholder="DOB" className="w-full p-2 text-black mb-3 rounded" />

              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3">Professional Information</h1>
                <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Highest Education level" className="w-full p-2 mb-3 text-black rounded" />
                <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} placeholder="Area of expertise" className="w-full p-2 mb-3 text-black rounded" />
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Current Occupation" className="w-full p-2 mb-3 text-black rounded" />
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" className="w-full p-2 mb-3 text-black rounded" />
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3">About Yourself</h1>
                <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Describe yourself..." className="w-full p-2 h-24 mb-3 text-black rounded"></textarea>
              </>
            )}
            {step === 4 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3">Profile Picture</h1>
                <input type="file" name="profilePicture" onChange={handleProfilePicture} className="w-full p-2 mb-3" />
                {formData.profilePicture && (
                  <img src={profilePicturePreview} alt="Profile Preview" className="w-32 h-32 mt-2 rounded" />
                )}
              </>
            )}
            
            {step === 5 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-5">Verification Documents</h1>
                <h1 className="text-3xl font-serif font-semibold mb-3">Document</h1>
                {["ID Verification", "Identity Proof", "Professional Cert", "Resume"].map((docType) => (
                    <button
                      key={docType}
                      type="button"
                      className={`p-2 rounded text-sm ml-4 ${
                        selectedDocumentType === docType ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
                      }`}
                      onClick={() => setSelectedDocumentType(docType)} // ✅ Fix: Set document type separately
                    >
                      {docType}
                    </button>
                  ))}
                  {selectedDocumentType && (
                  <div className="mt-4">
                    <label className="text-gray-400 text-sm">
                      Upload {selectedDocumentType} Document:
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleVerificationFile}
                      className="w-full bg-gray-800 text-white p-2 rounded mt-2"
                    />
                  </div>
                )}

              </>
            )}
            {step === 6 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3">Presentation Video</h1>
                <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full bg-gray-800 text-white p-2 rounded" />
              {/* Video Preview */}
              {videoPreview && (
                <div className="bg-white" style={{width:"530px", height: "300px"
                }}>
                <video controls className="w-full h-full mt-4 rounded-lg">
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              )}

              </>
            )}
            <div className="flex justify-between mt-4">
              {step > 1 && <button onClick={handlePrev} className="px-4 py-2 bg-gray-600 rounded">Back</button>}
              {step < 6 ? (
                <button onClick={handleNext} className="px-4 py-2 bg-green-600 rounded">Next</button>
              ) : (
                <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 rounded">Submit</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Form;
