import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { adminAxios } from "../../../../axiosConfig";
import BackgroundAnimation from "../../../Component/BackgroundAnimation";
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
  const [loading, setLoading] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const user = useSelector((state) => state.user.user.email);
  const navigate = useNavigate();

  const totalSteps = 6;
  const progressPercentage = (step / totalSteps) * 100;

  const sanitizeInput = (value) => {
    return value
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/[\{\}\[\]]/g, "")
      .trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/<[^>]*script|<[^>]+>/.test(value)) {
      toast.error("HTML or script tags are not allowed.");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let isValid = true;
    if (step === 1) {
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
    }
    if (step === 2) {
      const fields = ["education", "expertise", "occupation"];
      for (let field of fields) {
        if (!formData[field].trim()) {
          toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
          isValid = false;
        }
      }
      if (!/^\d+$/.test(formData.experience)) {
        toast.error("Experience should be a valid number");
        isValid = false;
      }
    }
    if (step === 3) {
      if (formData.about.length < 50) {
        toast.error("About section must be at least 50 characters");
        isValid = false;
      }
    }
    if (step === 4 && !formData.profilePicture) {
      toast.error("Upload a profile picture");
      isValid = false;
    }
    if (step === 5 && !formData.verificationFile) {
      toast.error("Upload a verification document");
      isValid = false;
    }
    if (step === 6 && !formData.verificationVideo) {
      toast.error("Upload a verification video");
      isValid = false;
    }
    return isValid;
  };

  const handleProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

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

  const handlePrev = () => setStep(step - 1);
  const handleNext = () => {
    if (validate()) setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const cleanedData = {
      ...formData,
      fullName: sanitizeInput(formData.fullName),
      education: sanitizeInput(formData.education),
      expertise: sanitizeInput(formData.expertise),
      occupation: sanitizeInput(formData.occupation),
      about: sanitizeInput(formData.about),
    };
    const formDataToSend = new FormData();
    formDataToSend.append("full_name", cleanedData.fullName);
    formDataToSend.append("email", user);
    formDataToSend.append("phone", cleanedData.phone);
    formDataToSend.append("dob", cleanedData.dob);
    formDataToSend.append("education", cleanedData.education);
    formDataToSend.append("expertise", cleanedData.expertise);
    formDataToSend.append("occupation", cleanedData.occupation);
    formDataToSend.append("experience", cleanedData.experience);
    formDataToSend.append("about", cleanedData.about);
    formDataToSend.append("profile_picture", cleanedData.profilePicture);
    formDataToSend.append("verification_file", cleanedData.verificationFile);
    formDataToSend.append("verification_video", cleanedData.verificationVideo);

    try {
      const response = await adminAxios.post("applications/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        toast.success("Application submitted successfully!");
        navigate("/tutor/order-complete");
      }
    } catch (error) {
      toast.error("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <BackgroundAnimation />
      <div
        className="min-h-screen p-6 bg-none text-green-500 relative z-10"
        style={{ marginTop: "100px" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Submit Your Application
          </h1>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 mt-10">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 text-white rounded-lg shadow-lg relative overflow-hidden"
          >
            <h2 className="text-2xl font-extrabold font-serif mb-4">
              Step {step} of 6
            </h2>
            {step === 1 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3 border-green-500">
                  Personal Information
                </h1>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full p-2 text-black  mb-3 rounded bg-white"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-2 text-black mb-3 rounded bg-white"
                  required
                />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  placeholder="DOB"
                  className="w-full p-2 text-black mb-3 rounded bg-white"
                />
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3">
                  Professional Information
                </h1>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Highest Education level"
                  className="w-full p-2 mb-3 text-black rounded bg-white"
                />
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="Area of expertise"
                  className="w-full p-2 mb-3 text-black rounded bg-white"
                />
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Current Occupation"
                  className="w-full p-2 mb-3 text-black rounded bg-white"
                />
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Experience"
                  className="w-full p-2 mb-3 text-black rounded bg-white"
                />
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3">
                  About Yourself
                </h1>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Describe yourself..."
                  className="w-full p-2 h-24 mb-3 text-black rounded bg-white"
                ></textarea>
              </>
            )}
            {step === 4 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-3">
                  Profile Picture
                </h1>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleProfilePicture}
                  className="w-full p-2 mb-3"
                />
                {formData.profilePicture && (
                  <img
                    src={profilePicturePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 mt-2 rounded bg-white"
                  />
                )}
              </>
            )}
            {step === 5 && (
              <>
                <h1 className="text-3xl font-serif font-semibold mb-5">
                  Verification Documents
                </h1>
                <h1 className="text-3xl font-serif font-semibold mb-3">
                  Document
                </h1>
                {["ID Verification", "Identity Proof", "Professional Cert", "Resume"].map(
                  (docType) => (
                    <button
                      key={docType}
                      type="button"
                      className={`p-2 rounded text-sm ml-4 ${
                        selectedDocumentType === docType
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 text-white"
                      }`}
                      onClick={() => setSelectedDocumentType(docType)}
                    >
                      {docType}
                    </button>
                  )
                )}
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
                <h1 className="text-3xl font-serif font-semibold mb-3">
                  Presentation Video
                </h1>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                />
                {videoPreview && (
                  <div
                    className="bg-white"
                    style={{ width: "530px", height: "300px" }}
                  >
                    <video controls className="w-full h-full mt-4 rounded-lg">
                      <source src={videoPreview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
                >
                  Back
                </button>
              )}
              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-4 py-2 rounded transition ${
                    loading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-50 rounded-lg">
                <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white mt-4 text-lg font-semibold">
                  Uploading files... Please wait
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Form;
