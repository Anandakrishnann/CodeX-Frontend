import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userAxios } from "../../../../../../axiosConfig";

const Certificate = () => {
  const courseId = useSelector((state) => state.user.courseId);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!courseId) {
        setError("Course ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await userAxios.get(`certificate/${courseId}/`, {
          responseType: "blob", // ✅ FIXED
        });

        const imageUrl = URL.createObjectURL(response.data);
        setCertificateUrl(imageUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certificate:", error.response || error);
        setError(
          error.response?.status === 403
            ? "You have not completed this course."
            : "Error fetching certificate"
        );
        setLoading(false);
      }
    };

    fetchCertificate();

    // Cleanup the object URL on component unmount
    return () => {
      if (certificateUrl) {
        URL.revokeObjectURL(certificateUrl);
      }
    };
  }, [courseId]);

  const handleDownload = () => {
    if (certificateUrl) {
      const link = document.createElement("a");
      link.href = certificateUrl;
      link.download = `certificate_course_${courseId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-8 min-h-screen relative z-10 text-white">
      <div className="max-w-7xl mx-auto">
        {/* <h2 className="text-5xl font-extrabold text-white mb-8">
          Your Certificate
        </h2> */}

        {loading && (
          <div className="text-center text-xl">Loading certificate...</div>
        )}

        {error && (
          <div className="text-center text-xl text-red-500">{error}</div>
        )}

        {certificateUrl && !loading && !error && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <img
              src={certificateUrl}
              alt="Course Certificate"
              className="w-full max-w-4xl mx-auto"
            />
            <div className="mt-6 text-center">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
              >
                Download Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificate;
