import React, { useEffect, useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Layout from "../Layout/Layout";
import { toast } from "react-toastify";
import { adminAxios } from "../../../../axiosConfig";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Plans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plan, setPlan] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    plan_category: "",
    plan_type: "",
    price: "",
    description: "",
  });
  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      toast.error("Name is required");
    }

    if (!formData.plan_category) {
      errors.plan_category = "Category is required";
      toast.error("Category is required");
    }

    if (!formData.plan_type) {
      errors.plan_type = "Plan type is required";
      toast.error("Plan type is required");
    }

    if (!formData.price) {
      errors.price = "Price is required";
      toast.error("Price is required");
    } else if (isNaN(formData.price)) {
      errors.price = "Price must be a number";
      toast.error("Price must be a number");
    } else if (Number(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
      toast.error("Price must be greater than 0");
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      toast.error("Description is required");
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm(formData)) {
        const response = await adminAxios.post("create_plan/", formData);
        toast.success("Plan Created Successfully");
        setPlan((prev) => [...prev, response.data]);
        setIsModalOpen(false);
      }
    } catch (e) {
      toast.error("Error When Fetching Data");
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await adminAxios.get("list_plan/");
        setPlan(response.data);
      } catch (e) {
        toast.error("Error When Fetching Data");
      }
    };
    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`delete_plan/${id}/`);
      toast.success("Plan Deleted Successfully");
      setPlan(plan.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <Layout>
      <div className="grid  gap-6">
        {/* Overview Section */}
        <div className="row-span-1 p-4 rounded-lg ">
          <div className="flex">
            <h2 className="text-4xl font-extrabold mb-3">Subscription Plans</h2>
            <button
              className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-3 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2"
              style={{ width: "100px", marginLeft: "610px" }}
              onClick={() => setIsModalOpen(true)}
            >
              Create
            </button>
          </div>
          <div className="text-3xl font-extrabold m-4">
            <h1>
              Active Plans <TrendingUpIcon fontSize="large" />
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {plan &&
              plan.map((data, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500 shadow-xl rounded-2xl p-6 text-white w-full max-w-sm mx-auto hover:scale-[1.02] transition-transform duration-300 ease-in-out flex flex-col justify-between h-96"
                >
                  {/* Delete button placed absolutely at the top-right corner */}
                  {/* <button
                    className="absolute top-4 right-4 bg-green-500 text-white font-bold p-2 rounded-md hover:bg-white hover:text-green-600 transition-all duration-200 border border-transparent hover:border-green-500"
                    title="Delete Plan"
                    onClick={() => handleDelete(data.id)} // Add this function
                  >
                    <DeleteForeverIcon />
                  </button> */}

                  <div>
                    <div className="mb-4">
                      <h2 className="text-3xl font-bold text-green-400">
                        {data.name} <VerifiedIcon />
                      </h2>
                      <p className="text-sm text-gray-300 uppercase tracking-wider">
                        {data.plan_type}
                      </p>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-green-600 text-xs font-semibold rounded-full uppercase tracking-widest">
                        {data.plan_category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{data.description}</p>
                  </div>

                  <div className="mt-auto pt-2">
                    <h2 className="text-4xl font-bold text-green-300">
                      ₹{data.price}
                    </h2>
                  </div>
                </div>
              ))}
          </div>
          {/* <div className="text-3xl font-extrabold m-4">
                  <h1>Deleted Plans <TrendingDownIcon fontSize="large"/></h1>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-2 rounded text-center border border-green-500">
                    <h2 className="text-2xl font-extrabold mb-6">BASIC</h2>
                    <p className="text-sm text-green-400">+4.4%</p>
                    <p className="text-2xl font-bold">$56,242.00</p>
                    <p>Income</p>
                    <button className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-3 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2" style={{width:"80px"}} >Edit</button>
                  </div>
                  <div className="bg-gray-700 p-2 rounded text-center border border-green-500">
                  <h2 className="text-2xl font-extrabold mb-6">PRO</h2>
                    <p className="text-sm text-green-400">+4.4%</p>
                    <p className="text-2xl font-bold">$56,242.00</p>
                    <p>Spending</p>
                    <button className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-3 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2" style={{width:"80px"}}>Edit</button>
                  </div>
                  <div className="bg-gray-700 p-2 rounded text-center border border-green-500">
                  <h2 className="text-2xl font-extrabold mb-6">PREMIUM</h2>
                    <p className="text-sm text-green-400">+4.4%</p>
                    <p className="text-2xl font-bold">$56,242.00</p>
                    <p>Net Profit</p>
                    <button className="text-xl bg-green-500 p-1 rounded-md font-extrabold m-3 border border-white hover:text-black hover:bg-white hover:border-green-500 hover:border-2" style={{width:"80px"}}>Edit</button>
                  </div>
                </div> */}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative"
            style={{ height: "600px" }}
          >
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-2xl text-black font-semibold mb-4 relative z-10 ">
              Create Plan
            </h2>

            <div className="mb-3">
              <label className="block text-gray-600">Name</label>
              <input
                name="name"
                type="text"
                className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100"
                onChange={handleChange}
              />
            </div>

            {/* Plan Category */}
            {/* Plan Category */}
            <div className="mb-3">
              <label className="block text-gray-600 mb-1">Plan Category</label>
              <div className="flex gap-4">
                {["BASIC", "PRO", "PREMIUM"].map((cat) => (
                  <label
                    key={cat}
                    className={`rounded-lg p-2 cursor-pointer ${
                      formData.plan_category === cat
                        ? "bg-black text-white"
                        : "text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan_category"
                      value={cat}
                      className="mr-1"
                      onChange={handleChange}
                      checked={formData.plan_category === cat}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Plan Type */}
            <div className="mb-3">
              <label className="block text-gray-600 mb-1">Plan Type</label>
              <div className="flex gap-4">
                {["MONTHLY", "YEARLY"].map((type) => (
                  <label
                    key={type}
                    className={`rounded-lg p-2 cursor-pointer ${
                      formData.plan_type === type
                        ? "bg-black text-white"
                        : "text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan_type"
                      value={type}
                      className="mr-1 accent-black"
                      onChange={handleChange}
                      checked={formData.plan_type === type}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="block text-gray-600">Price ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100"
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-gray-600">Description</label>
              <textarea
                name="description"
                className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100"
                rows="3"
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <button
              className="absolute end right text-xl font-bold text-white hover:bg-red-600 bg-red-800 m-3 p-1 mt-4 rounded-md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="absolute end-2 right-2 text-xl font-bold text-white hover:bg-green-600 m-4 p-1 rounded-md bg-green-800"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Plans;
