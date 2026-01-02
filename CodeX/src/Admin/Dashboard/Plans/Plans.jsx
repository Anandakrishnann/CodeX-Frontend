"use client";

import { useEffect, useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Layout from "../Layout/Layout";
import { toast } from "react-toastify";
import { adminAxios } from "../../../../axiosConfig";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { X, DollarSign, FileText, Tag, Calendar } from "lucide-react";
import Loading from "@/User/Components/Loading/Loading";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Tooltip from "@mui/material/Tooltip";

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
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const response = await adminAxios.post("create-plan/", formData);
        toast.success("Plan Created Successfully");
        setPlan((prev) => [...prev, response.data]);
        setIsModalOpen(false);
      }
    } catch (e) {
      toast.error("Error When Fetching Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("list-plan/");
      setPlan(response.data);
    } catch (e) {
      toast.error("Error When Fetching Data");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await adminAxios.post(`delete-plan/${id}/`);
      toast.success("Plan Deleted Successfully");
      fetchPlans();
    } catch (error) {
      toast.error("Failed to delete plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen  from-slate-50 via-gray-100 to-slate-200 p-6">
          {/* Overview Section */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
              <h2 className="text-4xl font-bold text-white">
                Subscription Plans
              </h2>
              <button
                className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg shadow-lg hover:bg-slate-700 transform hover:scale-105 transition-all duration-200 border border-slate-200"
                onClick={() => setIsModalOpen(true)}
              >
                Create Plan
              </button>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-white flex items-center gap-3 mb-6">
                Active Plans
                <TrendingUpIcon fontSize="large" className="text-slate-600" />
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan &&
                plan.map((data, index) => (
                  <div
                    key={index}
                    className="relative bg-white border border-slate-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ease-out flex flex-col justify-between min-h-[380px] group"
                  >
                    {data.is_active ? (
                      <Tooltip title="Delete" arrow>
                        <button
                          className="absolute top-4 right-4 bg-red-500 text-white font-medium p-2 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => handleDelete(data.id)}
                        >
                          <DeleteForeverIcon fontSize="small" />
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Restore" arrow>
                        <button
                          className="absolute top-4 right-4 bg-green-500 text-white font-medium p-2 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => handleDelete(data.id)}
                        >
                          <RestoreFromTrashIcon fontSize="small" />
                        </button>
                      </Tooltip>
                    )}

                    <div>
                      <div className="mb-5">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                          {data.name}
                          <VerifiedIcon className="text-slate-600" />
                        </h2>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium bg-slate-100 px-3 py-1 rounded-full inline-block">
                          {data.plan_type}
                        </p>
                      </div>

                      <div className="mb-5">
                        <span className="inline-block px-3 py-1 bg-slate-800 text-white text-xs font-medium rounded-full uppercase tracking-wide shadow-sm">
                          {data.plan_category}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {data.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <h2 className="text-3xl font-bold text-slate-800">
                        ${data.price}
                      </h2>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden border-2 border-black">
            {/* Header */}
            <div className="bg-black px-6 py-5 border-b-2 border-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                    <Tag className="w-5 h-5 text-black" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Create Plan</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all duration-200 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-5 max-h-[500px] overflow-y-auto">
              {/* Name Field */}
              <div className="mb-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-green-500 mb-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  Plan Name
                </span>
                <input
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none bg-white text-black placeholder-gray-400 font-medium"
                  placeholder="Enter plan name"
                  onChange={handleChange}
                />
              </div>

              {/* Plan Category */}
              <div className="mb-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-green-500 mb-3">
                  <Tag className="w-4 h-4 text-green-500" />
                  Plan Category
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {["BASIC", "PRO", "PREMIUM"].map((cat) => (
                    <label
                      key={cat}
                      className={`relative cursor-pointer rounded-xl p-3 text-center text-sm font-bold transition-all border-2 ${
                        formData.plan_category === cat
                          ? "bg-green-500 text-black border-green-500 shadow-lg"
                          : "bg-white text-black border-black hover:border-green-500 hover:bg-green-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan_category"
                        value={cat}
                        className="sr-only"
                        onChange={handleChange}
                        checked={formData.plan_category === cat}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Plan Type */}
              <div className="mb-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-green-500 mb-3">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Billing Cycle
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {["MONTHLY", "YEARLY"].map((type) => (
                    <label
                      key={type}
                      className={`relative cursor-pointer rounded-xl p-3 text-center text-sm font-bold transition-all border-2 ${
                        formData.plan_type === type
                          ? "bg-green-500 text-black border-green-500 shadow-lg"
                          : "bg-white text-black border-black hover:border-green-500 hover:bg-green-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan_type"
                        value={type}
                        className="sr-only"
                        onChange={handleChange}
                        checked={formData.plan_type === type}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-green-500 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Price
                </span>
                <div className="relative">
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 pl-10 border-2 border-black rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none bg-white text-black placeholder-gray-400 font-medium"
                    placeholder="0.00"
                    onChange={handleChange}
                  />
                  <DollarSign className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <span className="flex items-center gap-2 text-sm font-semibold text-green-500 mb-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  Description
                </span>
                <textarea
                  name="description"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none bg-white resize-none text-black placeholder-gray-400 font-medium"
                  rows={3}
                  placeholder="Describe your plan features..."
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black border-t-2 border-black flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 text-black bg-white border-2 border-white rounded-xl hover:bg-gray-100 transition-all font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-green-500 text-black rounded-xl hover:bg-green-400 transition-all font-bold shadow-lg"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Plans;
