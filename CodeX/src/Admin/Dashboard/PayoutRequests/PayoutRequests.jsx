import React, { useEffect, useState } from "react";
import {
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
import { adminAxios } from "../../../../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPayoutRequestId } from "@/redux/slices/userSlice";
import Loading from "@/User/Components/Loading/Loading";
import Swal from "sweetalert2";

const PayoutRequests = () => {
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState("PENDING");
  const [isPending, setIsPending] = useState(0);
  const [isPaid, setIsPaid] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  const fetchPayoutRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("payout-requests/");
      setPayoutRequests(response.data.payout_requests);
    } catch (error) {
      toast.error(error.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Array.isArray(payoutRequests)) return;

    const pending = payoutRequests.filter((r) => r.status === "PENDING").length;
    const paid = payoutRequests.filter((r) => r.status === "PAID").length;
    const rejected = payoutRequests.filter(
      (r) => r.status === "REJECTED"
    ).length;

    setIsPending(pending);
    setIsPaid(paid);
    setIsRejected(rejected);

    let result = payoutRequests.filter((request) => request.status === filter);

    if (searchTerm) {
      result = result.filter(
        (request) =>
          request.tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.tutor.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.upi_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(result);
  }, [payoutRequests, filter, searchTerm]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setAdminNote(request.admin_note || "");
    setIsModalOpen(true);
  };

  const handleApprove = async (requestId) => {
    const result = await Swal.fire({
      title: "Approve Payout?",
      text: "Are you sure you want to approve this payout request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await adminAxios.post(`approve-payout-request/${requestId}/`, {
        admin_note: adminNote,
      });
      fetchPayoutRequests();
      setIsModalOpen(false);
      toast.success("Payout Request Accepted");
    } catch (error) {
      toast.error(error.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    const result = await Swal.fire({
      title: "Reject Payout?",
      text: "Are you sure you want to reject this payout request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await adminAxios.post(`reject-payout-request/${requestId}/`, {
        admin_note: adminNote,
      });
      fetchPayoutRequests();
      setIsModalOpen(false);
      toast.success("Payout Request Rejected");
    } catch (error) {
      toast.error(error.error || "Somethig went wrong");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedApps = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNavigate = (id) => {
    dispatch(setPayoutRequestId(id));
    navigate("/admin/payout-requests-details");
  };

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen  p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-extrabold text-white mb-2">
                Payout Requests
              </h1>
              <p className="text-gray-400 text-lg">
                Manage and process tutor payout requests
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">
                      Pending
                    </p>
                    <p className="text-4xl font-bold text-white mt-2">
                      {isPending}
                    </p>
                  </div>
                  <Clock className="text-yellow-100" size={48} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Paid</p>
                    <p className="text-4xl font-bold text-white mt-2">
                      {isPaid}
                    </p>
                  </div>
                  <Check className="text-green-100" size={48} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Rejected</p>
                    <p className="text-4xl font-bold text-white mt-2">
                      {isRejected}
                    </p>
                  </div>
                  <X className="text-red-100" size={48} />
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by tutor name, email, or UPI ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-8 flex justify-center space-x-4">
              <button
                className={`text-lg font-bold px-8 py-3 ${
                  filter === "PENDING"
                    ? "bg-white text-black"
                    : "bg-black text-white border-2 border-white"
                } rounded-xl hover:bg-white hover:text-black transition-all duration-300 shadow-lg`}
                onClick={() => setFilter("PENDING")}
              >
                <Clock className="inline mr-2" size={20} />
                Pending
                <span className="bg-yellow-400 text-black rounded-full px-3 py-1 ml-2">
                  {isPending}
                </span>
              </button>
              <button
                className={`text-lg font-bold px-8 py-3 ${
                  filter === "PAID"
                    ? "bg-white text-black"
                    : "bg-black text-white border-2 border-white"
                } rounded-xl hover:bg-white hover:text-black transition-all duration-300 shadow-lg`}
                onClick={() => setFilter("PAID")}
              >
                <Check className="inline mr-2" size={20} />
                Paid
                <span className="bg-green-500 text-white rounded-full px-3 py-1 ml-2">
                  {isPaid}
                </span>
              </button>
              <button
                className={`text-lg font-bold px-8 py-3 ${
                  filter === "REJECTED"
                    ? "bg-white text-black"
                    : "bg-black text-white border-2 border-white"
                } rounded-xl hover:bg-white hover:text-black transition-all duration-300 shadow-lg`}
                onClick={() => setFilter("REJECTED")}
              >
                <X className="inline mr-2" size={20} />
                Rejected
                <span className="bg-red-500 text-white rounded-full px-3 py-1 ml-2">
                  {isRejected}
                </span>
              </button>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {paginatedApps && paginatedApps.length > 0 ? (
                paginatedApps.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div
                      className={`h-2 w-full ${
                        request.status === "PENDING"
                          ? "bg-yellow-400"
                          : request.status === "PAID"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {request.tutor.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {request.tutor.email}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-4 py-2 rounded-full ${
                            request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-700">
                          <DollarSign
                            size={18}
                            className="mr-3 text-green-500"
                          />
                          <span className="font-medium">Amount:</span>
                          <span className="ml-2 text-2xl font-bold text-green-600">
                            ${request.amount}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <CreditCard
                            size={18}
                            className="mr-3 text-green-500"
                          />
                          <span className="font-medium">UPI ID:</span>
                          <span className="ml-2 text-gray-900">
                            {request.upi_id}
                          </span>
                        </div>

                        {request.bank_name && (
                          <div className="flex items-center text-gray-700">
                            <Building2
                              size={18}
                              className="mr-3 text-green-500"
                            />
                            <span className="font-medium">Bank:</span>
                            <span className="ml-2 text-gray-900">
                              {request.bank_name}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-gray-700">
                          <Calendar size={18} className="mr-3 text-green-500" />
                          <span className="font-medium">Requested:</span>
                          <span className="ml-2 text-gray-900 text-sm">
                            {new Date(request.requested_at).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {request.processed_at && (
                          <div className="flex items-center text-gray-700">
                            <Calendar
                              size={18}
                              className="mr-3 text-green-500"
                            />
                            <span className="font-medium">Processed:</span>
                            <span className="ml-2 text-gray-900 text-sm">
                              {new Date(
                                request.processed_at
                              ).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {request.status === "PENDING" ? (
                        <>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                            >
                              <Check className="inline mr-2" size={18} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                            >
                              <X className="inline mr-2" size={18} />
                              Reject
                            </button>
                          </div>
                          <button
                            onClick={() => handleNavigate(request)}
                            className="w-full bg-black text-white px-6 py-3 mt-2 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                          >
                            View Details
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="w-full bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <FileText className="mx-auto mb-4 text-gray-600" size={80} />
                  <p className="text-gray-400 text-2xl font-medium">
                    No payout requests found
                  </p>
                </div>
              )}
            </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
          </div>

          {/* Details Modal */}
          {isModalOpen && selectedRequest && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* backdrop */}
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsModalOpen(false)}
              />

              {/* modal wrapper */}
              <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-black rounded-3xl shadow-[0_20px_60px_rgba(0,255,80,0.3)] overflow-hidden ring-1 ring-green-600/40">
                  {/* HEADER */}
                  <div className="sticky top-0 z-10 bg-green-600 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                          Payout Request Details
                        </h2>
                        <p className="text-sm  mt-1">
                          Review and process the payout
                        </p>
                      </div>

                      <button
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close modal"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-8 bg-black text-white rounded-b-3xl space-y-6">
                    {/* Tutor + Date */}
                    <div className="flex items-center justify-between bg-black/40 border border-green-700/30 rounded-xl p-4">
                      <div>
                        <p className="text-sm text-green-300 mb-1">
                          Tutor Name
                        </p>
                        <p className="text-xl font-bold text-white">
                          {selectedRequest.tutor_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-300 mb-1">
                          Requested At
                        </p>
                        <p className="text-sm text-gray-300">
                          {new Date(
                            selectedRequest.requested_at
                          ).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Amount Card */}
                    <div className="bg-green-600 rounded-xl p-5 flex flex-col justify-center shadow-lg">
                      <p className="text-sm  mb-1">Amount</p>
                      <p className="text-4xl font-extrabold ">
                        ${Number(selectedRequest.amount).toFixed(2)}
                      </p>
                    </div>

                    {/* UPI + Bank */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black border border-green-700/30 rounded-xl p-4">
                        <p className="text-sm text-green-300 mb-1">UPI ID</p>
                        <p className="text-lg font-medium text-white">
                          {selectedRequest.upi_id}
                        </p>
                      </div>
                      <div className="bg-black border border-green-700/30 rounded-xl p-4">
                        <p className="text-sm text-green-300 mb-1">Bank Name</p>
                        <p className="text-lg font-medium text-white">
                          {selectedRequest.bank_name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-black border border-green-700/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-300 mb-1">Status</p>
                        <span
                          className={`inline-block text-sm font-bold px-4 py-2 rounded-full ${
                            selectedRequest.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-900"
                              : selectedRequest.status === "PAID"
                              ? "bg-green-300 text-green-900"
                              : "bg-red-300 text-red-900"
                          }`}
                        >
                          {selectedRequest.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-green-300 mb-1">
                          Request ID
                        </p>
                        <p className="text-xs text-gray-300">
                          {selectedRequest.id}
                        </p>
                      </div>
                    </div>

                    {/* Admin Note */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-green-300">
                        Admin Note
                      </label>
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add a note (optional)..."
                        className="w-full p-4 bg-black border-2 border-green-700/40 text-white rounded-xl 
                         focus:border-green-500 focus:ring-2 focus:ring-green-600 transition-all"
                        rows="4"
                        disabled={selectedRequest.status !== "PENDING"}
                      />
                    </div>

                    {/* ACTION BUTTONS */}
                    {selectedRequest.status === "PENDING" && (
                      <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <button
                          onClick={() => handleApprove(selectedRequest.id)}
                          className="flex-1 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.02] transition"
                        >
                          <Check size={18} />
                          Approve Payment
                        </button>

                        <button
                          onClick={() => handleReject(selectedRequest.id)}
                          className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.02] transition"
                        >
                          <X size={18} />
                          Reject Request
                        </button>
                      </div>
                    )}
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

export default PayoutRequests;
