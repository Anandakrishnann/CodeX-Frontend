import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import {
  Wallet,
  DollarSign,
  Calendar,
  Check,
  X,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { adminAxios, tutorAxios } from "../../../../../axiosConfig";
import { toast } from "react-toastify";
import Loading from "@/User/Components/Loading/Loading";

const TutorWallet = () => {
  const [walletAmount, setWalletAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [filteredPayoutRequests, setFilteredPayoutRequests] = useState([]);
  const [viewMode, setViewMode] = useState("transactions");
  const [filter, setFilter] = useState("Paid");
  const [isPending, setIsPending] = useState(0);
  const [isAccepted, setIsAccepted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutFormData, setPayoutFormData] = useState({
    upiId: "",
    bankName: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [currentPayoutPage, setCurrentPayoutPage] = useState(1);
  const tutor = useSelector((state) => state.user.user);

  const itemsPerPage = 6;

  console.log("payouts", payoutRequests);

  useEffect(() => {
    fetchWalletDashboard();
    fetchPayoutRequests();
  }, []);

  useEffect(() => {
    setCurrentTransactionPage(1);
  }, [viewMode]);

  useEffect(() => {
    setCurrentPayoutPage(1);
  }, [filter]);

  const fetchWalletDashboard = async () => {
    try {
      setLoading(true);
      const response = await tutorAxios.get("wallet-dashboard/");
      const data = response.data;

      setWalletAmount(data.balance || 0);
      setTransactions(
        Array.isArray(data.transactions) ? data.transactions : []
      );
      setTotalEarned(data.total_earned || 0);
      setTotalRedeemed(data.total_redeemed || 0);
    } catch (error) {
      console.error("Error fetching wallet dashboard:", error);
      toast.error("Error fetching wallet dashboard");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      setLoading(true);
      const response = await tutorAxios.get("payout-requests/");
      setPayoutRequests(response.data);
    } catch (error) {
      console.error("Error fetching payout requests:", error);
      toast.error("Error While fetching payouts requests");
      setPayoutRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutChange = (e) => {
    const { name, value } = e.target;
    setPayoutFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayoutSubmit = async () => {
    try {
      setLoading(true);
      const { upiId, bankName, amount } = payoutFormData;

      const upiRegex = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/;

      if (walletAmount < amount) {
        toast.error("Insufficient Balance Enter Valid Amount");
        return;
      }

      if (Number(amount) < 10) {
        toast.error("Minimum withdrawal amount is $10");
        return;
      }

      if (!upiId.trim()) {
        toast.error("UPI ID is required");
        return;
      }
      if (!upiRegex.test(upiId)) {
        toast.error("Invalid UPI ID format");
        return;
      }

      if (!bankName.trim()) {
        toast.error("Bank Name is required");
        return;
      }

      if (!amount.trim()) {
        toast.error("Amount is required");
        return;
      }
      if (isNaN(amount) || Number(amount) <= 0) {
        toast.error("Enter a valid withdrawal amount");
        return;
      }

      const data = {
        upi_id: upiId,
        bank_name: bankName,
        amount: amount,
      };

      await tutorAxios.post("request-payout/", data);
      toast.success("Payout Request Submitted Successfully");

      setPayoutFormData({ upiId: "", bankName: "", amount: "" });
      setIsPayoutModalOpen(false);
      fetchPayoutRequests();
      fetchWalletDashboard();
    } catch (error) {
      console.error("Error submitting payout:", error);
      const errorMessage =
        error.response?.data?.error || "Error while Requesting Payout";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayoutCancel = (payoutId) => {
    Swal.fire({
      title: "Cancel Payout Request?",
      text: "Are you sure you want to cancel this payout request? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No, Keep It",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handlePayoutCancel(payoutId);
      }
    });
  };

  const handlePayoutCancel = async (id) => {
    try {
      setLoading(true);

      await tutorAxios.post("cancel-payout/", { request_id: id });

      toast.success("Payout request cancelled successfully");

      fetchPayoutRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Something went wrong while cancelling the payout"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Array.isArray(payoutRequests)) {
      console.warn("payoutRequests is not an array:", payoutRequests);
      setFilteredPayoutRequests([]);
      return;
    }

    const pending = payoutRequests.filter((t) => t.status === "PENDING").length;
    const accepted = payoutRequests.filter((t) => t.status === "PAID").length;
    const rejected = payoutRequests.filter(
      (t) => t.status === "REJECTED"
    ).length;

    const result = payoutRequests.filter((requests) => {
      if (filter === "PAID") return requests.status === "PAID";
      return requests.status === filter;
    });

    setFilteredPayoutRequests(result);
    console.log("result", result);

    setIsPending(pending);
    setIsAccepted(accepted);
    setIsRejected(rejected);
  }, [payoutRequests, filter]);

  // Pagination calculations for transactions
  const totalTransactionPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastTransaction = currentTransactionPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Pagination calculations for payouts
  const totalPayoutPages = Math.ceil(filteredPayoutRequests.length / itemsPerPage);
  const indexOfLastPayout = currentPayoutPage * itemsPerPage;
  const indexOfFirstPayout = indexOfLastPayout - itemsPerPage;
  const currentPayouts = filteredPayoutRequests.slice(indexOfFirstPayout, indexOfLastPayout);

  const handleTransactionPageChange = (pageNumber) => {
    setCurrentTransactionPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handlePayoutPageChange = (pageNumber) => {
    setCurrentPayoutPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const renderPagination = (currentPage, totalPages, onPageChange) => {
    ;

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            currentPage === 1
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-green-500 hover:text-white border-2 border-white"
          }`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === pageNumber
                    ? "bg-white text-black shadow-lg scale-110"
                    : "bg-gray-800 text-white hover:bg-green-500/50 border-2 border-white"
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          
          if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <span key={pageNumber} className="px-2 text-gray-500">
                ...
              </span>
            );
          }
          
          return null;
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            currentPage === totalPages
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-green-500 hover:text-white border-2 border-white"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <Layout page="Wallet">
      {loading ? (
        <Loading />
      ) : (
        <div className="p-8 min-h-screen relative z-10 text-white">
          <div className="max-w-7xl mx-auto">
            {/* Wallet Balance Card */}
            <div className="mb-8 bg-green-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <Wallet className="text-black" size={32} />
                      </div>
                      <div>
                        <p className="text-black/80 text-lg font-medium">
                          Current Balance
                        </p>
                        <h1 className="text-5xl font-extrabold text-black">
                          ${walletAmount.toFixed(2)}
                        </h1>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPayoutModalOpen(true)}
                      className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black border-2 border-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <DollarSign className="inline mr-2" size={20} />
                      Request Payout
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-black/70 text-sm font-medium">
                          Total Earned
                        </p>
                        <ArrowUpRight className="text-black" size={20} />
                      </div>
                      <p className="text-3xl font-bold text-black">
                        ${totalEarned.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-black/70 text-sm font-medium">
                          Total Redeemed
                        </p>
                        <ArrowDownRight className="text-black" size={20} />
                      </div>
                      <p className="text-3xl font-bold text-black">
                        ${totalRedeemed.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="mb-10 flex justify-center space-x-4">
              <button
                className={`text-xl font-bold px-8 py-3 ${
                  viewMode === "transactions"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                } rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300`}
                onClick={() => setViewMode("transactions")}
              >
                <TrendingUp className="inline mr-2" size={20} />
                Earning's
                <span className="bg-blue-400 text-white rounded-full px-3 py-1 ml-2">
                  {transactions.length}
                </span>
              </button>

              <button
                className={`text-xl font-bold px-8 py-3 ${
                  viewMode === "payouts"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                } rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300`}
                onClick={() => setViewMode("payouts")}
              >
                <DollarSign className="inline mr-2" size={20} />
                Payout's
                <span className="bg-purple-400 text-white rounded-full px-3 py-1 ml-2">
                  {payoutRequests.length}
                </span>
              </button>
            </div>

            {/* Filter Buttons - Only show when viewing payouts */}
            {viewMode === "payouts" && (
              <div className="mb-10 flex justify-center space-x-4">
                <button
                  className={`text-xl font-bold px-8 py-3 ${
                    filter === "PENDING"
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  } rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300`}
                  onClick={() => setFilter("PENDING")}
                >
                  <Clock className="inline mr-2" size={20} />
                  Pending
                  <span className="bg-yellow-400 text-black rounded-full px-3 py-1 ml-2">
                    {isPending}
                  </span>
                </button>
                <button
                  className={`text-xl font-bold px-8 py-3 ${
                    filter === "PAID"
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  } rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300`}
                  onClick={() => setFilter("PAID")}
                >
                  <Check className="inline mr-2" size={20} />
                  Accepted
                  <span className="bg-green-500 text-white rounded-full px-3 py-1 ml-2">
                    {isAccepted}
                  </span>
                </button>
                <button
                  className={`text-xl font-bold px-8 py-3 ${
                    filter === "REJECTED"
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  } rounded-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300`}
                  onClick={() => setFilter("REJECTED")}
                >
                  <X className="inline mr-2" size={20} />
                  Rejected
                  <span className="bg-red-500 text-white rounded-full px-3 py-1 ml-2">
                    {isRejected}
                  </span>
                </button>
              </div>
            )}

            {/* Transactions/Payouts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {viewMode === "transactions" ? (
                // Display paginated transactions
                currentTransactions && currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                    >
                      <div className="h-2 w-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 group-hover:h-3"></div>

                      <div className="p-6 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                              {transaction.type || "Transaction"}
                            </h3>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-blue-100 text-blue-800">
                              {transaction.transaction_type || "Earning"}
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
                                ${transaction.amount}
                              </span>
                            </div>

                            {transaction.description && (
                              <div className="flex items-center text-gray-700">
                                <span className="font-medium text-gray-900">
                                  Description:
                                </span>
                                <span className="ml-2 text-gray-700">
                                  {transaction.description}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center text-gray-600">
                              <Calendar
                                size={16}
                                className="mr-2 text-green-500"
                              />
                              <span className="text-xs font-medium">
                                {new Date(
                                  transaction.created_at
                                ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Wallet className="mx-auto mb-4 text-gray-400" size={64} />
                    <p className="text-gray-400 text-xl">
                      No transactions found
                    </p>
                  </div>
                )
              ) : // Display paginated payout requests
              currentPayouts && currentPayouts.length > 0 ? (
                currentPayouts.map((payout, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <div
                      className={`h-2 w-full transition-all duration-300 group-hover:h-3 ${
                        payout.status === "PENDING"
                          ? "bg-yellow-400"
                          : payout.status === "PAID"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>

                    <div className="p-4 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            Payout Request
                          </h3>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                              payout.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : payout.status === "PAID"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payout.status}
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
                              ${payout.amount}
                            </span>
                          </div>

                          {payout.upi_id && (
                            <div className="flex items-center text-gray-700">
                              <span className="font-medium text-gray-900">
                                UPI:
                              </span>
                              <span className="ml-2 text-gray-700">
                                {payout.upi_id}
                              </span>
                            </div>
                          )}

                          {payout.bank_name && (
                            <div className="flex items-center text-gray-700">
                              <span className="font-medium text-gray-900">
                                Bank:
                              </span>
                              <span className="ml-2 text-gray-700">
                                {payout.bank_name}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center text-gray-600">
                            <Calendar
                              size={16}
                              className="mr-2 text-green-500"
                            />
                            <span className="text-xs font-medium">
                              {new Date(payout.requested_at).toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-end mt-6">
                            {payout.status === "PENDING" && (
                              <button
                                onClick={() => confirmPayoutCancel(payout.id)}
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                              >
                                <X className="inline mr-2" size={18} />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <DollarSign
                    className="mx-auto mb-4 text-gray-400"
                    size={64}
                  />
                  <p className="text-gray-400 text-xl">
                    No payout requests found
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {viewMode === "transactions" 
              ? renderPagination(currentTransactionPage, totalTransactionPages, handleTransactionPageChange)
              : renderPagination(currentPayoutPage, totalPayoutPages, handlePayoutPageChange)
            }
          </div>

          {/* Payout Modal */}
          {isPayoutModalOpen && (
            <div className="fixed inset-0 font-sans backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl relative w-full max-w-md border border-gray-200 dark:border-gray-700 animate-slideUp">
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => setIsPayoutModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Header */}
                <div className="mb-6 pb-4 border-b border-green-200 dark:border-green-700">
                  <div className="bg-gradient-to-r from-green-600 to-green-400 text-transparent bg-clip-text">
                    <h2 className="text-3xl font-extrabold mb-1">
                      Request Payout
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your UPI details to request a payout
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      UPI ID
                    </label>
                    <input
                      name="upiId"
                      type="text"
                      value={payoutFormData.upiId}
                      placeholder="e.g. yourname@upi"
                      className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      onChange={handlePayoutChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bank Name
                    </label>
                    <input
                      name="bankName"
                      type="text"
                      value={payoutFormData.bankName}
                      placeholder="e.g. State Bank of India"
                      className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      onChange={handlePayoutChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </label>
                    <input
                      name="amount"
                      type="number"
                      value={payoutFormData.amount}
                      placeholder="Min: $10"
                      className="w-full p-3 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      onChange={handlePayoutChange}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-all duration-200"
                      onClick={() => setIsPayoutModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg text-white bg-green-600 font-bold hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      onClick={handlePayoutSubmit}
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default TutorWallet;