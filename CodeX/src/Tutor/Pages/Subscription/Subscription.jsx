import React, { useEffect, useState } from "react";
import BackgroundAnimation from "../../../Component/BackgroundAnimation";
import Navbar from "../Navbar/Navbar";
import { adminAxios, userAxios } from "../../../../axiosConfig";
import { toast } from "react-toastify";

const Subscription = () => {
  const [plan, setPlan] = useState([]);
  console.log(plan);

  const handleSubscribe = async (id) => {
    try {
      const response = await userAxios.post(`create-checkout-session/${id}/`);
      toast.success("Subscription Request Sended");
      window.location.href = response.data.checkout_url;
    } catch (e) {
      toast.error("Error While Subscription");
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await adminAxios.get("list-plan/");
        setPlan(response.data);
      } catch (e) {
        toast.error("Error When Fetching Data");
      }
    };
    fetchPlans();
  }, []);

  return (
    <>
      <Navbar />
      <BackgroundAnimation />
      <div className="flex flex-col h-screen text-white relative z-10">
        {/* Content */}
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Step 3: Select Plan */}
            <div className="text-center mt-10">
              <h2 className="text-5xl font-bold text-green-400 mb-8">
                Choose Your Plan
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {plan &&
                  plan.map((data, index) => (
                    <div
                      className="relative p-6 rounded-2xl cursor-pointer transition transform hover:scale-105 border border-green-700 bg-gray-800/60 backdrop-blur-md shadow-xl flex flex-col"
                      style={{ height: "500px" }}
                      key={index}
                    >
                      {/* Plan Name */}
                      <h3 className="text-2xl font-extrabold text-green-400 mb-1 mt-2">
                        {data.name}
                      </h3>

                      {/* Plan Category Badge */}
                      <span className="inline-block mb-2 mt-2 px-3 py-1 bg-green-600/20 text-green-300 text-lg font-semibold rounded-full uppercase tracking-wide">
                        {data.plan_category}
                      </span>

                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4 mt-5 flex-grow">
                        {data.description}
                      </p>

                      {/* Price */}
                      <div className="text-3xl font-bold text-white mb-4">
                        ₹{data.price}
                        <span className="text-sm text-gray-400 ml-1">
                          /{data.plan_type.toLowerCase()}
                        </span>
                      </div>

                      {/* Subscribe Button */}
                      <div className="w-full">
                        <button
                          className="w-full bg-gradient-to-r bg-green-500 hover:bg-white hover:text-black px-4 py-2 rounded-lg text-white font-semibold transition-all cursor-pointer"
                          onClick={() => handleSubscribe(data.id)}
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
