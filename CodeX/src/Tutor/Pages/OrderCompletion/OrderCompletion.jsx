import BackgroundAnimation from "../../../Component/BackgroundAnimation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSubscribedTrue } from "@/redux/slices/userSlice";

const OrderCompletion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    } 

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const home = () => {
    dispatch(setSubscribedTrue())
    navigate("/tutor");
  };

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen  from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full  rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
          <div className="p-8">
            {/* Success Icon with Animation */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Outer circle with pulse animation */}
                <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>

                {/* Inner circle */}
                <div className="relative bg-green-500 rounded-full p-5 shadow-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns=""
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-300 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-40 right-10 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-20 left-20 w-4 h-4 bg-blue-300 rounded-full animate-bounce delay-500"></div>

            {/* Content */}
            <div className="text-center mt-8">
              <h1 className="text-4xl font-extrabold text-white mb-4 animate-fadeIn">
                Done!
              </h1>
              <p className="text-lg text-white mb-8 animate-fadeIn delay-200">
                Your Application is sent, It usually takes 2-3 days. We'll
                notify you.
              </p>

              {/* Order details card */}
              <div className="bg-green-500 rounded-xl p-6 text-white mb-8 relative overflow-hidden">
                {/* Decorative shapes */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-white opacity-20 rounded-full"></div>
                <div className="absolute top-10 left-4 w-2 h-2 bg-white opacity-20 transform rotate-45"></div>
                <div className="absolute bottom-4 right-8 w-3 h-3 bg-white opacity-20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 w-6 h-1 bg-white opacity-20 transform rotate-45"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white rounded-full p-3">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-semibold uppercase tracking-wider">
                    Thank You
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  className="px-8 py-3 bg-white text-black cursor-pointer font-medium rounded-lg shadow-md hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center"
                  onClick={home}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                  Home
                </a>
                {/* <a
                href="/track"
                className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
                Dashboard
              </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderCompletion;
