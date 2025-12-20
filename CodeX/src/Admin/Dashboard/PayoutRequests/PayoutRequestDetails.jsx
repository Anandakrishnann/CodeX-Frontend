import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Calendar,
  Check,
  X,
  Clock,
  User,
  Building2,
  CreditCard,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import Layout from "../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { adminAxios } from "../../../../axiosConfig";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const PayoutRequestDetails = () => {
  const [viewMode, setViewMode] = useState("earnings");
  const [transactions, setTransactions] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [tutorData, setTutorData] = useState(null);

  const requestId = useSelector((state) => state.user.payoutRequestId);

  const navigate = useNavigate();

  useEffect(() => {
    tutorWalletDetails();
  }, []);

  const tutorWalletDetails = async () => {
    try {
      const response = await adminAxios.get(
        `payout-request-details/${requestId.id}`
      );

      setTutorData(response.data.tutor_data);
      setTransactions(response.data.transactions);
      setPayoutRequests(response.data.payout_requests);
    } catch (error) {
      toast.error(error.error || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="p-8 min-h-screen text-white">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-6xl font-extrabold mb-10 ">
            Tutor Wallet History
          </h1>

          <button
            className="text-xl font-bold px-5 py-2 ml-2 mb-6 mr-40 bg-white text-black rounded-lg border-2 border-white hover:bg-black hover:text-white transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          {/* Summary Boxes */}
          {/* Summary Boxes */}
          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Tutor Name Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 lg:col-span-1">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                    Tutor Name
                  </p>
                  <h2 className="text-3xl font-extrabold text-white mt-1 break-words">
                    {tutorData?.tutor_name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <TrendingUp size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                    Total Revenue
                  </p>
                  <h2 className="text-4xl font-extrabold text-white mt-1">
                    ${tutorData?.total_earned}
                  </h2>
                </div>
              </div>
            </div>

            {/* Total Redeemed Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <DollarSign size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                    Total Redeemed
                  </p>
                  <h2 className="text-4xl font-extrabold text-white mt-1">
                    ${tutorData?.total_redeemed}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet */}
          {/* Wallet Balance Card */}
          <div className="mb-10 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                      <Wallet size={40} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">
                        Current Wallet Balance
                      </p>
                      <h1 className="text-6xl font-extrabold text-white">
                        ${tutorData?.balance?.toFixed(2)}
                      </h1>
                    </div>
                  </div>

                  {/* Optional: Add a badge or indicator */}
                  <div className="hidden md:block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    <p className="text-white/80 text-xs uppercase tracking-wide">
                      Active
                    </p>
                    <p className="text-white text-2xl font-bold">✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Filter Buttons */}
          <div className="mb-10 flex justify-center space-x-4">
            <button
              className={`text-xl font-bold px-8 py-3 rounded-lg border-2 transition-all duration-300 
            ${
              viewMode === "earnings"
                ? "bg-white text-black"
                : "bg-black text-white border-white"
            }`}
              onClick={() => setViewMode("earnings")}
            >
              <TrendingUp className="inline mr-2" size={20} />
              Earning's
              <span className="bg-blue-400 text-white rounded-full px-3 py-1 ml-2">
                {transactions?.length}
              </span>
            </button>

            <button
              className={`text-xl font-bold px-8 py-3 rounded-lg border-2 transition-all duration-300 
            ${
              viewMode === "payouts"
                ? "bg-white text-black"
                : "bg-black text-white border-white"
            }`}
              onClick={() => setViewMode("payouts")}
            >
              <DollarSign className="inline mr-2" size={20} />
              Payout's
              <span className="bg-purple-400 text-white rounded-full px-3 py-1 ml-2">
                {payoutRequests?.length}
              </span>
            </button>
          </div>

          {/* Earnings List */}
          {viewMode === "earnings" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {transactions?.map((t) => (
                <div className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]">
                  <div className="h-2 w-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 group-hover:h-3"></div>

                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {t.type || "Transaction"}
                        </h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-blue-100 text-blue-800">
                          {t.transaction_type || "Earning"}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-700">
                          <DollarSign
                            size={16}
                            className="mr-2 text-green-500"
                          />
                          <span className="font-medium text-gray-900">
                            Amount:
                          </span>
                          <span className="ml-2 text-gray-700 font-bold">
                            ${t.amount}
                          </span>
                        </div>

                        {t.description && (
                          <div className="flex items-center text-gray-700">
                            <span className="font-medium text-gray-900">
                              Description:
                            </span>
                            <span className="ml-2 text-gray-700">
                              {t.description}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2 text-green-500" />
                          <span className="text-xs font-medium">
                            {new Date(t.created_at).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payout Requests List */}
          {viewMode === "payouts" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {payoutRequests?.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div
                    className={`h-2 w-full ${
                      p.status === "PENDING"
                        ? "bg-yellow-400"
                        : p.status === "PAID"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>

                  <div className="p-6">
                    <div className="flex justify-between items-start ">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 "></h3>
                      </div>
                      <span
                        className={`text-xs font-bold px-4 py-2 rounded-full ${
                          p.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : p.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-2">
                      <div className="flex items-center text-gray-700">
                        <DollarSign size={18} className="mr-3 text-green-500" />
                        <span className="font-medium">Amount:</span>
                        <span className="ml-2 text-2xl font-bold text-green-600">
                          ${p.amount}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <CreditCard size={18} className="mr-3 text-green-500" />
                        <span className="font-medium">UPI ID:</span>
                        <span className="ml-2 text-gray-900">{p.upi_id}</span>
                      </div>

                      {p.bank_name && (
                        <div className="flex items-center text-gray-700">
                          <Building2
                            size={18}
                            className="mr-3 text-green-500"
                          />
                          <span className="font-medium">Bank:</span>
                          <span className="ml-2 text-gray-900">
                            {p.bank_name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center text-gray-700">
                        <Calendar size={18} className="mr-3 text-green-500" />
                        <span className="font-medium">ped:</span>
                        <span className="ml-2 text-gray-900 text-sm">
                          {new Date(p.requested_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {p.processed_at && (
                        <div className="flex items-center text-gray-700">
                          <Calendar size={18} className="mr-3 text-green-500" />
                          <span className="font-medium">Processed:</span>
                          <span className="ml-2 text-gray-900 text-sm">
                            {new Date(p.processed_at).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PayoutRequestDetails;
